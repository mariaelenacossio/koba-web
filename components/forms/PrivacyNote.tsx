import { booking } from "@/content/site";

/** What we keep and why, under every booking form. */
export function PrivacyNote() {
  return (
    <p className="max-w-prose text-meta text-ink-muted">
      We use your name, email and phone only to confirm and look after this booking. We delete
      booking details {booking.retentionMonths} months after your visit, and we never share them.
    </p>
  );
}
