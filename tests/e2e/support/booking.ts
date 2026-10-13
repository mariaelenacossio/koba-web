import { expect, type Page, type TestInfo } from "@playwright/test";
import { addDays, todayInRestaurant, weekdayOf } from "@/lib/booking-dates";

/*
  Each project books on its own dates, so parallel projects never share a
  sitting and seat counts stay predictable. All dates sit near the end of the
  60-day window, away from real bookings.
*/
const PROJECT_OFFSET: Record<string, number> = { desktop: 30, mobile: 38, "webkit-mobile": 46 };

/** An open day (not Monday) for this project, `extra` days after its base date. */
export function bookingDate(testInfo: TestInfo, extra = 0): string {
  let date = addDays(todayInRestaurant(), (PROJECT_OFFSET[testInfo.project.name] ?? 30) + extra);
  while (weekdayOf(date) === 1) date = addDays(date, 1);
  return date;
}

/** The calendar's label for a day, e.g. "Saturday 28 November 2026". */
export function dayLabel(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(`${date}T12:00:00Z`))
    .replace(",", "");
}
/** Moves the calendar forward to the date's month and picks the day. */
export async function pickDate(page: Page, date: string) {
  // Starts with the date, then maybe ", today" or ", selected".
  const day = page.getByRole("button", { name: new RegExp(`^${dayLabel(date)}`) });
  for (let i = 0; i < 3 && !(await day.isVisible()); i++) {
    await page.getByRole("button", { name: "Go to the Next Month" }).click();
  }
  await day.click();
}

/** Turnstile's test key passes straight away, but the token still has to arrive. */
export async function waitForTurnstile(page: Page) {
  await expect(page.locator('input[name="cf-turnstile-response"]')).not.toHaveValue("", {
    timeout: 15_000,
  });
}
