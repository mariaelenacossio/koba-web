import "server-only";

/*
  Server environment, read once and checked. Values never leave the server
  and are never logged. Names match ARCHITECTURE.md section 10.
*/

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}. See .env.example.`);
  return value;
}

export const serverEnv = {
  supabaseUrl: () => required("SUPABASE_URL"),
  supabaseServiceKey: () => required("SUPABASE_SERVICE_ROLE_KEY"),
  resendApiKey: () => required("RESEND_API_KEY"),
  turnstileSecret: () => required("TURNSTILE_SECRET_KEY"),
  notifyEmail: () => required("BOOKINGS_NOTIFY_EMAIL"),
  fromEmail: () => required("BOOKINGS_FROM_EMAIL"),
  siteUrl: () => process.env.NEXT_PUBLIC_SITE_URL ?? "https://koba-web-three.vercel.app",
};
