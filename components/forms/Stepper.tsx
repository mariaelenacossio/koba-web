"use client";

import { useId } from "react";
import { Tooltip } from "@/components/ui/Tooltip";

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  /** What one unit is called, for the button labels: "guest", "seat". */
  unit: string;
  hint?: string;
};

/** A number stepper with 44x44 buttons and an announced value. */
export function Stepper({ label, value, min, max, onChange, unit, hint }: Props) {
  const id = useId();
  const btn =
    "grid size-11 place-items-center border-0 bg-transparent text-ink transition-colors duration-150 hover:text-gold-ink aria-disabled:cursor-not-allowed aria-disabled:opacity-40";
  const set = (n: number) => onChange(Math.min(max, Math.max(min, n)));
  return (
    <div className="grid content-start gap-2" role="group" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className="text-secondary font-medium">
        {label}
      </span>
      <div className="flex w-max items-center rounded-ctl border border-line-control bg-surface">
        <Tooltip label={`Remove one ${unit}`} side="top" align="start">
          <button
            type="button"
            className={btn}
            aria-label={`Remove one ${unit}`}
            aria-disabled={value <= min || undefined}
            onClick={() => value > min && set(value - 1)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <path d="M6 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </Tooltip>
        <output
          aria-live="polite"
          className="min-w-12 border-x border-line-strong text-center font-display text-xl leading-11 tabular-nums"
        >
          {value}
          {/* Announced as "3 guests", not just "3". */}
          <span className="sr-only"> {value === 1 ? unit : `${unit}s`}</span>
        </output>
        <Tooltip label={`Add one ${unit}`} side="top">
          <button
            type="button"
            className={btn}
            aria-label={`Add one ${unit}`}
            aria-disabled={value >= max || undefined}
            onClick={() => value < max && set(value + 1)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <path
                d="M6 12h12M12 6v12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </Tooltip>
      </div>
      {hint && <p className="text-meta text-ink-muted">{hint}</p>}
    </div>
  );
}
