"use client";

import { useId } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { FieldError } from "./Field";

type Props = {
  label: string;
  times: readonly string[];
  value: string;
  onChange: (value: string) => void;
  /** Times that can't be chosen right now (a full Gursha sitting). */
  unavailable?: readonly string[];
  note?: string;
  error?: string | null;
};

/** Time slots as a radio group, built on the segmented control. */
export function TimeSlots({ label, times, value, onChange, unavailable = [], note, error }: Props) {
  const id = useId();
  return (
    <div className="grid content-start gap-2">
      <span id={`${id}-label`} className="text-secondary font-medium">
        {label}
      </span>
      <SegmentedControl
        labelledBy={`${id}-label`}
        options={times.map((t) => ({ value: t, label: t, disabled: unavailable.includes(t) }))}
        value={value}
        onValueChange={onChange}
      />
      {note && !error && (
        <p className="text-meta text-ink-muted" aria-live="polite">
          {note}
        </p>
      )}
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}
