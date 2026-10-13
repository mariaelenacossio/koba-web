/*
  The end-to-end tests send more requests than the limit allows, so the limit
  can be switched off with RATE_LIMIT_DISABLED=1. Production ignores the flag,
  so a stray env var can never open the real site to floods.
*/
export function rateLimitDisabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.RATE_LIMIT_DISABLED === "1" && env.VERCEL_ENV !== "production";
}
