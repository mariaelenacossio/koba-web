import type { Metadata } from "next";
import Link from "next/link";
import { LeafMotif } from "@/components/brand/LeafMotif";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Still } from "@/components/media/Still";
import { booking } from "@/content/site";

export const metadata: Metadata = {
  title: "The Gursha Table",
  description: `One long shared table and one mesob: book a seat at Koba's Gursha Table, $${booking.gursha.pricePerSeat} per person.`,
};

const included = [
  "A shared set meal from the mesob: injera with tibs, stews, lentils, shiro and greens",
  "One drink: house tej, tella, tea or a soft drink, chosen at the table",
  "The buna coffee ceremony to finish",
];

const paying = [
  ["One simple price.", "Everyone at the table pays the same, at the table."],
  [
    "Extras are separate.",
    "Another drink or a coffee goes on your own tab, and you pay it when you leave.",
  ],
  ["No splitting the bill.", "Nobody pays for anyone else unless they book their seats."],
] as const;

export default function GurshaPage() {
  return (
    <div className="velvet relative isolate overflow-hidden bg-surface-2">
      <LeafMotif className="absolute top-[4%] -right-[8%] -z-10 h-[90%]" />
      <div className="mx-auto grid max-w-page gap-12 px-4 pt-28 pb-24 md:px-8 lg:pt-32">
        <div className="grid gap-10 lg:grid-cols-[6fr_5fr] lg:items-center lg:gap-16">
          <div className="grid gap-6">
            <SectionHeading as="h1" id="page-title" amharic="የጉርሻ ማዕድ" title="The Gursha Table" />
            <p lang="am" className="-mt-3 font-amharic-serif text-body text-amharic">
              አብረን እንብላ
            </p>
            <p className="max-w-prose text-prose text-ink-muted">
              Gursha is the Habesha custom of feeding someone a bite as a sign of care. At our long
              shared table you book one seat and share a meal with friends, colleagues or people you
              have not met yet.
            </p>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-y border-line py-4">
              <span className="font-display text-[clamp(3.5rem,2.6rem+3vw,5rem)] leading-none text-gold tabular-nums">
                ${booking.gursha.pricePerSeat}
              </span>
              <span className="text-ink-muted">per person, paid at the table</span>
            </div>
            <ul className="grid gap-2 pl-5 text-ink-muted marker:text-gold">
              {included.map((line) => (
                <li key={line} className="list-disc">
                  {line}
                </li>
              ))}
            </ul>
            <div>
              <Link href="/gursha/book" className="btn btn-primary">
                Book a Gursha seat
              </Link>
            </div>
          </div>
          <Still id="gursha-32" sizes="(min-width: 1024px) 45vw, 100vw" className="rounded-card" />
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <section aria-labelledby="story-title" className="grid content-start gap-4">
            <h2 id="story-title" className="text-h3">
              The story{" "}
              <span lang="am" className="ml-2 font-amharic-serif text-body text-amharic">
                ታሪክ
              </span>
            </h2>
            <p className="max-w-prose text-prose text-ink-muted">
              In Habesha homes, a meal is rarely served on separate plates. It arrives on one large
              platter of injera, set in the middle of the table, and everyone eats from it together.
            </p>
            <p className="max-w-prose text-prose text-ink-muted">
              Gursha is the small gesture at the heart of that meal. You wrap a bite in injera and
              place it in the mouth of someone beside you. It says welcome, thank you, I am glad you
              are here. The bigger the bite, the warmer the feeling.
            </p>
            <p className="max-w-prose text-prose text-ink-muted">
              The Gursha Table brings that feeling to Gastown: one long table, one shared mesob, a
              seat for each guest. Come with friends or come alone. By the time the coffee ceremony
              ends, you will probably know the person next to you.
            </p>
          </section>
          <section aria-labelledby="paying-title" className="grid content-start gap-4">
            <h2 id="paying-title" className="text-h3">
              How paying works
            </h2>
            <ul className="m-0 grid list-none border-t border-line p-0">
              {paying.map(([lead, rest]) => (
                <li key={lead} className="border-b border-line py-3 text-ink-muted">
                  <span className="font-medium text-ink">{lead}</span> {rest}
                </li>
              ))}
            </ul>
            <p className="max-w-prose text-secondary text-ink-muted">
              {booking.gursha.seatsPerSitting} seats per sitting, at{" "}
              {booking.gursha.times.join(" and ")} every open day. Vegetarian and vegan sets are
              available: choose when you book. Booking for friends? Add their seats, up to{" "}
              {booking.gursha.maxSeatsPerBooking}, or ask each friend to book their own.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
