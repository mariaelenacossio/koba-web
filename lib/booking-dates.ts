import { booking } from "@/content/site";

/*
  Booking dates are plain calendar dates ("2026-10-21") in the restaurant's
  time zone. "Today" always means today in Vancouver, on the server and in
  the browser, so a guest in another time zone sees the same bookable days.
*/

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Today's date in the restaurant's time zone, as YYYY-MM-DD. */
export function todayInRestaurant(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: booking.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Adds whole days to a YYYY-MM-DD date. */
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  const utc = new Date(Date.UTC(y, m - 1, d + days));
  return utc.toISOString().slice(0, 10);
}

/** 0 = Sunday ... 6 = Saturday, for a YYYY-MM-DD date. */
export function weekdayOf(date: string): number {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function lastBookableDate(now: Date = new Date()): string {
  return addDays(todayInRestaurant(now), booking.windowDays);
}

/** Why a date can't be booked, or null if it can. */
export function dateProblem(
  date: string,
  now: Date = new Date(),
): "format" | "past" | "closed" | "too-far" | null {
  if (!ISO_DATE.test(date)) return "format";
  const today = todayInRestaurant(now);
  if (date < today) return "past";
  if (date > lastBookableDate(now)) return "too-far";
  if ((booking.closedWeekdays as readonly number[]).includes(weekdayOf(date))) return "closed";
  return null;
}

/** "Tuesday, October 21" for a YYYY-MM-DD date. */
export function formatDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
