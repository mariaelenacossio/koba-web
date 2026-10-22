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

  it("flips at local midnight in autumn, whatever the clock rules", () => {
    // British Columbia's clock rules are changing (newer time zone data keeps
    // Vancouver on UTC-7 all year), so take the offset from Intl itself and
    // check the date changes exactly at local midnight on Nov 3, 2026.
    const offsetMinutes = (instant: Date) => {
      const name = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Vancouver",
        timeZoneName: "longOffset",
      }).format(instant);
      const [, sign, h, m] = name.match(/GMT([+-])(\d{2}):(\d{2})/)!;
      return (sign === "-" ? -1 : 1) * (Number(h) * 60 + Number(m));
    };
    const utcMidnight = Date.UTC(2026, 10, 3);
    const localMidnight = utcMidnight - offsetMinutes(new Date(utcMidnight)) * 60_000;
    expect(todayInRestaurant(new Date(localMidnight - 60_000))).toBe("2026-11-02");
    expect(todayInRestaurant(new Date(localMidnight + 60_000))).toBe("2026-11-03");
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
