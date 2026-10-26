"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { gurshaAvailability, requestGurshaSeats } from "@/app/actions/gursha";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { booking } from "@/content/site";
import { formatDate } from "@/lib/booking-dates";
import { gurshaSchema } from "@/lib/schemas";
import { BookingSuccess } from "./BookingSuccess";
import { DatePicker } from "./DatePicker";
import { Field, FieldError, inputClass, RequiredNote } from "./Field";
import { PrivacyNote } from "./PrivacyNote";
import { Stepper } from "./Stepper";
import { SubmitButton } from "./SubmitButton";
import { TimeSlots } from "./TimeSlots";
import { Turnstile, type TurnstileHandle } from "./Turnstile";
import { clearDraft, isDirty, readDraft, useSaveDraft, useWarnOnLeave } from "./draft";
import { useBookingForm } from "./useBookingForm";

const STEPS = [
  { title: "When", fields: ["date", "time", "seats"] },
  { title: "Your details", fields: ["setType", "name", "email", "phone", "notes"] },
  { title: "Review", fields: [] },
] as const;

const DRAFT_KEY = "koba-gursha-draft";

type Values = {
  date: string;
  time: string;
  seats: number;
  setType: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  website: string;
};

const blank: Values = {
  date: "",
  time: booking.gursha.times[0],
  seats: 2,
  setType: booking.gursha.setTypes[0].value,
  name: "",
  email: "",
  phone: "",
  notes: "",
  website: "",
};

/**
 * Three steps, each with its own URL (?step=1|2|3) so Back works and a refresh
 * keeps the guest's place. Answers are kept in sessionStorage for this tab
 * only, and cleared once the request is sent.
 */
