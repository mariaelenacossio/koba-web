import { expect, test } from "@playwright/test";
import { booking } from "@/content/site";
import { formatDate } from "@/lib/booking-dates";
import { bookingDate, pickDate, waitForTurnstile } from "./support/booking";
import { db, testEmail } from "./support/db";

test.describe("Book a table", () => {
  test("sends a complete request @smoke", async ({ page }, testInfo) => {
    const date = bookingDate(testInfo);
    await page.goto("/reserve");

    await pickDate(page, date);
    await expect(page.getByText(formatDate(date), { exact: true })).toBeVisible();
    await expect(page.getByText("Choose a date for your visit.")).toHaveCount(0);
    await page.getByRole("radio", { name: "8:00 pm" }).click();
    await page.getByRole("button", { name: "Add one guest" }).click();
    await page.getByLabel("Name").fill("Playwright Guest");
    await page.getByLabel("Email").fill(testEmail());
    await page.getByLabel("Notes").fill("Automated test booking, removed after the run.");
    await waitForTurnstile(page);
    await page.getByRole("button", { name: "Request a table" }).click();

    const success = page.getByRole("status").filter({ hasText: "Request sent" });
    await expect(success).toContainText("Request sent", { timeout: 15_000 });
    await expect(success).toContainText(`A table for 3 guests on ${formatDate(date)} at 8:00 pm`);
    // Resend accepted the guest's copy.
    await expect(success).toContainText(`A copy of your request is on its way to ${testEmail()}`);
    const reference = (await success.getByText(/Reference/).textContent())?.match(
      /[0-9A-F]{8}/,
    )?.[0];
    expect(reference).toBeTruthy();

    const { data } = await db()
      .from("reservations")
      .select("id, date, time_slot, guests")
      .eq("email", testEmail())
      .eq("date", date);
    expect(data?.some((r) => r.id.slice(0, 8).toUpperCase() === reference)).toBe(true);
  });

  test("shows errors on submit and moves focus to the first one", async ({ page }) => {
    await page.goto("/reserve");
    const submit = page.getByRole("button", { name: "Request a table" });
    await expect(submit).toBeEnabled();
    await submit.click();

    await expect(page.getByText("Choose a date for your visit.")).toBeVisible();
    await expect(page.getByText("Add your name so we know who to expect.")).toBeVisible();
    await expect(page.getByText("Enter your email so we can confirm your booking.")).toBeVisible();
    // Focus lands in the calendar, the first field with an error.
    await expect(page.locator('[data-field="date"]').locator(":focus")).toHaveCount(1);
  });

  test("checks a field on blur and clears the error as the guest types", async ({ page }) => {
    await page.goto("/reserve");
    const email = page.getByLabel("Email");
    await email.fill("guest@");
    await expect(page.getByText("Enter an email like name@example.com.")).toHaveCount(0);
    await email.blur();
    await expect(page.getByText("Enter an email like name@example.com.")).toBeVisible();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await email.fill("guest@example.com");
    await expect(page.getByText("Enter an email like name@example.com.")).toHaveCount(0);
  });
});

test.describe("Book a Gursha seat", () => {
  test("goes through all three steps @smoke", async ({ page }, testInfo) => {
    const date = bookingDate(testInfo, 1);
    await page.goto("/gursha/book");

    await pickDate(page, date);
    await page.getByRole("radio", { name: "8:30 pm" }).click();
    await expect(
      page.getByText(`12 of 12 seats left at 8:30 pm on ${formatDate(date)}.`),
    ).toBeVisible();
    await page.getByRole("button", { name: "Continue to your details" }).click();

    await expect(page).toHaveURL(/step=2/);
    await expect(page.getByRole("heading", { name: "Your details" })).toBeFocused();
    await page.getByRole("radio", { name: "Vegan" }).click();
    await page.getByLabel("Name").fill("Playwright Guest");
    await page.getByLabel("Email").fill(testEmail());
    await page.getByRole("button", { name: "Review your request" }).click();

    await expect(page).toHaveURL(/step=3/);
    await expect(page.getByText("Vegan set")).toBeVisible();
    await expect(
      page.getByText(`$${2 * booking.gursha.pricePerSeat}`, { exact: true }),
    ).toBeVisible();
    await waitForTurnstile(page);
    await page.getByRole("button", { name: "Request seats" }).click();

    const success = page.getByRole("status").filter({ hasText: "Request sent" });
    await expect(success).toContainText("Request sent", { timeout: 15_000 });
    await expect(success).toContainText(
      `2 seats at the Gursha Table on ${formatDate(date)} at 8:30 pm, vegan set`,
    );
    await expect(success).toContainText(`A copy of your request is on its way to ${testEmail()}`);
    // The step leaves the URL once the request is sent.
    await expect(page).not.toHaveURL(/step=/);

    const { data } = await db()
      .from("gursha_sessions")
      .select("seats_taken")
      .eq("date", date)
      .eq("time_slot", "8:30 pm")
      .single();
    expect(data?.seats_taken).toBe(2);
  });

  test("keeps the guest's place when the sitting fills up", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "webkit-mobile");
    const date = bookingDate(testInfo, 2);

    // Someone else has taken 10 of the 12 seats at 6:30 pm.
    const seed = await db().rpc("book_gursha", {
      p_date: date,
      p_time_slot: "6:30 pm",
      p_seats: 10,
      p_set_type: "standard",
      p_name: "Seeded Guests",
      p_email: testEmail(),
      p_phone: "",
      p_notes: "",
      p_capacity: booking.gursha.seatsPerSitting,
    });
    expect(seed.error).toBeNull();

    await page.goto("/gursha/book");
    await pickDate(page, date);
    await expect(
      page.getByText(`2 of 12 seats left at 6:30 pm on ${formatDate(date)}.`),
    ).toBeVisible();
    // The stepper stops at the seats that are left (2, which is also the default).
    await expect(page.getByRole("group", { name: "Seats" }).locator("output")).toHaveText("2");
    await expect(page.getByRole("button", { name: "Add one seat" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await page.getByRole("button", { name: "Continue to your details" }).click();
    await page.getByLabel("Name").fill("Playwright Guest");
    await page.getByLabel("Email").fill(testEmail());
    await page.getByRole("button", { name: "Review your request" }).click();
    await waitForTurnstile(page);

    // One more seat goes while this guest is reviewing.
    const late = await db().rpc("book_gursha", {
      p_date: date,
      p_time_slot: "6:30 pm",
      p_seats: 1,
      p_set_type: "standard",
      p_name: "Seeded Guest",
      p_email: testEmail(),
      p_phone: "",
      p_notes: "",
      p_capacity: booking.gursha.seatsPerSitting,
    });
    expect(late.error).toBeNull();

    await page.getByRole("button", { name: "Request seats" }).click();
    await expect(
      page.getByRole("alert").filter({
        hasText: "Only 1 seat is left at 6:30 pm. Choose fewer seats or the 8:30 pm sitting.",
      }),
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("status").filter({ hasText: "Request sent" })).toHaveCount(0);
  });
});
