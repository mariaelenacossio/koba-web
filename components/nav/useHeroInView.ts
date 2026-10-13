"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * True while the home hero (the element marked data-nav-overlay) is under the
 * nav. Used by the nav (transparent state) and the tab bar (one primary action
 * per screen: the hero's own Reserve button).
 */
export function useHeroInView(): boolean {
  const pathname = usePathname();
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const hero = document.querySelector("[data-nav-overlay]");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { rootMargin: "-64px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  // Only the home page has a hero.
  return pathname === "/" && inView;
}
