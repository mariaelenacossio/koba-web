import Link from "next/link";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { site } from "@/content/site";

/** Where to find Koba, with a reserve card. The old #reserve anchor lands on the card. */
export function VisitSection() {
  const facts = [
    { term: "Where", lines: [site.neighbourhood, site.address] },
    { term: "Hours", lines: site.hours },
    { term: "Contact", lines: [site.phone, site.email] },
  ];

  return (
    <section
      id="visit"
      aria-labelledby="visit-title"
      className="border-t border-line bg-surface py-16 lg:py-24"
    >
      <div className="mx-auto grid max-w-page gap-12 px-4 md:px-8 lg:grid-cols-[5fr_6fr] lg:items-start lg:gap-16">
        <div className="grid gap-8">
          <div className="grid gap-3">
            <SectionHeading id="visit-title" amharic="አድራሻ" title="Come see us" />
            <p lang="am" className="font-amharic-serif text-body text-amharic">
              ይምጡ ይጎብኙን
            </p>
          </div>
          <dl className="m-0 grid border-t border-line">
            {facts.map((f) => (
              <div key={f.term} className="grid gap-1 border-b border-line py-4">
                <dt className="text-secondary font-medium text-gold-ink">{f.term}</dt>
                {f.lines.map((line) => (
                  <dd key={line} className="m-0">
                    {line}
                  </dd>
                ))}
              </div>
            ))}
          </dl>
          <div>
            <a
              href={site.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Get directions
              <span className="sr-only"> (opens Google Maps in a new tab)</span>
            </a>
          </div>
          <div className="grid gap-3">
            <p className="text-secondary font-medium">
              Follow us{" "}
              <span lang="am" className="ml-1 font-normal text-amharic">
                ይከተሉን
              </span>
            </p>
            <SocialLinks />
          </div>
        </div>

        <div
          id="reserve"
          className="grid content-start justify-items-start gap-4 rounded-card border border-line bg-canvas p-6 shadow-[var(--inset-shadow-edge)] md:p-8"
        >
          <p lang="am" className="font-amharic-serif text-am-title font-medium text-amharic">
            ቦታ ይያዙ
          </p>
          <h3 className="text-[clamp(1.75rem,1.4rem+1.4vw,2.25rem)] leading-tight">
            Reserve a table
          </h3>
          <p className="max-w-prose text-prose text-ink-muted">
            Your own table, your own order. Choose anything from the menu and pay your own bill as
            usual. No payment is needed to reserve.
          </p>
          {/* Secondary: the nav and tab bar already carry Reserve a table as the primary. */}
          <Link href="/reserve" className="btn btn-secondary">
            Reserve a table
          </Link>
          <Link
            href="/gursha"
            className="inline-flex min-h-11 items-center font-medium text-gold-ink underline-offset-4 hover:underline"
          >
            Or book a seat at the Gursha Table
          </Link>
        </div>
      </div>
    </section>
  );
}
