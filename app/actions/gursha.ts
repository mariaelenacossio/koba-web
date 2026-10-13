"use server";

import GurshaConfirmation from "@/emails/GurshaConfirmation";
import RestaurantNotification from "@/emails/RestaurantNotification";
import { booking } from "@/content/site";
import { dateProblem, formatDate } from "@/lib/booking-dates";
import { serverEnv } from "@/lib/env";
import { allowRequest } from "@/lib/ratelimit";
import { clientIp } from "@/lib/request";
import { sendEmail } from "@/lib/resend";
import { fieldErrors, gurshaSchema } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
import { verifyTurnstile } from "@/lib/turnstile";
import { genericFailure, type BookingResult } from "./types";

/** Seats left in each sitting on a date. Unknown or unbookable dates return nothing. */
export async function gurshaAvailability(date: string): Promise<Record<string, number>> {
  if (dateProblem(date)) return {};
  const { data, error } = await supabase().rpc("gursha_seats_left", {
    p_date: date,
    p_slots: [...booking.gursha.times],
    p_capacity: booking.gursha.seatsPerSitting,
  });
  if (error || !data) return {};
  return Object.fromEntries(
    (data as Array<{ time_slot: string; seats_left: number }>).map((r) => [
      r.time_slot,
      r.seats_left,
    ]),
  );
}

export async function requestGurshaSeats(
  input: unknown,
  turnstileToken: string,
): Promise<BookingResult> {
  const parsed = gurshaSchema.safeParse(input);
  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "website"))
      return { ok: false, message: genericFailure };
    return { ok: false, fieldErrors: fieldErrors(parsed.error) };
  }
  const data = parsed.data;
  const ip = await clientIp();

  if (!(await allowRequest(ip, "gursha"))) {
    return {
      ok: false,
      message:
        "You've sent several requests in a few minutes. Wait a little and try again, or call us.",
    };
  }
  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return {
      ok: false,
      message: "We couldn't confirm you're not a bot. Reload the page and try again.",
    };
  }

  const { data: rows, error } = await supabase().rpc("book_gursha", {
    p_date: data.date,
    p_time_slot: data.time,
    p_seats: data.seats,
    p_set_type: data.setType,
    p_name: data.name,
    p_email: data.email,
    p_phone: data.phone,
    p_notes: data.notes,
    p_capacity: booking.gursha.seatsPerSitting,
  });

  if (error) {
    if (error.message === "not_enough_seats") {
      const seatsLeft = Number(error.details ?? 0);
      const other = booking.gursha.times.find((t) => t !== data.time);
      return {
        ok: false,
        seatsLeft,
        message:
          seatsLeft > 0
            ? `Only ${seatsLeft} ${seatsLeft === 1 ? "seat is" : "seats are"} left at ${data.time}. Choose fewer seats${other ? ` or the ${other} sitting` : ""}.`
            : `The ${data.time} sitting is full.${other ? ` Try the ${other} sitting or another day.` : " Try another day."}`,
      };
    }
    return { ok: false, message: genericFailure };
  }

  const row = (rows as Array<{ booking_id: string }> | null)?.[0];
  if (!row) return { ok: false, message: genericFailure };

  const reference = row.booking_id.slice(0, 8).toUpperCase();
  const date = formatDate(data.date);
  const setLabel =
    booking.gursha.setTypes.find((s) => s.value === data.setType)?.label ?? data.setType;
  const total = `$${data.seats * booking.gursha.pricePerSeat}`;
  const party = `${data.seats} ${data.seats === 1 ? "seat" : "seats"}`;

  const [emailSent] = await Promise.all([
    sendEmail({
      to: data.email,
      subject: `Your Gursha Table request for ${date}`,
      replyTo: serverEnv.notifyEmail(),
      email: GurshaConfirmation({
        name: data.name,
        date,
        time: data.time,
        seats: data.seats,
        setLabel,
        total,
        notes: data.notes || undefined,
      }),
    }),
    sendEmail({
      to: serverEnv.notifyEmail(),
      subject: `New Gursha Table request: ${date}, ${data.time}, ${party}`,
      replyTo: data.email,
      email: RestaurantNotification({
        kind: "Gursha Table",
        date,
        time: data.time,
        party,
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        setLabel,
        notes: data.notes || undefined,
        reference,
      }),
    }),
  ]);

  return { ok: true, reference, emailSent };
}
