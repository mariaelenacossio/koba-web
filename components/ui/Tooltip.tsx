"use client";

import { useEffect, type ReactNode } from "react";
import styles from "./Tooltip.module.css";

type Props = {
  /** Same words as the control's accessible name, verb first. */
  label: string;
  side?: "top" | "bottom";
  align?: "start" | "center" | "end";
  /** Layout classes for the wrapper (it takes the control's place in the layout). */
  className?: string;
  children: ReactNode;
};

/**
 * Visible label for an icon-only control (icon-buttons skill). The control
 * keeps its own aria-label; the tip is the same words for sighted users, so it
 * is hidden from screen readers to avoid reading the name twice.
 */
export function Tooltip({ label, side = "bottom", align = "center", className, children }: Props) {
  return (
    <span
      className={className ? `${styles.wrap} ${className}` : styles.wrap}
      data-side={side}
      data-align={align}
    >
      {children}
      <span className={styles.tip} aria-hidden="true">
        {label}
      </span>
    </span>
  );
}

/** Mounted once in the layout: Escape dismisses any open tip (WCAG 1.4.13). */
export function TooltipDismiss() {
  useEffect(() => {
    const root = document.documentElement;
    const hide = (event: KeyboardEvent) => {
      if (event.key === "Escape") root.setAttribute("data-tips-hidden", "");
    };
    const show = () => root.removeAttribute("data-tips-hidden");
    document.addEventListener("keydown", hide);
    document.addEventListener("pointermove", show, { passive: true });
    document.addEventListener("focusin", show);
    return () => {
      document.removeEventListener("keydown", hide);
      document.removeEventListener("pointermove", show);
      document.removeEventListener("focusin", show);
    };
  }, []);
  return null;
}
