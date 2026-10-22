import { describe, expect, it } from "vitest";
import { rateLimitDisabled } from "@/lib/ratelimit-policy";

describe("rateLimitDisabled", () => {
  it("is off unless the flag is set", () => {
    expect(rateLimitDisabled({})).toBe(false);
    expect(rateLimitDisabled({ RATE_LIMIT_DISABLED: "true" })).toBe(false);
  });

  it("can be switched off for tests and previews", () => {
    expect(rateLimitDisabled({ RATE_LIMIT_DISABLED: "1" })).toBe(true);
    expect(rateLimitDisabled({ RATE_LIMIT_DISABLED: "1", VERCEL_ENV: "preview" })).toBe(true);
  });

  it("is ignored in production", () => {
    expect(rateLimitDisabled({ RATE_LIMIT_DISABLED: "1", VERCEL_ENV: "production" })).toBe(false);
  });
});
