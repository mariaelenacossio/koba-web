import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * The diamond and cross border from the hostess's habesha kemis.
 * Used in three places only: under the hero, at the top of the Gursha Table
 * section, and at the top of the footer (DESIGN.md section 4).
 * Fixed brand colors in both themes.
 */
export function TibebBand({ className }: { className?: string }) {
  const patternId = `tibeb-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  return (
    <svg
      className={cn("block h-3 w-full", className)}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={patternId} width="24" height="12" patternUnits="userSpaceOnUse">
          <rect width="24" height="12" fill="var(--color-tibeb-ground)" />
          <path d="M0 .6H24M0 11.4H24" stroke="var(--color-tibeb-gold)" strokeWidth="1" />
          <path
            d="M12 2.2L17.6 6 12 9.8 6.4 6Z"
            fill="var(--color-tibeb-diamond)"
            stroke="var(--color-tibeb-gold)"
            strokeWidth="1"
          />
          <path d="M12 4.6V7.4M10.6 6H13.4" stroke="var(--color-tibeb-gold-soft)" strokeWidth="1" />
          <path
            d="M0 3.8V8.2M-2.2 6H2.2M24 3.8V8.2M21.8 6H26.2"
            stroke="var(--color-tibeb-brass)"
            strokeWidth="1.2"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
