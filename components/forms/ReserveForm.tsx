"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { requestReservation } from "@/app/actions/reserve";
import { booking } from "@/content/site";
import { formatDate } from "@/lib/booking-dates";
import { reservationSchema } from "@/lib/schemas";
import { BookingSuccess } from "./BookingSuccess";
import { DatePicker } from "./DatePicker";
import { Field, FieldError, inputClass } from "./Field";
import { PrivacyNote } from "./PrivacyNote";
import { Stepper } from "./Stepper";
import { SubmitButton } from "./SubmitButton";
import { TimeSlots } from "./TimeSlots";
import { Turnstile, type TurnstileHandle } from "./Turnstile";
import { useBookingForm } from "./useBookingForm";

const fields = ["date", "time", "guests", "name", "email", "phone", "notes"] as const;

type Values = {
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  notes: string;
  website: string;
};

export function ReserveForm() {
  const uid = useId();
  const { values, set, blur, errors, validate, showServerErrors } = useBookingForm<Values>(
    reservationSchema,
    {
      date: "",
      time: booking.reservation.times[1],
      guests: 2,
      name: "",
      email: "",
      phone: "",
      notes: "",
      website: "",
    },
  );
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState<{ reference: string; emailSent: boolean } | null>(null);
  const [token, setToken] = useState("");
  const turnstile = useRef<TurnstileHandle>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setFormError(null);
    if (!validate([...fields])) return;
    setPending(true);
    try {
      const result = await requestReservation(values, token);
      if (result.ok) {
        setDone({ reference: result.reference, emailSent: result.emailSent });
        return;
      }
      if (result.fieldErrors) showServerErrors(result.fieldErrors);
      if (result.message) setFormError(result.message);
      turnstile.current?.reset();
    } catch {
      setFormError(
        "We couldn't send your request just now. Try again in a moment, or call us to book.",
      );
      turnstile.current?.reset();
    } finally {
      setPending(false);
    }
  }

  if (done) {
    const party = `${values.guests} ${values.guests === 1 ? "guest" : "guests"}`;
    return (
      <BookingSuccess title="Request sent" reference={done.reference}>
        <p>
          A table for {party} on {formatDate(values.date)} at {values.time}. We&apos;ll confirm by
          email within a day.
        </p>
        <p>
          {done.emailSent
            ? `A copy of your request is on its way to ${values.email}.`
            : "We couldn't send your copy by email, but we have your request and will contact you."}
        </p>
      </BookingSuccess>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid gap-8"
      aria-describedby={formError ? `${uid}-form-error` : undefined}
    >
      <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
        <div className="grid content-start gap-6">
          <div className="grid gap-2" data-field="date">
            <span id={`${uid}-date-label`} className="text-secondary font-medium">
              Date
            </span>
            <DatePicker
              value={values.date}
              onChange={(v) => {
                set("date", v);
                blur("date", v);
              }}
              labelledBy={`${uid}-date-label`}
              describedBy={errors.date ? `${uid}-date-error` : undefined}
            />
            {errors.date && <FieldError id={`${uid}-date-error`}>{errors.date}</FieldError>}
          </div>
          <div data-field="time">
            <TimeSlots
              label="Time"
              times={booking.reservation.times}
              value={values.time}
              onChange={(v) => set("time", v)}
              error={errors.time}
            />
          </div>
          <div data-field="guests">
            <Stepper
              label="Guests"
              unit="guest"
              value={values.guests}
              min={1}
              max={booking.reservation.maxGuests}
              onChange={(n) => set("guests", n)}
              hint={`Up to ${booking.reservation.maxGuests} online. For a larger group, call us.`}
            />
          </div>
        </div>

        <div className="grid content-start gap-6">
          <Field id={`${uid}-name`} label="Name" error={errors.name}>
            {(a11y) => (
              <div data-field="name">
                <input
                  {...a11y}
                  name="name"
                  autoComplete="name"
                  className={inputClass}
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  onBlur={() => blur("name")}
                />
              </div>
            )}
          </Field>
          <Field
            id={`${uid}-email`}
            label="Email"
            error={errors.email}
            hint="We'll send your confirmation here."
          >
            {(a11y) => (
              <div data-field="email">
                <input
                  {...a11y}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  className={inputClass}
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  onBlur={() => blur("email")}
                />
              </div>
            )}
          </Field>
          <Field
            id={`${uid}-phone`}
            label="Phone"
            required={false}
            error={errors.phone}
            hint="In case we need to reach you on the day."
          >
            {(a11y) => (
              <div data-field="phone">
                <input
                  {...a11y}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="604 555 0123"
                  className={inputClass}
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  onBlur={() => blur("phone")}
                />
              </div>
            )}
          </Field>
          <Field
            id={`${uid}-notes`}
            label="Notes"
            required={false}
            error={errors.notes}
            hint="Allergies, a birthday, a high chair."
          >
            {(a11y) => (
              <div data-field="notes">
                <textarea
                  {...a11y}
                  name="notes"
                  rows={3}
                  className={`${inputClass} min-h-24 resize-y`}
                  value={values.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  onBlur={() => blur("notes")}
                />
              </div>
            )}
          </Field>

          {/* Spam trap: hidden from people and screen readers; bots fill it in. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor={`${uid}-website`}>Leave this field empty</label>
            <input
              id={`${uid}-website`}
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={(e) => set("website", e.target.value)}
            />
          </div>

          <Turnstile ref={turnstile} onToken={setToken} />

          {formError && (
            <div id={`${uid}-form-error`} role="alert">
              <FieldError>{formError}</FieldError>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <SubmitButton pending={pending}>Request a table</SubmitButton>
            <p className="text-secondary text-ink-muted">No payment is needed to reserve.</p>
          </div>
          <PrivacyNote />
        </div>
      </div>
    </form>
  );
}
