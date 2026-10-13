import type { Metadata } from "next";
import { SectionHeading } from "@/components/layout/SectionHeading";

export const metadata: Metadata = {
  title: "The Gursha Table",
  description: "Book a seat at the Gursha Table: one shared mesob, $45 per person.",
};

// Placeholder until step 6 adds the booking form.
export default function Page() {
  return (
    <div className="mx-auto max-w-page px-4 pt-32 pb-24 md:px-8">
      <SectionHeading as="h1" id="page-title" amharic="የጉርሻ ማዕድ" title="The Gursha Table" />
      <p className="mt-6 max-w-prose text-prose text-ink-muted">
        Online booking opens soon. This page is being rebuilt.
      </p>
    </div>
  );
}
