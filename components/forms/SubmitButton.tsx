"use client";

import { useEffect, useState } from "react";

/**
 * Never disabled. While a request is in flight it says "Sending request..."
 * with a spinner, but only after 100ms so fast responses never flash.
 */
export function SubmitButton({ pending, children }: { pending: boolean; children: string }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!pending) return;
    const t = window.setTimeout(() => setSlow(true), 100);
    return () => {
      window.clearTimeout(t);
      setSlow(false);
    };
  }, [pending]);

  return (
    <button type="submit" className="btn btn-primary" aria-busy={slow || undefined}>
      {slow && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
        />
      )}
      {slow ? "Sending request..." : children}
    </button>
  );
}
