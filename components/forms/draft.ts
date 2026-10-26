"use client";

import { useEffect } from "react";

/*
  Booking drafts (defaults skill and DESIGN.md section 7): answers are kept in
  sessionStorage for this tab only, so a refresh, Back or a visit to another
  page doesn't lose them. Cleared once the request is sent. The spam-trap
  field is never saved.
*/

type Draft = Record<string, string | number>;

/** This tab's saved answers merged over the blanks. Browser only. */
export function readDraft<T extends Draft>(key: string, blank: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) return { ...blank, ...(JSON.parse(raw) as Partial<T>), website: "" };
  } catch {
    // Storage blocked or unreadable: start fresh.
  }
  return blank;
}

/** Saves answers while the guest fills the form; stops once it's sent. */
export function useSaveDraft(key: string, values: Draft, sent: boolean) {
  useEffect(() => {
    if (sent) return;
    try {
      sessionStorage.setItem(key, JSON.stringify({ ...values, website: undefined }));
    } catch {
      // Storage blocked: the form still works, a refresh just starts over.
    }
  }, [key, values, sent]);
}

export function clearDraft(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Nothing saved, nothing to clear.
  }
}

/** True when any answer differs from the blank form. */
export function isDirty(values: Draft, blank: Draft): boolean {
  return Object.keys(blank).some((k) => k !== "website" && values[k] !== blank[k]);
}

/**
 * Asks before the tab is closed or reloaded with an unsent form (Form
 * pattern: warn on dirty navigate). Moving between pages in the site keeps
 * the draft, so only leaving the tab needs the browser's prompt.
 */
export function useWarnOnLeave(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [active]);
}
