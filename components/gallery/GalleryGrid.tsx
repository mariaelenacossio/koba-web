"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { galleryCategories, type GalleryCategory, type Still } from "@/content/gallery";
import { cn } from "@/lib/cn";
import { Lightbox } from "./Lightbox";

type Filter = "all" | GalleryCategory;

/** Stills cropped to a tall frame in the masonry columns, for rhythm. */
const tall = new Set(["patio-02", "coffee-14", "gursha-37", "tej-52"]);

const filters: ReadonlyArray<{ id: Filter; label: string }> = [
  { id: "all", label: "All" },
  ...galleryCategories,
];

export function GalleryGrid({ stills }: { stills: readonly Still[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);
  const thumbs = useRef(new Map<string, HTMLButtonElement>());
  const lastOpened = useRef<string | null>(null);

  const shown = filter === "all" ? stills : stills.filter((s) => s.category === filter);

  function openAt(i: number) {
    lastOpened.current = shown[i]?.id ?? null;
    setOpen(i);
  }

  function close() {
    setOpen(null);
    // Return focus to the thumbnail that opened the lightbox (dialog pattern).
    const id = lastOpened.current;
    if (id) requestAnimationFrame(() => thumbs.current.get(id)?.focus());
  }

  return (
    <div className="grid gap-6">
      <div role="group" aria-label="Filter photos" className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className="min-h-11 rounded-ctl border border-line-strong px-4 text-secondary font-medium text-ink-muted transition-colors duration-150 hover:border-gold hover:text-ink aria-pressed:border-button aria-pressed:bg-button aria-pressed:text-on-gold"
          >
            {f.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {`${shown.length} ${shown.length === 1 ? "photo" : "photos"} shown`}
      </p>

      <ul className="m-0 list-none columns-1 gap-4 p-0 md:columns-2 lg:columns-3">
        {shown.map((s, i) => (
          <li key={s.id} className="mb-4 break-inside-avoid">
            <button
              ref={(el) => {
                if (el) thumbs.current.set(s.id, el);
                else thumbs.current.delete(s.id);
              }}
              type="button"
              onClick={() => openAt(i)}
              aria-label={`Open photo: ${s.alt}`}
              className="group block w-full cursor-zoom-in overflow-hidden rounded-card border border-line bg-surface text-left"
            >
              <span className="block overflow-hidden">
                <Image
                  src={s.src}
                  alt=""
                  width={s.width}
                  height={s.height}
                  sizes="(min-width: 1280px) 384px, (min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
                  className={cn(
                    "block h-auto w-full object-cover transition-transform duration-300 ease-(--ease-out) group-hover:scale-[1.02]",
                    tall.has(s.id) ? "aspect-[4/5]" : "aspect-[16/10]",
                  )}
                />
              </span>
              <span
                aria-hidden="true"
                className="block border-t border-line px-4 py-3 text-meta font-medium text-gold-ink"
              >
                {filters.find((f) => f.id === s.category)?.label}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox stills={shown} index={open} onIndexChange={setOpen} onClose={close} />
    </div>
  );
}
