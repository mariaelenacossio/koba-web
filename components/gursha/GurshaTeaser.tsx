import Link from "next/link";
import { LeafMotif } from "@/components/brand/LeafMotif";
import { TibebBand } from "@/components/brand/TibebBand";
import { Still } from "@/components/media/Still";

const included = [
  "A shared set meal from the mesob: injera with tibs, stews, lentils, shiro and greens",
  "One drink: house tej, tella, tea or a soft drink",
  "The buna coffee ceremony to finish",
];

/**
 * The Gursha Table on the velvet surface: tibeb on top, the leaf behind, the
 * gursha still bleeding off the left edge. The full story and booking live on
 * /gursha.
 */
export function GurshaTeaser() {
  return (
    <section
      id="gursha"
      aria-labelledby="gursha-title"
      className="velvet relative isolate overflow-hidden bg-surface-2 pb-16 lg:pb-24"
    >
      <TibebBand className="mb-16 lg:mb-24" />
      <LeafMotif className="absolute top-[8%] -right-[6%] -z-10 h-[110%]" />
      <div className="split split-left">
        <div className="split-media settle">
          <Still
            id="gursha-30"
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="aspect-[16/10] object-cover lg:aspect-auto lg:h-[min(80vh,44rem)]"
          />
        </div>
        <div className="split-copy">
          <p lang="am" className="font-amharic-serif text-am-title font-medium text-amharic">
            የጉርሻ ማዕድ
          </p>
          <h2 id="gursha-title" className="text-h2">
            The Gursha Table
          </h2>
          <p lang="am" className="font-amharic-serif text-body text-amharic">
            አብረን እንብላ
          </p>
          <p className="max-w-prose text-prose text-ink-muted">
            Gursha is the Habesha custom of feeding someone a bite as a sign of care. At our long
            shared table you book one seat and share a meal with friends, colleagues or people you
            have not met yet.
          </p>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-y border-line py-4">
            <span className="font-display text-[clamp(3.5rem,2.6rem+3vw,5rem)] leading-none text-gold tabular-nums">
              $45
            </span>
            <span className="text-ink-muted">per person, with all of this included</span>
          </div>
          <ul className="grid gap-2 pl-5 text-ink-muted marker:text-gold">
            {included.map((line) => (
              <li key={line} className="list-disc">
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link href="/gursha" className="btn btn-primary">
              Book a Gursha seat
            </Link>
            <Link href="/reserve" className="btn btn-secondary">
              Reserve your own table
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
