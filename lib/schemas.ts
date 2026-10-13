import { z } from "zod";
import { booking } from "@/content/site";
import { dateProblem } from "./booking-dates";

/*
  One set of rules for both booking forms, used in the browser (checked on
  first blur, cleared as soon as the guest fixes the field) and again in the
  server actions. Messages explain the fix, never blame.
*/

const dateMessages = {
  format: "Choose a date for your visit.",
  past: "Choose today or a later date.",
  closed: "We're closed on Mondays. Choose another day.",
  "too-far": `Choose a date within the next ${booking.windowDays} days.`,
} as const;

export const dateField = z.string().superRefine((value, ctx) => {
  const problem = dateProblem(value);
  if (problem) ctx.addIssue({ code: "custom", message: dateMessages[problem] });
});

export const nameField = z
  .string()
  .trim()
  .min(1, "Add your name so we know who to expect.")
  .max(80, "Use 80 characters or fewer for your name.");

export const emailField = z
  .string()
  .trim()
  .min(1, "Enter your email so we can confirm your booking.")
  .pipe(z.email("Enter an email like name@example.com."));

// Optional. When given, it should look like a phone number.
export const phoneField = z
  .string()
  .trim()
  .refine(
    (v) => v === "" || (/^[+\d\s().-]+$/.test(v) && v.replace(/\D/g, "").length >= 7),
    "Enter a phone number like 604 555 0123, or leave it empty.",
  );

export const notesField = z.string().trim().max(500, "Keep notes to 500 characters or fewer.");

/** Spam trap: a field people never see. Anything in it means a bot. */
export const honeypotField = z.string().max(0);

const reservationTimes = booking.reservation.times;
const gurshaTimes = booking.gursha.times;
const setTypes = booking.gursha.setTypes.map((s) => s.value) as [string, ...string[]];

export const reservationSchema = z.object({
  date: dateField,
  time: z.enum(reservationTimes, { message: "Choose a time." }),
  guests: z.coerce
    .number()
    .int()
    .min(1, "Book for at least 1 guest.")
    .max(
      booking.reservation.maxGuests,
      `For more than ${booking.reservation.maxGuests} guests, call us and we'll set up the table.`,
    ),
  name: nameField,
  email: emailField,
  phone: phoneField,
  notes: notesField,
  website: honeypotField,
});

export const gurshaSchema = z.object({
  date: dateField,
  time: z.enum(gurshaTimes, { message: "Choose a sitting." }),
  seats: z.coerce
    .number()
    .int()
    .min(1, "Book at least 1 seat.")
    .max(
      booking.gursha.maxSeatsPerBooking,
      `You can book up to ${booking.gursha.maxSeatsPerBooking} seats at once.`,
    ),
  setType: z.enum(setTypes, { message: "Choose a set." }),
  name: nameField,
  email: emailField,
  phone: phoneField,
  notes: notesField,
  website: honeypotField,
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type GurshaInput = z.infer<typeof gurshaSchema>;

/** Field errors keyed by field name, first message only. */
export type FieldErrors = Partial<Record<string, string>>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

/** Validate a single field against a schema, for blur and edit checks. */
export function checkField(
  schema: typeof reservationSchema | typeof gurshaSchema,
  name: string,
  value: unknown,
): string | null {
  const shape = schema.shape as Record<string, z.ZodType>;
  const field = shape[name];
  if (!field) return null;
  const result = field.safeParse(value);
  return result.success ? null : (result.error.issues[0]?.message ?? null);
}
