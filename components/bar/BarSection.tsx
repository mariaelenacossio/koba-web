import { SectionHeading } from "@/components/layout/SectionHeading";
import { DishList } from "@/components/menu/DishList";
import { Still } from "@/components/media/Still";
import { bar } from "@/content/bar";

/** The bar, ending on the tej in its berele flask. */
export function BarSection() {
  return (
    <section id="bar" aria-labelledby="bar-title" className="py-16 lg:py-24">
      <div className="mx-auto grid max-w-page gap-8 px-4 md:px-8">
        <SectionHeading
          id="bar-title"
          amharic="መጠጥ"
          title="Bar"
          lead="Tej from the berele, cocktails with Ethiopian spice, and coffee for the road."
        />
        <div className="grid gap-12 lg:grid-cols-[7fr_5fr] lg:items-start lg:gap-16">
          <DishList categories={bar} listName="Bar" itemNoun={{ one: "drink", many: "drinks" }} />
          <figure className="settle m-0 grid gap-3">
            <Still
              id="tej-58"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[4/5] rounded-card object-cover object-[40%_50%]"
            />
            <figcaption className="text-secondary text-ink-muted">
              Tej, our house honey wine, in a berele flask on the bar.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