export function GurshaBooking() {
  const uid = useId();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const requested = Number(params.get("step") ?? "1");
  const step = requested >= 1 && requested <= 3 ? requested : 1;

  // useSearchParams keeps this component out of the prerender, so it only
  // renders in the browser and can read sessionStorage for its first state.
  const [initial] = useState(() => readDraft(DRAFT_KEY, blank));
  const { values, set, blur, errors, validate, showServerErrors } = useBookingForm<Values>(
    gurshaSchema,
    initial,
  );
  const [seatsLeft, setSeatsLeft] = useState<Record<string, number>>({});
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState<{ reference: string; emailSent: boolean } | null>(null);
  const [token, setToken] = useState("");
  const turnstile = useRef<TurnstileHandle>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Keep answers for this tab, and ask before the tab closes with them unsent.
  useSaveDraft(DRAFT_KEY, values, done !== null);
  useWarnOnLeave(done === null && isDirty(values, blank));

  // A later step opened without the earlier answers goes back to step 1.
  useEffect(() => {
    if (step !== 1 && !values.date) router.replace(`${pathname}?step=1`, { scroll: false });
  }, [step, values.date, pathname, router]);

  // Seats left for the chosen date, refreshed when the date changes.
  useEffect(() => {
    if (!values.date) return;
    let active = true;
    gurshaAvailability(values.date).then((left) => {
      if (active) setSeatsLeft(left);
    });
    return () => {
      active = false;
    };
  }, [values.date]);

  // Move focus to the step heading when the step changes, but not when the
  // page first loads: then the skip link and page heading come first.
  const firstStep = useRef(step);
  useEffect(() => {
    if (step === firstStep.current) return;
    firstStep.current = -1;
    headingRef.current?.focus();
  }, [step]);

  function go(next: number) {
    router.push(`${pathname}?step=${next}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function onNext(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate([...STEPS[step - 1]!.fields])) return;
    go(step + 1);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setFormError(null);
    if (!validate([...STEPS[0].fields, ...STEPS[1].fields])) return;
    setPending(true);
    try {
      const result = await requestGurshaSeats(values, token);
      if (result.ok) {
        setDone({ reference: result.reference, emailSent: result.emailSent });
        clearDraft(DRAFT_KEY);
        // The request is sent, so the step no longer belongs in the URL.
        router.replace(pathname, { scroll: false });
        return;
      }
      if (result.fieldErrors) {
        const firstStep = STEPS.findIndex((s) => s.fields.some((f) => result.fieldErrors?.[f]));
        if (firstStep >= 0 && firstStep + 1 !== step) go(firstStep + 1);
        showServerErrors(result.fieldErrors);
      }
      if (result.message) setFormError(result.message);
      if (result.seatsLeft !== undefined) gurshaAvailability(values.date).then(setSeatsLeft);
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

  const total = values.seats * booking.gursha.pricePerSeat;
  const setLabel = booking.gursha.setTypes.find((s) => s.value === values.setType)?.label ?? "";
  const left = seatsLeft[values.time];
  const full = booking.gursha.times.filter((t) => seatsLeft[t] === 0);
  const maxSeats = Math.max(
    1,
    Math.min(booking.gursha.maxSeatsPerBooking, left ?? booking.gursha.maxSeatsPerBooking),
  );

  if (done) {
    return (
      <BookingSuccess title="Request sent" reference={done.reference}>
        <p>
          {values.seats} {values.seats === 1 ? "seat" : "seats"} at the Gursha Table on{" "}
          {formatDate(values.date)} at {values.time}, {setLabel.toLowerCase()}. We&apos;re holding
          your seats and will confirm by email within a day.
        </p>
        <p>Total ${total}, paid at the table.</p>
        <p>
          {done.emailSent
            ? `A copy of your request is on its way to ${values.email}.`
            : "We couldn't send your copy by email, but we have your request and will contact you."}
        </p>
      </BookingSuccess>
    );
  }

  const progress = <p className="text-secondary text-ink-muted">Step {step} of 3</p>;

  return (
    <div className="grid max-w-3xl gap-6">
      <div className="grid gap-1">
        {progress}
        <h2 ref={headingRef} tabIndex={-1} className="text-h3 focus:outline-none">
          {STEPS[step - 1]!.title}
        </h2>
      </div>

      {step === 1 && (
        <form onSubmit={onNext} noValidate className="grid max-w-md gap-6">
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
              label="Sitting"
              times={booking.gursha.times}
              value={values.time}
              unavailable={full}
              onChange={(v) => {
                set("time", v);
                const l = seatsLeft[v];
                if (l !== undefined && values.seats > l) set("seats", Math.max(1, l));
              }}
              note={
                values.date && left !== undefined
                  ? `${left} of ${booking.gursha.seatsPerSitting} seats left at ${values.time} on ${formatDate(values.date)}.`
                  : `${booking.gursha.seatsPerSitting} seats per sitting.`
              }
              error={errors.time}
            />
          </div>
          <div data-field="seats">
            <Stepper
              label="Seats"
              unit="seat"
              value={values.seats}
              min={1}
              max={maxSeats}
              onChange={(n) => set("seats", n)}
              hint={`$${booking.gursha.pricePerSeat} a seat, up to ${booking.gursha.maxSeatsPerBooking} per booking. Total $${total}, paid at the table.`}
            />
          </div>
          <div>
            <button type="submit" className="btn btn-primary">
              Continue to your details
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={onNext} noValidate className="grid gap-6">
          <RequiredNote />
          <div className="grid gap-2" data-field="setType">
            <span id={`${uid}-set-label`} className="text-secondary font-medium">
              Set for your booking
            </span>
            <SegmentedControl
              labelledBy={`${uid}-set-label`}
              options={booking.gursha.setTypes.map((s) => ({
                value: s.value,
                label: s.label.replace(" set", ""),
              }))}
              value={values.setType}
              onValueChange={(v) => set("setType", v)}
            />
            <p className="text-meta text-ink-muted">
              One set for everyone in this booking. Drinks are chosen at the table.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
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
              hint="Allergies, or who you're coming with."
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
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-primary">
              Review your request
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => go(1)}>
              Change date or seats
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={onSubmit} noValidate className="grid gap-6">
          <dl className="m-0 grid rounded-card border border-line bg-surface px-5 shadow-[var(--inset-shadow-edge)]">
            {[
              ["Date", values.date ? formatDate(values.date) : ""],
              ["Sitting", values.time],
              ["Seats", String(values.seats)],
              ["Set", setLabel],
              ["Name", values.name],
              ["Email", values.email],
              ...(values.phone ? [["Phone", values.phone]] : []),
              ...(values.notes ? [["Notes", values.notes]] : []),
            ].map(([term, detail]) => (
              <div
                key={term}
                className="grid gap-1 border-b border-line py-3 last:border-b-0 md:grid-cols-[10rem_1fr]"
              >
                <dt className="text-secondary text-ink-muted">{term}</dt>
                <dd className="m-0 break-words">{detail}</dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-secondary text-ink-muted">Total, paid at the table</dt>
              <dd className="m-0 font-display text-[2rem] leading-none text-gold-ink tabular-nums">
                ${total}
              </dd>
            </div>
          </dl>

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
            <div role="alert">
              <FieldError>{formError}</FieldError>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <SubmitButton pending={pending}>Request seats</SubmitButton>
            <button type="button" className="btn btn-secondary" onClick={() => go(2)}>
              Edit your details
            </button>
          </div>
          <PrivacyNote />
        </form>
      )}
    </div>
  );
}
