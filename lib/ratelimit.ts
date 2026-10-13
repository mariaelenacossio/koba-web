import "server-only";
import { createHash } from "node:crypto";
import { supabase } from "./supabase";

/*
  Per-IP rate limit, stored in Supabase so it holds across serverless
  instances. Only a SHA-256 hash of the IP is stored, never the IP itself,
  and old rows are cleared daily by the same job that enforces retention.
*/

const WINDOW_SECONDS = 10 * 60;
const MAX_REQUESTS = 5;

export async function allowRequest(ip: string | null, action: string): Promise<boolean> {
  const key = createHash("sha256")
    .update(`${action}:${ip ?? "unknown"}`)
    .digest("hex");
  const { data, error } = await supabase().rpc("hit_rate_limit", {
    p_key: key,
    p_window_seconds: WINDOW_SECONDS,
    p_max: MAX_REQUESTS,
  });
  // If the limiter itself fails, let the request through rather than lose a booking.
  if (error) return true;
  return data === true;
}
