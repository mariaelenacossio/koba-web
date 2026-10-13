import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  label: string;
  /** "(optional)" is added to the label when false. */
  required?: boolean;
  hint?: string;
  error?: string | null;
  className?: string;
  children: (a11y: { id: string; "aria-describedby"?: string; "aria-invalid"?: true }) => ReactNode;
};

/**
 * A visible label above every input, an optional hint for format, and the
 * error in the same slot below, linked to the input (DESIGN.md section 4).
 */
export function Field({ id, label, required = true, hint, error, className, children }: Props) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("grid content-start gap-2", className)}>
      <label htmlFor={id} className="text-secondary font-medium">
        {label}
        {!required && <span className="font-normal text-ink-muted"> (optional)</span>}
      </label>
      {children({
        id,
        "aria-describedby": describedBy,
        ...(error ? { "aria-invalid": true } : {}),
      })}
      {hint && !error && (
        <p id={hintId} className="text-meta text-ink-muted">
          {hint}
        </p>
      )}
      {error && <FieldError id={errorId!}>{error}</FieldError>}
    </div>
  );
}

export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-2 text-secondary text-error">
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        className="mt-0.5 flex-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5.5M12 16.5v.01" strokeLinecap="round" />
      </svg>
      <span>{children}</span>
    </p>
  );
}

/** Shared input styling: surface background, 1px line border, 2px radius, 44px tall. */
export const inputClass =
  "min-h-11 w-full rounded-ctl border border-line-strong bg-surface px-3 py-2 text-body text-ink transition-colors duration-150 placeholder:text-ink-muted/80 hover:border-ink-muted focus-visible:border-gold aria-invalid:border-error";
