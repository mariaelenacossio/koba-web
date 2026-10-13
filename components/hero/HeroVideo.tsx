"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type NetworkInfo = { saveData?: boolean };

/**
 * The patio loop from the brand film. The poster is the LCP image and loads
 * first. The loop only autoplays when the visitor hasn't asked for reduced
 * motion or data saving; otherwise the poster stays with a Play film button.
 * A Play/Pause film control is always there, since a moving image needs a way
 * to stop it (WCAG 2.2.2).
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData =
      (navigator as Navigator & { connection?: NetworkInfo }).connection?.saveData === true;

    const onPlaying = () => {
      setShown(true);
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);
    const onReduceChange = (event: MediaQueryListEvent) => {
      if (event.matches) video.pause();
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    reduce.addEventListener("change", onReduceChange);
    if (!reduce.matches && !saveData) {
      video.play().catch(() => setPlaying(false));
    }
    return () => {
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      reduce.removeEventListener("change", onReduceChange);
    };
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setPlaying(false));
    else video.pause();
  }

  return (
    <>
      <div className="absolute inset-0 -z-20">
        <Image
          src="/media/hero-poster.jpg"
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className={cn(
            "absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 ease-(--ease-out)",
            shown && "opacity-100",
          )}
        >
          <source src="/media/hero.webm" type="video/webm" />
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
      </div>
      <button
        type="button"
        onClick={toggle}
        className="absolute top-[calc(var(--nav-h)+env(safe-area-inset-top)+0.75rem)] right-4 inline-flex min-h-11 items-center gap-2 rounded-ctl border border-film-ink/35 bg-film-canvas/60 px-4 text-secondary font-medium text-film-ink hover:border-film-gold hover:text-film-gold-soft md:top-auto md:right-8 md:bottom-8"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
          {playing ? (
            <path
              d="M8.5 5.5v13M15.5 5.5v13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M8 5.5v13l10-6.5z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          )}
        </svg>
        {playing ? "Pause film" : "Play film"}
      </button>
    </>
  );
}
