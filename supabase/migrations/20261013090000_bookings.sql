-- Koba bookings (ARCHITECTURE.md section 7).
-- Row Level Security is on for every table with no policies, and the public
-- API roles have no grants: only the server, with the service key, gets in.

-- Regular reservations -------------------------------------------------------
create table public.reservations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  date        date not null,
  time_slot   text not null,
  guests      int  not null check (guests between 1 and 20),
  name        text not null check (char_length(name) between 1 and 80),
  email       text not null check (char_length(email) between 3 and 254),
  phone       text check (phone is null or char_length(phone) <= 40),
  notes       text check (notes is null or char_length(notes) <= 500),
  status      text not null default 'requested'
              check (status in ('requested', 'confirmed', 'cancelled'))
);
create index reservations_date_idx on public.reservations (date);

-- Gursha Table sittings: one row per date and sitting, created on first booking.
create table public.gursha_sessions (
  date         date not null,
  time_slot    text not null,
  capacity     int  not null check (capacity > 0),
  seats_taken  int  not null default 0 check (seats_taken >= 0),
  primary key (date, time_slot),
  check (seats_taken <= capacity)
);

create table public.gursha_bookings (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  date        date not null,
  time_slot   text not null,
  seats       int  not null check (seats between 1 and 12),
  set_type    text not null check (set_type in ('standard', 'vegetarian', 'vegan')),
  name        text not null check (char_length(name) between 1 and 80),
  email       text not null check (char_length(email) between 3 and 254),
  phone       text check (phone is null or char_length(phone) <= 40),
  notes       text check (notes is null or char_length(notes) <= 500),
  status      text not null default 'requested'
              check (status in ('requested', 'confirmed', 'cancelled')),
  foreign key (date, time_slot) references public.gursha_sessions (date, time_slot)
);
create index gursha_bookings_date_idx on public.gursha_bookings (date);

-- Rate limiting: hashed keys only, never raw IPs.
create table public.rate_limits (
  key             text primary key,
  window_started  timestamptz not null default now(),
  hits            int not null default 0
);

alter table public.reservations    enable row level security;
alter table public.gursha_sessions enable row level security;
alter table public.gursha_bookings enable row level security;
alter table public.rate_limits     enable row level security;

revoke all on public.reservations, public.gursha_sessions, public.gursha_bookings, public.rate_limits
  from anon, authenticated;

-- Seats left per sitting for one date. Sittings with no bookings yet are full capacity.
create function public.gursha_seats_left(p_date date, p_slots text[], p_capacity int)
returns table (time_slot text, seats_left int)
language sql stable
set search_path = public
as $$
  select s.slot, coalesce(g.capacity - g.seats_taken, p_capacity)
  from unnest(p_slots) as s(slot)
  left join public.gursha_sessions g on g.date = p_date and g.time_slot = s.slot;
$$;

-- Book Gursha seats atomically. The sitting's row is locked for the duration,
-- so two guests taking the last seats at the same moment can't both succeed.
create function public.book_gursha(
  p_date date, p_time_slot text, p_seats int, p_set_type text,
  p_name text, p_email text, p_phone text, p_notes text, p_capacity int
)
returns table (booking_id uuid, seats_left int)
language plpgsql
set search_path = public
as $$
declare
  v_session public.gursha_sessions%rowtype;
  v_id uuid;
begin
  insert into public.gursha_sessions (date, time_slot, capacity)
  values (p_date, p_time_slot, p_capacity)
  on conflict (date, time_slot) do nothing;

  select * into v_session from public.gursha_sessions
  where date = p_date and time_slot = p_time_slot
  for update;

  if v_session.seats_taken + p_seats > v_session.capacity then
    raise exception 'not_enough_seats'
      using errcode = 'P0001',
            detail = (v_session.capacity - v_session.seats_taken)::text;
  end if;

  update public.gursha_sessions
  set seats_taken = seats_taken + p_seats
  where date = p_date and time_slot = p_time_slot;

  insert into public.gursha_bookings (date, time_slot, seats, set_type, name, email, phone, notes)
  values (p_date, p_time_slot, p_seats, p_set_type, p_name, p_email, nullif(p_phone, ''), nullif(p_notes, ''))
  returning id into v_id;

  return query select v_id, v_session.capacity - v_session.seats_taken - p_seats;
end;
$$;

-- Fixed-window rate limit. Returns true when the request is allowed.
create function public.hit_rate_limit(p_key text, p_window_seconds int, p_max int)
returns boolean
language plpgsql
set search_path = public
as $$
declare
  v_hits int;
begin
  insert into public.rate_limits as r (key, window_started, hits)
  values (p_key, now(), 1)
  on conflict (key) do update
    set hits = case
                 when r.window_started < now() - make_interval(secs => p_window_seconds) then 1
                 else r.hits + 1
               end,
        window_started = case
                 when r.window_started < now() - make_interval(secs => p_window_seconds) then now()
                 else r.window_started
               end
  returning hits into v_hits;
  return v_hits <= p_max;
end;
$$;

revoke execute on function public.gursha_seats_left(date, text[], int) from public, anon, authenticated;
revoke execute on function public.book_gursha(date, text, int, text, text, text, text, text, int) from public, anon, authenticated;
revoke execute on function public.hit_rate_limit(text, int, int) from public, anon, authenticated;
grant execute on function public.gursha_seats_left(date, text[], int) to service_role;
grant execute on function public.book_gursha(date, text, int, text, text, text, text, text, int) to service_role;
grant execute on function public.hit_rate_limit(text, int, int) to service_role;

-- Retention: delete bookings 12 months after the visit, and stale rate-limit
-- rows after a day. Runs daily at 10:15 UTC (3:15 am in Vancouver).
create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
  'koba-retention',
  '15 10 * * *',
  $$
    delete from public.gursha_bookings where date < current_date - interval '12 months';
    delete from public.gursha_sessions where date < current_date - interval '12 months';
    delete from public.reservations    where date < current_date - interval '12 months';
    delete from public.rate_limits     where window_started < now() - interval '1 day';
  $$
);
