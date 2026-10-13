import Link from "next/link";
import { Still } from "@/components/media/Still";

/** Entrance and coffee ceremony. Anchors #book and #watch from the old site land here. */
export function Welcome() {
  return (
    <section id="book" aria-labelledby="welcome-title" className="py-16 lg:py-24">
      <div className="split split-left">
        <div className="split-media settle">
          <Still
            id="coffee-10"
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="aspect-[16/10] object-cover lg:aspect-auto lg:h-[min(72vh,40rem)]"
          />
        </div>
        <div className="split-copy">
          <p lang="am" className="font-amharic-serif text-am-title font-medium text-amharic">
            ቡና
          </p>
          <h2 id="welcome-title" className="text-h2">
            Coffee comes first
          </h2>
          <p className="max-w-prose text-prose text-ink-muted">
            Step through the carved doors and the first thing you notice is the coffee. Green beans
            roast over coals, frankincense drifts from the stand, and buna is poured from the jebena
            in three rounds.
          </p>
          <p className="max-w-prose text-prose text-ink-muted">
            Take a cup and a seat. We will look after the rest.
          </p>

          <div id="watch" className="mt-4 grid gap-6 border-t border-line pt-6 md:grid-cols-2">
            <div className="grid content-start justify-items-start gap-2">
              <h3 className="text-h3">Your own table</h3>
              <p lang="am" className="text-meta text-amharic">
                ቦታ ይያዙ
              </p>
              <p className="text-ink-muted">
                Order anything from the menu and pay your own bill as usual.
              </p>
              <Link
                href="/reserve"
                className="inline-flex min-h-11 items-center font-medium text-gold-ink underline-offset-4 hover:underline"
              >
                Reserve a table
              </Link>
            </div>
            <div className="grid content-start justify-items-start gap-2">
              <h3 className="text-h3">The Gursha Table</h3>
              <p lang="am" className="text-meta text-amharic">
                የጉርሻ ማዕድ
              </p>
              <p className="text-ink-muted">
                One long shared table with friends or new faces. One set price, one drink and the
                coffee ceremony included.
              </p>
              <a
                href="#gursha"
                className="inline-flex min-h-11 items-center font-medium text-gold-ink underline-offset-4 hover:underline"
              >
                See how it works
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
