import Link from "next/link";
import { TibebBand } from "@/components/brand/TibebBand";
import { Wordmark } from "@/components/brand/Wordmark";
import { HeroVideo } from "./HeroVideo";

/** The patio: the film's opening shot, under the signature entrance. */
export function Hero() {
  return (
    <>
      <section
        id="top"
        data-nav-overlay
        aria-labelledby="hero-title"
        className="on-film relative isolate grid min-h-[max(34rem,min(92svh,60rem))] items-end overflow-hidden bg-film-canvas text-film-ink"
      >
        <HeroVideo />
        <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />
        <div className="mx-auto grid w-full max-w-page justify-items-start gap-4 px-4 pt-36 pb-16 md:px-8 lg:pb-24">
          <Wordmark tone="film" className="hero-rise mb-3 text-2xl tracking-[0.42em]" />
          <h1 id="hero-title" className="hero-rise max-w-[14ch] text-display [--i:1]">
            Selam. Welcome to Koba.
          </h1>
          <p lang="am" className="hero-rise font-amharic-serif text-xl text-film-gold-soft [--i:1]">
            ሰላም። እንኳን ደህና መጡ
          </p>
          <p className="hero-rise max-w-[34ch] text-lead text-film-ink-muted [--i:2]">
            Ethiopian fine dining in Gastown, Vancouver.
          </p>
          <div className="hero-rise mt-3 flex flex-wrap gap-3 [--i:3]">
            <Link href="/reserve" className="btn btn-primary">
              Reserve a table
            </Link>
            <Link href="/gursha" className="btn btn-secondary">
              Book a Gursha seat
            </Link>
          </div>
        </div>
      </section>
      <TibebBand />
    </>
  );
}
