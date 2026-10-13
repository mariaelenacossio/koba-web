"use server";

import ReservationConfirmation from "@/emails/ReservationConfirmation";
import RestaurantNotification from "@/emails/RestaurantNotification";
import { formatDate } from "@/lib/booking-dates";
import { serverEnv } from "@/lib/env";
import { allowRequest } from "@/lib/ratelimit";
import { clientIp } from "@/lib/request";
import { sendEmail } from "@/lib/resend";
import { fieldErrors, reservationSchema } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
import { verifyTurnstile } from "@/lib/turnstile";
import { genericFailure, type BookingResult } from "./types";

export async function requestReservation(
  input: unknown,
  turnstileToken: string,
): Promise<BookingResult> {
  const parsed = reservationSchema.safeParse(input);
  if (!parsed.success) {
    // A filled honeypot is a bot: answer like a normal failure, save nothing.
    if (parsed.error.issues.some((i) => i.path[0] === "website"))
      return { ok: false, message: genericFailure };
    return { ok: false, fieldErrors: fieldErrors(parsed.error) };
  }
  const data = parsed.data;
  const ip = await clientIp();

  if (!(await allowRequest(ip, "reserve"))) {
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

  const { data: row, error } = await supabase()
    .from("reservations")
    .insert({
      date: data.date,
      time_slot: data.time,
      guests: data.guests,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      notes: data.notes || null,
    })
    .select("id")
    .single();
  if (error || !row) return { ok: false, message: genericFailure };

  const reference = String(row.id).slice(0, 8).toUpperCase();
  const date = formatDate(data.date);
  const party = `${data.guests} ${data.guests === 1 ? "guest" : "guests"}`;

  const [emailSent] = await Promise.all([
    sendEmail({
      to: data.email,
      subject: `Your Koba table request for ${date}`,
      replyTo: serverEnv.notifyEmail(),
      email: ReservationConfirmation({
        name: data.name,
        date,
        time: data.time,
        guests: data.guests,
        notes: data.notes || undefined,
      }),
    }),
    sendEmail({
      to: serverEnv.notifyEmail(),
      subject: `New table request: ${date}, ${data.time}, ${party}`,
      replyTo: data.email,
      email: RestaurantNotification({
        kind: "Table",
        date,
        time: data.time,
        party,
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        notes: data.notes || undefined,
        reference,
      }),
    }),
  ]);

  return { ok: true, reference, emailSent };
}
