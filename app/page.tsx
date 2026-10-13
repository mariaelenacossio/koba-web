import { BarSection } from "@/components/bar/BarSection";
import { GurshaTeaser } from "@/components/gursha/GurshaTeaser";
import { Hero } from "@/components/hero/Hero";
import { Welcome } from "@/components/home/Welcome";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { MenuSection } from "@/components/menu/MenuSection";
import { VisitSection } from "@/components/visit/VisitSection";

// Film order: patio, entrance and coffee ceremony, dining room, Gursha Table,
// bar ending on the tej, film, gallery, visit (DESIGN.md section 5).

// The film player and gallery arrive in step 5; their anchors stay live.
const comingNext = [
  { id: "film", amharic: "ፊልም", title: "A walk through Koba" },
  { id: "gallery", amharic: "ፎቶዎች", title: "Gallery" },
] as const;

export default function Home() {
  return (
    <>
      <Hero />
      <Welcome />
      <MenuSection />
      <GurshaTeaser />
      <BarSection />
      {comingNext.map((s) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="py-16 lg:py-24">
          <div className="mx-auto max-w-page px-4 md:px-8">
            <SectionHeading id={`${s.id}-title`} amharic={s.amharic} title={s.title} />
            <p className="mt-6 max-w-prose text-prose text-ink-muted">
              This section is being rebuilt from the brand film.
            </p>
          </div>
        </section>
      ))}
      <VisitSection />
    </>
  );
}
