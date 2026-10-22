"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
  return new Promise((resolve, reject) => {
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("turnstile")), { once: true });
    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  });
}

export type TurnstileHandle = { reset: () => void };

/**
 * Cloudflare Turnstile. The site key is public (NEXT_PUBLIC_TURNSTILE_SITE_KEY);
 * the token is checked on the server. Development and Preview use
 * Cloudflare's test keys, so the check always passes there.
 */
export const Turnstile = forwardRef<TurnstileHandle, { onToken: (token: string) => void }>(
  function Turnstile({ onToken }, ref) {
    const box = useRef<HTMLDivElement>(null);
    const widget = useRef<string | null>(null);
    const callback = useRef(onToken);
    callback.current = onToken;

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widget.current && window.turnstile) window.turnstile.reset(widget.current);
        callback.current("");
      },
    }));

    useEffect(() => {
      const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
      if (!siteKey || !box.current) return;
      let cancelled = false;
      loadScript()
        .then(() => {
          if (cancelled || !box.current || !window.turnstile) return;
          const theme =
            document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
          widget.current = window.turnstile.render(box.current, {
            sitekey: siteKey,
            theme,
            size: "flexible",
            callback: (token: string) => callback.current(token),
            "expired-callback": () => callback.current(""),
            "error-callback": () => callback.current(""),
          });
        })
        .catch(() => callback.current(""));
      return () => {
        cancelled = true;
        if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
        widget.current = null;
      };
    }, []);

    // Cloudflare's widget can't be styled from here, so the box shows the
    // site's focus ring while focus is inside it (WCAG 2.4.7).
    return (
      <div
        ref={box}
        className="min-h-[65px] w-full max-w-[400px] rounded-ctl focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gold"
      />
    );
  },
);
