import "server-only";
import type { ReactElement } from "react";
import { render } from "react-email";
import { Resend } from "resend";
import { serverEnv } from "./env";

// html-to-text uppercases headings by default; KOBA is the only all-caps text.
const plainTextOptions = {
  selectors: ["h1", "h2", "h3"].map((selector) => ({ selector, options: { uppercase: false } })),
};

let client: Resend | null = null;

type Message = { to: string; subject: string; email: ReactElement; replyTo?: string };

/** Sends one email. Returns true when Resend accepted it. Never throws. */
export async function sendEmail({ to, subject, email, replyTo }: Message): Promise<boolean> {
  try {
    client ??= new Resend(serverEnv.resendApiKey());
    const [html, text] = await Promise.all([
      render(email),
      render(email, { plainText: true, htmlToTextOptions: plainTextOptions }),
    ]);
    const { error } = await client.emails.send({
      from: serverEnv.fromEmail(),
      to,
      subject,
      html,
      text,
      replyTo,
    });
    if (error)
      console.error(
        `Email to the ${to === serverEnv.notifyEmail() ? "restaurant" : "guest"} failed: ${error.name}`,
      );
    return !error;
  } catch (e) {
    console.error("Email failed:", e instanceof Error ? e.name : "unknown");
    return false;
  }
}
