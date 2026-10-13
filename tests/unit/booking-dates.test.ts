import { describe, expect, it } from "vitest";
import {
  addDays,
  dateProblem,
  formatDate,
  lastBookableDate,
  todayInRestaurant,
  weekdayOf,
} from "@/lib/booking-dates";

describe("todayInRestaurant", () => {
  it("uses Vancouver time, not UTC", () => {
    // 06:59 UTC on Oct 14 is still 11:59 pm on Oct 13 in Vancouver (UTC-7).
    expect(todayInRestaurant(new Date("2026-10-14T06:59:00Z"))).toBe("2026-10-13");
    expect(todayInRestaurant(new Date("2026-10-14T07:00:00Z"))).toBe("2026-10-14");
  });

  it("follows the switch to standard time", () => {
    // Clocks go back on Nov 1, 2026, so midnight moves from 07:00 to 08:00 UTC.
    expect(todayInRestaurant(new Date("2026-11-02T07:30:00Z"))).toBe("2026-11-01");
    expect(todayInRestaurant(new Date("2026-11-02T08:00:00Z"))).toBe("2026-11-02");
  });
});

describe("date arithmetic", () => {
  it("adds days across months and years", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-11-01", 60)).toBe("2026-12-31");
  });

  it("finds the weekday", () => {
    expect(weekdayOf("2026-10-19")).toBe(1); // Monday
    expect(weekdayOf("2026-10-18")).toBe(0); // Sunday
  });

  it("formats a date for guests", () => {
    expect(formatDate("2026-10-21")).toBe("Wednesday, October 21");
  });
});

describe("dateProblem", () => {
  const now = new Date("2026-10-13T19:00:00Z"); // Tuesday, Oct 13, noon in Vancouver

  it("accepts today and open days inside the window", () => {
    expect(dateProblem("2026-10-13", now)).toBeNull();
    expect(dateProblem("2026-10-17", now)).toBeNull();
  });

  it("rejects bad formats, past days, Mondays and dates past the window", () => {
    expect(dateProblem("", now)).toBe("format");
    expect(dateProblem("2026-10-1", now)).toBe("format");
    expect(dateProblem("2026-10-12", now)).toBe("past");
    expect(dateProblem("2026-10-19", now)).toBe("closed");
    expect(lastBookableDate(now)).toBe("2026-12-12");
    expect(dateProblem("2026-12-12", now)).toBeNull();
    expect(dateProblem("2026-12-13", now)).toBe("too-far");
  });
});
