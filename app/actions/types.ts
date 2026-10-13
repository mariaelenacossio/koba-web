import type { FieldErrors } from "@/lib/schemas";

export type BookingResult =
  | {
      ok: true;
      /** Short booking reference shown to the guest and in emails. */
      reference: string;
      /** Whether the guest's confirmation email was accepted for delivery. */
      emailSent: boolean;
    }
  | {
      ok: false;
      fieldErrors?: FieldErrors;
      /** A message for the whole form, written for the guest. */
      message?: string;
      /** For a full Gursha sitting: seats still open. */
      seatsLeft?: number;
    };

export const genericFailure =
  "We couldn't send your request just now. Try again in a moment, or call us to book.";
