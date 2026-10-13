"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { cn } from "@/lib/cn";

// Tall screens (phones held upright) get a 1:2 crop of the same frame.
const TALL = "(max-aspect-ratio: 3/4)";
const WIDE = `not all and ${TALL}`;
const posterBase = { alt: "", fill: true, sizes: "100vw", loading: "eager" as const };
const { props: wide } = getImageProps({ ...posterBase, src: "/media/hero-poster.jpg" });
// The portrait crop is 540px wide, so its srcset lists only that width. With
// the default list, a 3x phone picks "1200w", gets the 540px file and treats
// it as 175 CSS px wide: softer than it should be and too small to count as
// the LCP. 540 is added to images.imageSizes in next.config.ts.
const { props: tallProps } = getImageProps({
  ...posterBase,
  fill: false,
  width: 540,
  height: 1080,
  sizes: undefined,
  src: "/media/hero-poster-portrait.jpg",
});
const tallUrl = tallProps.srcSet!.split(" ")[0]!;
const tall = { src: tallUrl, srcSet: `${tallUrl} 540w` };

type NetworkInfo = { saveData?: boolean };

/**
 * The patio loop from the brand film. The poster is the LCP image and loads
 * first, preloaded at high priority. On tall screens it's a portrait crop, so
 * it's never upscaled: an upscaled poster counts as smaller than the video's
 * first frame, which would then become the LCP seconds later. The loop only autoplays when the visitor hasn't asked for reduced
 * motion or data saving; otherwise the poster stays with a Play film button.
 * A Play/Pause film control is always there, since a moving image needs a way
 * to stop it (WCAG 2.2.2).
 */
export function HeroVideo() {
  // Only the poster for this screen shape is fetched.
  preload(tall.src, {
    as: "image",
    fetchPriority: "high",
    imageSrcSet: tall.srcSet,
    imageSizes: "100vw",
    media: TALL,
  });
  preload(wide.src, {
    as: "image",
    fetchPriority: "high",
    imageSrcSet: wide.srcSet,
    imageSizes: "100vw",
    media: WIDE,
  });

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
        <picture>
          <source media={TALL} srcSet={tall.srcSet} sizes="100vw" />
          <img {...wide} alt="" fetchPriority="high" className="object-cover" />
        </picture>
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className={cn(
            // 1px inside the poster's box: the poster stays the LCP, since a
            // video frame of exactly the same size can win on rounding alone.
            "absolute inset-x-0 inset-y-px h-[calc(100%-2px)] w-full object-cover opacity-0 transition-opacity duration-300 ease-(--ease-out)",
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
