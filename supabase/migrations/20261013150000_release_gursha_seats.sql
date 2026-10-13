-- Delete Gursha bookings and give their seats back to the sitting, in one
-- transaction. Sittings left with no seats taken are removed, which reads the
-- same as a fresh sitting (full capacity). Used by the end-to-end test cleanup
-- and available for real cancellations. Service role only.
create function public.release_gursha_seats(p_ids uuid[])
returns int
language plpgsql
set search_path = public
as $$
declare
  v_count int;
begin
  -- Data-modifying CTEs always run, so the update happens even though only
  -- the count of deleted bookings is selected.
  with gone as (
    delete from public.gursha_bookings
    where id = any(p_ids)
    returning date, time_slot, seats
  ), totals as (
    select date, time_slot, sum(seats)::int as seats
    from gone
    group by date, time_slot
  ), released as (
    update public.gursha_sessions s
    set seats_taken = greatest(s.seats_taken - t.seats, 0)
    from totals t
    where s.date = t.date and s.time_slot = t.time_slot
    returning 1
  )
  select count(*) into v_count from gone;

  delete from public.gursha_sessions s
  where s.seats_taken = 0
    and not exists (
      select 1 from public.gursha_bookings b
      where b.date = s.date and b.time_slot = s.time_slot
    );

  return v_count;
end;
$$;

revoke execute on function public.release_gursha_seats(uuid[]) from public, anon, authenticated;
grant execute on function public.release_gursha_seats(uuid[]) to service_role;
