import { describe, expect, it } from "vitest";
import { addDays, todayInRestaurant, weekdayOf } from "@/lib/booking-dates";
import { checkField, fieldErrors, gurshaSchema, reservationSchema } from "@/lib/schemas";

/** The next open day at least a week out, so the test never depends on today. */
function openDay(): string {
  let date = addDays(todayInRestaurant(), 7);
  while (weekdayOf(date) === 1) date = addDays(date, 1);
  return date;
}

const reservation = {
  date: openDay(),
  time: "6:30 pm",
  guests: 2,
  name: "Test Guest",
  email: "guest@example.com",
  phone: "",
  notes: "",
  website: "",
};

describe("reservationSchema", () => {
  it("accepts a complete request with no phone", () => {
    expect(reservationSchema.safeParse(reservation).success).toBe(true);
  });

  it("explains each problem without blaming the guest", () => {
    const result = reservationSchema.safeParse({
      ...reservation,
      date: "",
      name: " ",
      email: "guest@",
      guests: 9,
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(fieldErrors(result.error)).toMatchObject({
      date: "Choose a date for your visit.",
      name: "Add your name so we know who to expect.",
      email: "Enter an email like name@example.com.",
      guests: "For more than 8 guests, call us and we'll set up the table.",
    });
  });

  it("treats a filled honeypot as invalid", () => {
    expect(reservationSchema.safeParse({ ...reservation, website: "spam" }).success).toBe(false);
  });
});

describe("single fields", () => {
  it("checks phone numbers only when given", () => {
    expect(checkField(reservationSchema, "phone", "")).toBeNull();
    expect(checkField(reservationSchema, "phone", "604 555 0123")).toBeNull();
    expect(checkField(reservationSchema, "phone", "+1 (604) 555-0123")).toBeNull();
    expect(checkField(reservationSchema, "phone", "12345")).toMatch(/phone number/);
    expect(checkField(reservationSchema, "phone", "call me")).toMatch(/phone number/);
  });

  it("asks for an email before checking its format", () => {
    expect(checkField(reservationSchema, "email", "")).toBe(
      "Enter your email so we can confirm your booking.",
    );
  });

  it("limits notes to 500 characters", () => {
    expect(checkField(reservationSchema, "notes", "a".repeat(500))).toBeNull();
    expect(checkField(reservationSchema, "notes", "a".repeat(501))).toMatch(/500/);
  });
});

describe("gurshaSchema", () => {
  const gursha = { ...reservation, time: "8:30 pm", seats: 2, setType: "vegan" };

  it("accepts a sitting, seats and set type", () => {
    expect(gurshaSchema.safeParse(gursha).success).toBe(true);
  });

  it("rejects unknown sittings, sets and too many seats", () => {
    const result = gurshaSchema.safeParse({
      ...gursha,
      time: "5:00 pm",
      setType: "keto",
      seats: 7,
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(fieldErrors(result.error)).sort()).toEqual(["seats", "setType", "time"]);
  });
});
