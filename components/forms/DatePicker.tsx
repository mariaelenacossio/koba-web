"use client";

import { DayPicker, type ChevronProps } from "@daypicker/react";
import type { ButtonHTMLAttributes } from "react";
import { Tooltip } from "@/components/ui/Tooltip";
import { dateProblem, formatDate, lastBookableDate, todayInRestaurant } from "@/lib/booking-dates";
import { booking } from "@/content/site";
import styles from "./DatePicker.module.css";

/*
  Adapted from the 21st.dev "Calendar [React Day Picker]" by originui
  (component 462, https://21st.dev/r/originui/calendar). Kept: React DayPicker
  (keyboard grid, ARIA labels, disabled-day matchers) and the component's
  class-name map. Changed for Koba: every style is a Koba token (44px day
  cells, 2px radius, gold selected day, gold focus ring, no shadows), our own
  line chevrons replace lucide-react, and "today" and the bookable range come
  from the restaurant's time zone, not the visitor's.
*/

type Props = {
  /** YYYY-MM-DD, or "" when nothing is chosen. */
  value: string;
  onChange: (value: string) => void;
  /** id of the element that labels the calendar. */
  labelledBy: string;
  describedBy?: string;
};

/**
 * "Tuesday 13 October 2026", plus "today" or "selected". The visible number
 * stays a whole word in the name ("13", not "13th"), so voice control users
 * can say what they see (WCAG 2.5.3 Label in Name).
 */
function labelDayButton(date: Date, modifiers: { today?: boolean; selected?: boolean }): string {
  const label = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(date)
    .replace(",", "");
  return [label, modifiers.today && "today", modifiers.selected && "selected"]
    .filter(Boolean)
    .join(", ");
}

/** YYYY-MM-DD to a local Date at midnight, so DayPicker shows that calendar day. */
function toLocal(date: string): Date {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  return new Date(y, m - 1, d);
}

function toIso(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** Month buttons with sentence-case names and a visible tooltip. */
function PreviousMonthButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Tooltip label="Show previous month" align="start">
      <button {...props} aria-label="Show previous month" />
    </Tooltip>
  );
}

function NextMonthButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Tooltip label="Show next month" align="end">
      <button {...props} aria-label="Show next month" />
    </Tooltip>
  );
}

function Chevron({ orientation }: ChevronProps) {
  const d = orientation === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7";
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}

export function DatePicker({ value, onChange, labelledBy, describedBy }: Props) {
  const today = todayInRestaurant();
  const last = lastBookableDate();
  const selected = value && !dateProblem(value) ? toLocal(value) : undefined;

  return (
    <div
      className={styles.root}
      role="group"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
    >
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(d) => onChange(d ? toIso(d) : "")}
        defaultMonth={selected ?? toLocal(today)}
        today={toLocal(today)}
        startMonth={toLocal(today)}
        endMonth={toLocal(last)}
        disabled={[
          { before: toLocal(today) },
          { after: toLocal(last) },
          { dayOfWeek: [...booking.closedWeekdays] },
        ]}
        showOutsideDays={false}
        weekStartsOn={0}
        components={{ Chevron, PreviousMonthButton, NextMonthButton }}
        labels={{ labelDayButton, labelNav: () => "Change month" }}
        classNames={{
          root: styles.dayPicker,
          months: styles.months,
          month: styles.month,
          month_caption: styles.caption,
          caption_label: styles.captionLabel,
          nav: styles.nav,
          button_previous: styles.navButton,
          button_next: styles.navButton,
          month_grid: styles.grid,
          weekdays: styles.weekdays,
          weekday: styles.weekday,
          week: styles.week,
          day: styles.day,
          day_button: styles.dayButton,
          selected: styles.selected,
          today: styles.today,
          disabled: styles.disabled,
          outside: styles.outside,
          hidden: styles.hidden,
          chevron: styles.chevron,
        }}
      />
      <p className={styles.chosen} aria-live="polite">
        {selected
          ? formatDate(value)
          : `Open Tuesday to Sunday, up to ${booking.windowDays} days ahead.`}
      </p>
    </div>
  );
}
