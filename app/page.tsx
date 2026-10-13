import Link from "next/link";
import { LeafMotif } from "@/components/brand/LeafMotif";
import { TibebBand } from "@/components/brand/TibebBand";
import { Wordmark } from "@/components/brand/Wordmark";
import { SectionHeading } from "@/components/layout/SectionHeading";

/*
  Step 2 shell preview. The hero film arrives in step 3 and the real sections
  in step 4; until then each section keeps its anchor, its Amharic title and a
  one-line note so the nav, tab bar and type scale can be reviewed.
*/

const sections = [
  { id: "book", amharic: "ቡና", title: "Coffee comes first" },
  { id: "menu", amharic: "ምናሌ", title: "Menu" },
  { id: "gursha", amharic: "የጉርሻ ማዕድ", title: "The Gursha Table" },
  { id: "bar", amharic: "መጠጥ", title: "Bar" },
  { id: "film", amharic: "ፊልም", title: "A walk through Koba" },
  { id: "gallery", amharic: "ፎቶዎች", title: "Gallery" },
  { id: "visit", amharic: "አድራሻ", title: "Come see us" },
] as const;

export default function Home() {
  return (
    <>
      <section
        id="top"
        data-nav-overlay
        aria-labelledby="hero-title"
        className="on-film grid min-h-[max(34rem,min(88svh,56rem))] items-end bg-film-canvas text-film-ink"
      >
        <div className="mx-auto grid w-full max-w-page justify-items-start gap-4 px-4 pt-32 pb-16 md:px-8">
          <Wordmark tone="film" className="mb-3 text-2xl tracking-[0.42em]" />
          <h1 id="hero-title" className="max-w-[14ch] text-display">
            Selam. Welcome to Koba.
          </h1>
          <p lang="am" className="font-amharic-serif text-xl text-film-gold-soft">
            ሰላም። እንኳን ደህና መጡ
          </p>
          <p className="max-w-[34ch] text-lead text-film-ink-muted">
            Ethiopian fine dining in Gastown, Vancouver.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
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

      {sections.map((s) => {
        const gursha = s.id === "gursha";
        return (
          <section
            key={s.id}
            id={s.id}
            aria-labelledby={`${s.id}-title`}
            className={
              gursha
                ? "relative isolate overflow-hidden bg-surface-2 pb-16 lg:pb-24"
                : "py-16 lg:py-24"
            }
          >
            {gursha && (
              <>
                <TibebBand className="mb-16 lg:mb-24" />
                <LeafMotif className="absolute top-[6%] -left-[4%] -z-10 h-[110%]" />
              </>
            )}
            <div className="mx-auto max-w-page px-4 md:px-8">
              <SectionHeading id={`${s.id}-title`} amharic={s.amharic} title={s.title} />
              <p className="mt-6 max-w-prose text-prose text-ink-muted">
                This section is being rebuilt from the brand film.
              </p>
              {s.id === "visit" && (
                // The old #reserve anchor lands here, next to the visit details.
                <p id="reserve" className="mt-6">
                  <Link href="/reserve" className="btn btn-primary">
                    Reserve a table
                  </Link>
                </p>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
