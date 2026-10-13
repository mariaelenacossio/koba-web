"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

type Props = { title: string; children: ReactNode; reference: string };

/** Success: text plus an icon, announced, and focused so keyboard users land on it. */
export function BookingSuccess({ title, children, reference }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      className="grid gap-4 rounded-card border border-gold bg-surface p-6 shadow-[var(--inset-shadow-edge)] focus:outline-none md:p-8"
    >
      <div className="flex items-center gap-3">
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          className="flex-none text-gold-ink"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="12" r="9.25" />
          <path d="M8 12.5l2.7 2.7L16.5 9.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className="text-h3">{title}</h2>
      </div>
      <div className="grid gap-3 text-ink-muted">{children}</div>
      <p className="text-secondary text-ink-muted">
        Reference <span className="font-medium text-ink tabular-nums">{reference}</span>
      </p>
      <Link href="/" className="btn btn-secondary w-max">
        Back to the home page
      </Link>
    </div>
  );
}
