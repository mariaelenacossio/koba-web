"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { sectionNav } from "@/content/site";
import { cn } from "@/lib/cn";
import { BookMenu } from "./BookMenu";
import { ThemeToggle } from "./ThemeToggle";
import { useActiveSection } from "./useActiveSection";

const sectionIds = sectionNav.map((s) => s.id);

/**
 * Transparent over the hero (any element marked data-nav-overlay), then opaque
 * canvas with a 1px line once the hero scrolls away. No blur.
 */
export function Nav() {
  const pathname = usePathname();
  const [heroInView, setHeroInView] = useState(true);
  const active = useActiveSection(sectionIds);
  // Only the home page has a hero under the nav.
  const overHero = pathname === "/" && heroInView;

  useEffect(() => {
    const hero = document.querySelector("[data-nav-overlay]");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry?.isIntersecting ?? false),
      { rootMargin: "-64px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header
      data-over-hero={overHero || undefined}
      className={cn(
        "group/nav fixed inset-x-0 top-0 z-30 border-b pt-[env(safe-area-inset-top)] transition-colors duration-200 ease-(--ease-out)",
        overHero
          ? "on-film border-transparent bg-transparent text-film-ink"
          : "border-line bg-canvas text-ink",
      )}
    >
      {/* Legibility scrim behind the nav while it sits on the film. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 -bottom-6 -z-10 bg-linear-to-b from-[rgb(8_22_16/0.7)] to-transparent transition-opacity duration-200",
          overHero ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="mx-auto flex min-h-16 max-w-page items-center gap-2 px-4 md:gap-4 md:px-8">
        <Link
          href="/#top"
          aria-label="Koba, back to the top"
          className={cn(
            "mr-auto inline-flex min-h-11 items-center pr-2 transition-opacity duration-200",
            // The hero shows its own wordmark, so the nav copy waits until the hero is gone.
            overHero && "invisible opacity-0",
          )}
        >
          <Wordmark className="text-xl" />
        </Link>

        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {sectionNav.map((item) => (
              <li key={item.id}>
                <a
                  href={`/#${item.id}`}
                  aria-current={active === item.id ? "location" : undefined}
                  className="flex min-h-11 min-w-11 flex-col items-center justify-center text-secondary leading-tight font-medium hover:text-gold-ink group-data-over-hero/nav:hover:text-film-gold aria-[current]:text-gold-ink group-data-over-hero/nav:aria-[current]:text-film-gold"
                >
                  {item.label}
                  <span lang="am" className="text-meta opacity-80">
                    {item.amharic}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <BookMenu />
        {/* One primary action per screen: over the hero, the hero's own button is it. */}
        <Link
          href="/reserve"
          className={cn("btn btn-primary", overHero ? "hidden" : "hidden md:inline-flex")}
        >
          Reserve a table
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
