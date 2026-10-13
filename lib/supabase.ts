import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { serverEnv } from "./env";

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client with the service key. Every table has Row Level
 * Security on with no public policies, so this is the only way in.
 */
export function supabase(): SupabaseClient {
  client ??= createClient(serverEnv.supabaseUrl(), serverEnv.supabaseServiceKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
