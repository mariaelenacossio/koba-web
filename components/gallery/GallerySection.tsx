import { SectionHeading } from "@/components/layout/SectionHeading";
import { stills } from "@/content/gallery";
import { GalleryGrid } from "./GalleryGrid";

export function GallerySection() {
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="pb-16 lg:pb-24">
      <div className="mx-auto grid max-w-page gap-8 px-4 md:px-8">
        <SectionHeading
          id="gallery-title"
          amharic="ፎቶዎች"
          title="Gallery"
          lead="Stills from our film: forest green walls with gold leaf, carved walnut doors, emerald velvet, a green marble bar and candlelight."
        />
        <GalleryGrid stills={stills} />
      </div>
    </section>
  );
}
