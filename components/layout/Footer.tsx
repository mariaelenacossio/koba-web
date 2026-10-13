import Link from "next/link";
import { TibebBand } from "@/components/brand/TibebBand";
import { Wordmark } from "@/components/brand/Wordmark";
import { SocialLinks } from "./SocialLinks";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-canvas">
      <TibebBand />
      <div className="mx-auto grid max-w-page gap-6 px-4 py-16 md:grid-cols-[1fr_auto] md:items-end md:px-8">
        <div className="grid gap-1 text-secondary text-ink-muted">
          <Link
            href="/#top"
            aria-label="Koba, back to the top"
            className="mb-2 inline-flex min-h-11 w-max items-center"
          >
            <Wordmark className="text-[1.75rem]" />
          </Link>
          <p className="text-body text-ink">{site.tagline}</p>
          <p>{site.neighbourhood}</p>
          <p lang="am" className="text-amharic">
            {site.nameAmharic}
          </p>
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
}
