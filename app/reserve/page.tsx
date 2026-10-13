import type { Metadata } from "next";
import { SectionHeading } from "@/components/layout/SectionHeading";

export const metadata: Metadata = {
  title: "Book a table",
  description: "Reserve a table at Koba in Gastown, Vancouver.",
};

// Placeholder until step 6 adds the booking form.
export default function Page() {
  return (
    <div className="mx-auto max-w-page px-4 pt-32 pb-24 md:px-8">
      <SectionHeading as="h1" id="page-title" amharic="ቦታ ይያዙ" title="Book a table" />
      <p className="mt-6 max-w-prose text-prose text-ink-muted">
        Online booking opens soon. This page is being rebuilt.
      </p>
    </div>
  );
}
