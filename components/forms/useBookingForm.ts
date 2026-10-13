"use client";

import { useCallback, useRef, useState } from "react";
import {
  checkField,
  type FieldErrors,
  type gurshaSchema,
  type reservationSchema,
} from "@/lib/schemas";

type Schema = typeof reservationSchema | typeof gurshaSchema;

/**
 * Validation timing from DESIGN.md and the forms skill: a field is checked
 * when the guest first leaves it, its error clears as soon as they edit it,
 * and after that it re-checks as they type. Submit is never disabled; on a
 * failed submit, focus and scroll go to the first field with an error.
 */
export function useBookingForm<T extends Record<string, string | number>>(
  schema: Schema,
  initial: T,
) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const touched = useRef(new Set<string>());

  const set = useCallback(
    <K extends keyof T & string>(name: K, value: T[K]) => {
      setValues((v) => ({ ...v, [name]: value }));
      setErrors((e) => {
        if (!e[name] && !touched.current.has(name)) return e;
        // Clear on first edit; once touched, re-check live.
        const message = touched.current.has(name) ? checkField(schema, name, value) : null;
        return { ...e, [name]: message ?? undefined };
      });
    },
    [schema],
  );

  // Pass `value` when the field commits and blurs in one step (the date
  // picker), since `values` won't have the new value until the next render.
  const blur = useCallback(
    <K extends keyof T & string>(name: K, value: T[K] = values[name]) => {
      touched.current.add(name);
      setErrors((e) => ({ ...e, [name]: checkField(schema, name, value) ?? undefined }));
    },
    [schema, values],
  );

  /** Validates the given fields; returns true when they're all valid. */
  const validate = useCallback(
    (names: Array<keyof T & string>) => {
      const next: FieldErrors = {};
      for (const name of names) {
        touched.current.add(name);
        next[name] = checkField(schema, name, values[name]) ?? undefined;
      }
      setErrors((e) => ({ ...e, ...next }));
      const first = names.find((n) => next[n]);
      if (first) focusField(first);
      return !first;
    },
    [schema, values],
  );

  const showServerErrors = useCallback((fieldErrors: FieldErrors) => {
    setErrors((e) => ({ ...e, ...fieldErrors }));
    const first = Object.keys(fieldErrors).find((k) => fieldErrors[k]);
    if (first) focusField(first);
  }, []);

  return { values, setValues, errors, set, blur, validate, showServerErrors };
}

/** Moves focus to a field by name and brings it into view. */
export function focusField(name: string) {
  requestAnimationFrame(() => {
    const el =
      document.querySelector<HTMLElement>(
        `[data-field="${name}"] input, [data-field="${name}"] select, [data-field="${name}"] textarea, [data-field="${name}"] button[aria-checked="true"], [data-field="${name}"] [tabindex="0"]`,
      ) ?? document.querySelector<HTMLElement>(`[data-field="${name}"]`);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    el.focus({ preventScroll: true });
  });
}
