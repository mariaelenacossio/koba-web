import { getImageProps } from "next/image";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { still } from "@/content/gallery";
import media from "@/content/media.generated.json";
import { FilmPlayer } from "./FilmPlayer";

/** The full one-minute film, after the bar. */
export function FilmSection() {
  // The poster is the dining-room still, served through next/image so it
  // arrives as AVIF or WebP like every other still.
  const posterStill = still("dining-19");
  const { props: poster } = getImageProps({
    src: posterStill.src,
    alt: "",
    // A poster attribute takes one URL, and getImageProps returns its 2x
    // candidate as `src`: 960 wide gives a 1920px poster.
    width: 960,
    height: 540,
  });

  return (
    <section id="film" aria-labelledby="film-title" className="py-16 lg:py-24">
      <div className="mx-auto grid max-w-page gap-8 px-4 md:px-8">
        <SectionHeading
          id="film-title"
          amharic="ፊልም"
          title="A walk through Koba"
          lead="From the patio, past the coffee ceremony and the dining room, to the Gursha Table and a pour of tej at the bar."
        />
        <FilmPlayer
          src={media.film.url}
          poster={poster.src}
          title="A walk through Koba, one minute, with Amharic voice"
        />
      </div>
    </section>
  );
}
