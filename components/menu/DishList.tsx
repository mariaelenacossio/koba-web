"use client";

import { useCallback, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import type { ListingCategory, ListingItem } from "@/content/listing";
import { cn } from "@/lib/cn";
import styles from "./DishList.module.css";

type Props = {
  categories: readonly ListingCategory[];
  /** Used in the search label and messages: "menu" / "dishes", "bar" / "drinks". */
  listName: string;
  itemNoun: { one: string; many: string };
};

/**
 * Category tabs, a search across every category, and the list itself on an
 * L1 surface with hairline rows (DESIGN.md section 4).
 *
 * Tabs follow the ARIA tabs pattern: one tab in the tab order, arrow keys,
 * Home and End move and select. On narrow screens the tabs stay on one row
 * that scrolls inside its own container; the active tab is kept in view.
 */
export function DishList({ categories, listName, itemNoun }: Props) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const term = query.trim().toLowerCase();
  const searching = term.length > 0;
  const matches = (item: ListingItem) =>
    [item.name, item.amharic, item.description, item.price]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(term);
  const results = categories.map((c) => (searching ? c.items.filter(matches) : c.items));
  const total = results.reduce((n, items) => n + items.length, 0);

  // Position the gold underline under the active tab (transform only), and
  // scroll the tab row so the active tab is fully visible.
  const placeInk = useCallback(() => {
    const tab = tabRefs.current[active];
    const ink = inkRef.current;
    if (!tab || !ink) return;
    ink.style.transform = `translateX(${tab.offsetLeft}px) scaleX(${tab.offsetWidth})`;
  }, [active]);

  useLayoutEffect(() => {
    placeInk();
    const tab = tabRefs.current[active];
    const scroller = scrollerRef.current;
    if (tab && scroller && scroller.scrollWidth > scroller.clientWidth) {
      const left = tab.offsetLeft - 16;
      const right = tab.offsetLeft + tab.offsetWidth + 16 - scroller.clientWidth;
      if (scroller.scrollLeft > left) scroller.scrollTo({ left });
      else if (scroller.scrollLeft < right) scroller.scrollTo({ left: right });
    }
    window.addEventListener("resize", placeInk);
    document.fonts?.ready.then(placeInk);
    return () => window.removeEventListener("resize", placeInk);
  }, [active, placeInk]);

  function select(index: number, focus: boolean) {
    setActive(index);
    setQuery("");
    if (focus) tabRefs.current[index]?.focus();
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = categories.length - 1;
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % categories.length
        : event.key === "ArrowLeft"
          ? (index - 1 + categories.length) % categories.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  }

  function clearSearch() {
    setQuery("");
    searchRef.current?.focus();
  }

  const searchId = `${uid}-search`;
  const status = searching
    ? total === 0
      ? `No ${itemNoun.many} found`
      : `${total} ${total === 1 ? itemNoun.one : itemNoun.many} found`
    : "";

  return (
    <div className={styles.root}>
      <div className={styles.tools}>
        <div ref={scrollerRef} className={styles.tabScroller}>
          <div
            role="tablist"
            aria-label={`${listName} categories`}
            className={cn(styles.tabs, searching && styles.tabsSearching)}
          >
            {categories.map((c, i) => (
              <button
                key={c.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${uid}-tab-${c.id}`}
                aria-controls={`${uid}-panel-${c.id}`}
                aria-selected={i === active}
                tabIndex={i === active ? 0 : -1}
                className={styles.tab}
                onClick={() => select(i, false)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
              >
                {c.label}
                <span lang="am" className={styles.tabAmharic}>
                  {c.amharic}
                </span>
              </button>
            ))}
            <span ref={inkRef} className={styles.ink} aria-hidden="true" />
          </div>
        </div>

        <div className={styles.search}>
          <label htmlFor={searchId} className={styles.searchLabel}>
            Search the {listName.toLowerCase()}
          </label>
          <div className={styles.searchField}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M16 16l4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              ref={searchRef}
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        {categories.map((c, i) => {
          const items = results[i] ?? [];
          const hidden = searching ? items.length === 0 : i !== active;
          return (
            <div
              key={c.id}
              role="tabpanel"
              id={`${uid}-panel-${c.id}`}
              aria-labelledby={`${uid}-tab-${c.id}`}
              tabIndex={0}
              hidden={hidden}
              className={styles.tabpanel}
            >
              {searching && <h3 className={styles.groupTitle}>{c.label}</h3>}
              <ul className={styles.rows}>
                {items.map((item) => (
                  <li key={item.name} className={styles.row}>
                    <div className={styles.rowHead}>
                      <h3 className={styles.name}>
                        {item.name}
                        {item.raw && (
                          <>
                            <span aria-hidden="true"> *</span>
                            <span className="sr-only">, contains raw ingredients</span>
                          </>
                        )}
                        {item.amharic && (
                          <span lang="am" className={styles.nameAmharic}>
                            {item.amharic}
                          </span>
                        )}
                        {item.diet && <span className={styles.diet}>{item.diet.join(" / ")}</span>}
                      </h3>
                      <span className={styles.price}>{item.price}</span>
                    </div>
                    <p className={styles.description}>{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {searching && total === 0 && (
          <div className={styles.empty}>
            <p>
              No {itemNoun.many} match &quot;{query.trim()}&quot;
            </p>
            <button type="button" className="btn btn-secondary" onClick={clearSearch}>
              Clear search
            </button>
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
