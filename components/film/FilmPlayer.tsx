"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

type Props = {
  src: string;
  poster: string;
  title: string;
};

type Subtitles = "am" | "en" | "off";

const subtitleOptions = [
  { value: "am", label: "አማርኛ", lang: "am" },
  { value: "en", label: "English" },
  { value: "off", label: "Off" },
] as const;

/**
 * The full film, framed in gold. Below the fold, so the video, its poster and
 * its metadata load lazily: natively where `loading="lazy"` on <video> is
 * supported, with an IntersectionObserver fallback elsewhere. Subtitles are
 * <track> files; the segmented control and the native captions menu stay in
 * sync. No autoplay, and sound only after the visitor presses play.
 */
export function FilmPlayer({ src, poster, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [subtitles, setSubtitles] = useState<Subtitles>("am");
  const [near, setNear] = useState(false);
  const labelId = useId();

  // Load the poster and metadata only when the player is near the viewport.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // A <source> added after the first render doesn't load by itself.
  useEffect(() => {
    if (near) videoRef.current?.load();
  }, [near]);

  // Apply the chosen subtitle language to the text tracks.
  useEffect(() => {
    const tracks = videoRef.current?.textTracks;
    if (!tracks) return;
    for (const track of Array.from(tracks)) {
      track.mode = track.language === subtitles ? "showing" : "disabled";
    }
  }, [subtitles, near]);

  // Keep the control in step if the visitor uses the browser's captions menu.
  useEffect(() => {
    const tracks = videoRef.current?.textTracks;
    if (!tracks) return;
    const onChange = () => {
      const showing = Array.from(tracks).find((t) => t.mode === "showing");
      const next = (showing?.language ?? "off") as Subtitles;
      setSubtitles((prev) => (prev === next ? prev : next));
    };
    tracks.addEventListener("change", onChange);
    return () => tracks.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-card border border-gold bg-film-canvas">
        <video
          ref={videoRef}
          controls
          playsInline
          preload={near ? "metadata" : "none"}
          poster={near ? poster : undefined}
          width={1920}
          height={1080}
          aria-label={title}
          className="block aspect-video h-auto w-full bg-film-canvas"
          // Native lazy loading where supported; the observer above covers the rest.
          {...{ loading: "lazy" }}
        >
          {near && <source src={src} type="video/mp4" />}
          {/* The Amharic track transcribes the film's own voice (captions); English is a translation (subtitles). */}
          <track kind="captions" srcLang="am" label="አማርኛ" src="/subtitles/koba-am.vtt" default />
          <track kind="subtitles" srcLang="en" label="English" src="/subtitles/koba-en.vtt" />
          <p>
            Your browser can&apos;t play this video. <a href={src}>Open the film</a>.
          </p>
        </video>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span id={labelId} className="text-secondary font-medium">
          Subtitles
        </span>
        <SegmentedControl
          labelledBy={labelId}
          options={subtitleOptions}
          value={subtitles}
          onValueChange={(v) => setSubtitles(v as Subtitles)}
        />
      </div>
    </div>
  );
}
