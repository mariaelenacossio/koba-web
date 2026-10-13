import "server-only";
import { headers } from "next/headers";

/** The visitor's IP as reported by Vercel's proxy, or null locally. */
export async function clientIp(): Promise<string | null> {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}
