"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import styles from "./SegmentedControl.module.css";

/*
  Adapted from the 21st.dev "Segmented Control" by ddoemonn (component 23552,
  https://21st.dev/r/ddoemonn/segmented-control). Kept: the radio-group
  semantics, roving tabindex, arrow/Home/End keys and the sliding-thumb
  technique (a second copy of the labels inside the thumb, counter-shifted, so
  the selected label recolors exactly under the thumb). Changed for Koba:
  - Motion (springs) replaced by one CSS transform transition, 200ms ease-out,
    so there is no bounce and no animation library (ARCHITECTURE.md section 5).
  - Every color, radius, size and focus style comes from the Koba tokens
    (DESIGN.md sections 4 and 6): 44px targets, 2px radius, no shadows, the
    gold focus ring, sentence-case 15px labels.
  - Options can carry a lang, so the Amharic label is marked lang="am".
*/

export type SegmentedOption = {
  value: string;
  label: string;
  /** BCP 47 language of the label, e.g. "am" for Amharic. */
  lang?: string;
  disabled?: boolean;
};

type Props = {
  options: readonly SegmentedOption[];
  /** Accessible name of the group. Shown visually by the caller's own label. */
  label?: string;
  /** id of a visible element that labels the group (preferred over `label`). */
  labelledBy?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

export function SegmentedControl({
  options,
  label,
  labelledBy,
  value,
  defaultValue,
  onValueChange,
  className,
}: Props) {
  const count = Math.max(1, options.length);
  const [internal, setInternal] = useState(() => defaultValue ?? options[0]?.value ?? "");
  const controlled = value !== undefined;
  const current = controlled ? value : internal;
  const found = options.findIndex((o) => o.value === current);
  const index = found < 0 ? 0 : found;
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const select = useCallback(
    (next: string) => {
      if (!controlled) setInternal(next);
      if (next !== current) onValueChange?.(next);
    },
    [controlled, current, onValueChange],
  );

  // Next enabled option from `from` in direction `dir`, wrapping around.
  const seek = useCallback(
    (from: number, dir: 1 | -1) => {
      let i = from;
      for (let k = 0; k < count; k++) {
        i = (i + dir + count) % count;
        if (!options[i]?.disabled) return i;
      }
      return from;
    },
    [count, options],
  );

  function go(i: number) {
    const option = options[i];
    if (!option || option.disabled) return;
    buttons.current[i]?.focus();
    select(option.value);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, i: number) {
    const keys: Record<string, () => number> = {
      ArrowRight: () => seek(i, 1),
      ArrowDown: () => seek(i, 1),
      ArrowLeft: () => seek(i, -1),
      ArrowUp: () => seek(i, -1),
      Home: () => seek(count - 1, 1),
      End: () => seek(0, -1),
    };
    const target = keys[event.key];
    if (!target) return;
    event.preventDefault();
    go(target());
  }

  const columns = { gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` };
  // Thumb and its counter-shifted label strip move by transform only.
  const thumb = {
    width: `${100 / count}%`,
    transform: `translateX(${index * 100}%)`,
  };
  const strip = {
    width: `${count * 100}%`,
    transform: `translateX(${(index * -100) / count}%)`,
    ...columns,
  };

  return (
    <div
      role="radiogroup"
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      className={cn(styles.root, className)}
    >
      <div className={styles.track} style={columns}>
        {options.map((option, i) => (
          <span
            key={option.value}
            aria-hidden="true"
            lang={option.lang}
            className={cn(
              styles.segment,
              styles.label,
              option.disabled && styles.disabled,
              i === index && styles.under,
            )}
          >
            {option.label}
          </span>
        ))}

        <div aria-hidden="true" className={styles.thumb} style={thumb}>
          <div className={styles.strip} style={strip}>
            {options.map((option) => (
              <span
                key={option.value}
                lang={option.lang}
                className={cn(styles.segment, styles.thumbLabel)}
              >
                {option.label}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.hits} style={columns}>
          {options.map((option, i) => (
            <button
              key={option.value}
              ref={(node) => {
                buttons.current[i] = node;
              }}
              type="button"
              role="radio"
              aria-checked={i === index}
              aria-disabled={option.disabled || undefined}
              tabIndex={i === index ? 0 : -1}
              onClick={() => !option.disabled && select(option.value)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={styles.hit}
            >
              <span className="sr-only" lang={option.lang}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
