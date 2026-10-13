import type { Metadata } from "next";
import { Suspense } from "react";
import { ReserveForm } from "@/components/forms/ReserveForm";
import { ReserveSkeleton } from "@/components/forms/BookingSkeleton";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { booking } from "@/content/site";

export const metadata: Metadata = {
  title: "Book a table",
  description: "Reserve a table at Koba, Ethiopian fine dining in Gastown, Vancouver.",
};

export default function ReservePage() {
  return (
    <div className="mx-auto grid max-w-page gap-10 px-4 pt-28 pb-24 md:px-8 lg:pt-32">
      <SectionHeading
        as="h1"
        id="page-title"
        amharic="ቦታ ይያዙ"
        title="Book a table"
        lead="Your own table, your own order. Choose anything from the menu and pay your own bill as usual."
      />
      <p className="-mt-6 text-secondary text-ink-muted">{booking.hoursLabel}. Closed Mondays.</p>
      {/* The calendar needs today's date, so the form renders per request, not at build time. */}
      <Suspense fallback={<ReserveSkeleton />}>
        <ReserveForm />
      </Suspense>
    </div>
  );
}
