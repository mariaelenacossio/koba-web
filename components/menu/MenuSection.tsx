import { SectionHeading } from "@/components/layout/SectionHeading";
import { menu } from "@/content/menu";
import { DishList } from "./DishList";

/** The dining room. */
export function MenuSection() {
  return (
    <section id="menu" aria-labelledby="menu-title" className="py-16 lg:py-24">
      <div className="mx-auto grid max-w-page gap-8 px-4 md:px-8">
        <SectionHeading
          id="menu-title"
          amharic="ምናሌ"
          title="Menu"
          lead="Lunch and dinner, served on injera to share or keep to yourself."
        />
        <DishList categories={menu} listName="Menu" itemNoun={{ one: "dish", many: "dishes" }} />
        <p className="max-w-[70ch] text-secondary text-ink-muted">
          V means vegetarian and VE means vegan. * Contains raw or undercooked ingredients. Eating
          raw or undercooked meat or eggs may increase the risk of foodborne illness.
        </p>
      </div>
    </section>
  );
}
