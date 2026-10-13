import type { Metadata } from "next";
import { Suspense } from "react";
import { GurshaBooking } from "@/components/forms/GurshaBooking";
import { GurshaSkeleton } from "@/components/forms/BookingSkeleton";
import { SectionHeading } from "@/components/layout/SectionHeading";

export const metadata: Metadata = {
  title: "Book a Gursha seat",
  description: "Book seats at Koba's Gursha Table in three short steps.",
};

export default function GurshaBookPage() {
  return (
    <div className="mx-auto grid max-w-page gap-10 px-4 pt-28 pb-24 md:px-8 lg:pt-32">
      <SectionHeading
        as="h1"
        id="page-title"
        amharic="የጉርሻ ማዕድ"
        title="Book a Gursha seat"
        lead="Choose a sitting, tell us who's coming, and we'll hold your seats."
      />
      {/* The steps read the URL (?step=), so they render in the browser. */}
      <Suspense fallback={<GurshaSkeleton />}>
        <GurshaBooking />
      </Suspense>
    </div>
  );
}
