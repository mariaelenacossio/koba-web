import { createClient } from "@supabase/supabase-js";

/*
  Direct database access for tests only: seeding a nearly full sitting and
  removing what the tests created. Uses the service key from the environment.
*/
export function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are needed for e2e tests.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** This run's tagged guest email. */
export function testEmail(): string {
  return `delivered+e2e-${process.env.E2E_RUN_ID}@resend.dev`;
}

/** Matches every tagged test email, from this run or an earlier one that crashed. */
export const TEST_EMAIL_PATTERN = "delivered+e2e-%@resend.dev";
