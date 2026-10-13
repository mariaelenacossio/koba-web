import { expect, test } from "@playwright/test";
import { stills } from "@/content/gallery";

test.describe("Menu search", () => {
  test("finds a dish and shows an empty state with a way back @smoke", async ({ page }) => {
    await page.goto("/#menu");
    const search = page.getByLabel("Search the menu");
    await search.fill("kitfo");
    const menu = page.locator("#menu");
    await expect(menu.getByRole("heading", { name: /^Kitfo/ }).first()).toBeVisible();

    await search.fill("zzzz");
    await expect(menu.getByText('No dishes match "zzzz"')).toBeVisible();
    await menu.getByRole("button", { name: "Clear search" }).click();
    await expect(search).toHaveValue("");
    await expect(search).toBeFocused();
    await expect(menu.getByRole("tabpanel")).toBeVisible();
  });

  test("moves between categories with the arrow keys", async ({ page }) => {
    await page.goto("/#menu");
    const tabs = page.locator("#menu").getByRole("tab");
    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  });
});

test.describe("Gallery", () => {
  test("filters photos", async ({ page }) => {
    await page.goto("/#gallery");
    const gallery = page.locator("#gallery");
    const photos = gallery.getByRole("button", { name: /Open photo:/ });
    await expect(photos).toHaveCount(stills.length);

    await gallery.getByRole("button", { name: "Patio", exact: true }).click();
    await expect(gallery.getByRole("button", { name: "Patio", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(photos).toHaveCount(stills.filter((s) => s.category === "patio").length);

    await gallery.getByRole("button", { name: "All", exact: true }).click();
    await expect(photos).toHaveCount(stills.length);
  });

  test("opens the lightbox and works by keyboard @smoke", async ({ page }) => {
    await page.goto("/#gallery");
    const first = page
      .locator("#gallery")
      .getByRole("button", { name: /Open photo:/ })
      .first();
    await first.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(`1 of ${stills.length}`)).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByText(`2 of ${stills.length}`)).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await expect(dialog.getByText(`1 of ${stills.length}`)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(first).toBeFocused();
  });
});

test.describe("Navigation", () => {
  test("Book menu opens and closes by keyboard", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Book" });
    await button.focus();
    await page.keyboard.press("Enter");

    const items = page.getByRole("menuitem");
    await expect(items.first()).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(items.nth(1)).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toBeHidden();
    await expect(button).toBeFocused();
  });

  test("skip link is the first stop and jumps to the main content", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Keyboard tabbing is checked on desktop.");
    await page.goto("/reserve");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main/);
  });
});

test.describe("Theme", () => {
  test("starts dark, switches to light and remembers it @smoke", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).not.toHaveAttribute("data-theme", "light");

    await page.getByRole("button", { name: "Switch to light theme" }).click();
    await expect(html).toHaveAttribute("data-theme", "light");
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "light");
    await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
  });
});

test.describe("Layout", () => {
  for (const path of ["/", "/reserve", "/gursha", "/gursha/book"]) {
    test(`no sideways scroll on ${path}`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
