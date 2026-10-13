import "server-only";
import { serverEnv } from "./env";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Checks a Turnstile token with Cloudflare. Returns false on any failure. */
export async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  if (!token) return false;
  const body = new URLSearchParams({ secret: serverEnv.turnstileSecret(), response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body, cache: "no-store" });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
