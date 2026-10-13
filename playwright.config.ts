import { loadEnvConfig } from "@next/env";
import { defineConfig, devices } from "@playwright/test";

// Same env files as the app (.env.local locally; CI passes real env vars).
loadEnvConfig(process.cwd());

/*
  Every booking a test makes uses this run's tagged email, so cleanup can find
  exactly what the tests created (tests/e2e/support/cleanup.ts). Resend treats
  delivered@resend.dev as a test inbox, so no real person gets these emails.
*/
process.env.E2E_RUN_ID ??= Date.now().toString(36);

const PORT = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  globalSetup: "./tests/e2e/support/global-setup.ts",
  globalTeardown: "./tests/e2e/support/global-teardown.ts",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } },
    },
    // Safari on iPhone, for the flows guests are most likely to use on a phone.
    { name: "webkit-mobile", use: { ...devices["iPhone 13"] }, grep: /@smoke/ },
  ],
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      RATE_LIMIT_DISABLED: "1",
      // Restaurant notifications from test bookings go to Resend's test inbox too.
      BOOKINGS_NOTIFY_EMAIL: "delivered@resend.dev",
    },
  },
});
