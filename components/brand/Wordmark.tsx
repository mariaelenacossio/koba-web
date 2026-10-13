import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** "film" keeps the dark-palette gold over the hero film in both themes. */
  tone?: "gold" | "film";
};

/**
 * KOBA in Bodoni Moda, after the engraved gold sign in the film.
 * The only all-caps text on the site. The text node is "Koba" so screen
 * readers say the name, not the letters. As a logotype it is exempt from
 * WCAG contrast (1.4.3), which the axe tests honour through data-wordmark.
 */
export function Wordmark({ className, tone = "gold" }: Props) {
  return (
    <span
      data-wordmark=""
      className={cn(
        "font-display leading-none font-medium tracking-[0.32em] uppercase",
        tone === "film" ? "text-film-gold" : "text-gold",
        className,
      )}
    >
      Koba
    </span>
  );
}
