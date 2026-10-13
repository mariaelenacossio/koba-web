import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/", "/reserve", "/gursha", "/gursha/book"];

for (const theme of ["dark", "light"] as const) {
  for (const path of pages) {
    test(`${path} has no serious accessibility issues in ${theme} theme`, async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name === "webkit-mobile");
      await page.addInitScript((t) => localStorage.setItem("koba-theme", t), theme);
      await page.goto(path);
      await page.waitForLoadState("load");
      // Let entrance fades finish, or axe measures half-faded colours.
      // Scroll-driven and looping animations never finish, so they're skipped.
      await page.evaluate(() =>
        Promise.all(
          document
            .getAnimations()
            .filter((a) => Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity))
            .map((a) => a.finished.catch(() => undefined)),
        ),
      );

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        // Cloudflare's Turnstile frame is third-party and outside our control.
        .exclude('iframe[src*="challenges.cloudflare.com"]')
        .analyze();

      const serious = results.violations
        .map((v) => ({
          ...v,
          // The KOBA wordmark is a logotype, which WCAG 1.4.3 exempts from contrast.
          nodes:
            v.id === "color-contrast"
              ? v.nodes.filter((n) => !n.html.includes("data-wordmark"))
              : v.nodes,
        }))
        .filter((v) => v.nodes.length > 0 && (v.impact === "critical" || v.impact === "serious"));
      const summary = serious.map((v) => ({
        rule: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.slice(0, 5).map((n) => ({
          target: n.target.join(" "),
          html: n.html.slice(0, 160),
          why: n.failureSummary,
        })),
      }));
      expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
    });
  }
}
