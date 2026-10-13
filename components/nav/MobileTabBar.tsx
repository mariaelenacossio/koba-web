"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tabBarLinks } from "@/content/site";
import { cn } from "@/lib/cn";
import { useActiveSection } from "./useActiveSection";

const sectionIds = tabBarLinks.flatMap((l) => (l.sectionId ? [l.sectionId] : []));

/** Bottom tab bar on narrow and medium screens. Respects the safe areas. */
export function MobileTabBar() {
  const pathname = usePathname();
  const active = useActiveSection(sectionIds);

  return (
    <nav
      aria-label="Quick links"
      className="fixed inset-x-0 bottom-0 z-30 flex gap-1 border-t border-line bg-canvas px-[max(0.5rem,env(safe-area-inset-left))] pt-1 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] lg:hidden"
    >
      {tabBarLinks.map((link) => {
        const primary = link.sectionId === null;
        const current = primary ? pathname === link.href : active === link.sectionId;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current ? (primary ? "page" : "location") : undefined}
            className={cn(
              "flex min-h-13 flex-1 flex-col items-center justify-center gap-0.5 rounded-ctl text-secondary leading-tight font-medium",
              primary
                ? "my-1 flex-[1.3] bg-gold-ink text-on-gold"
                : "text-ink-muted aria-[current]:text-gold-ink",
            )}
          >
            {link.label}
            <span lang="am" className="text-meta">
              {link.amharic}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
