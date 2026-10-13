"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { bookingLinks } from "@/content/site";
import { cn } from "@/lib/cn";
import styles from "./BookMenu.module.css";

/**
 * Menu button pattern: Enter, Space or ArrowDown opens and focuses the first
 * item; ArrowUp opens on the last. Arrows, Home and End move; Escape closes
 * and returns focus to the button; Tab closes and moves on.
 */
export function BookMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const buttonId = useId();

  function openMenu(focusIndex: number) {
    setInstant(false);
    setOpen(true);
    // Focus after the menu is visible.
    requestAnimationFrame(() => itemRefs.current.at(focusIndex)?.focus());
  }

  function closeMenu({ restoreFocus = false, immediate = false } = {}) {
    setInstant(immediate);
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) closeMenu();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function onButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu(0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(-1);
    }
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const items = itemRefs.current.filter((el): el is HTMLAnchorElement => el !== null);
    const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    const move = (to: number) => {
      event.preventDefault();
      items[(to + items.length) % items.length]?.focus();
    };
    switch (event.key) {
      case "ArrowDown":
        return move(index + 1);
      case "ArrowUp":
        return move(index - 1);
      case "Home":
        return move(0);
      case "End":
        return move(items.length - 1);
      case "Escape":
        event.preventDefault();
        return closeMenu({ restoreFocus: true, immediate: true });
      case "Tab":
        return closeMenu({ immediate: true });
      case " ":
        event.preventDefault();
        (document.activeElement as HTMLAnchorElement | null)?.click();
        return;
    }
  }

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        className="inline-flex min-h-11 items-center gap-2 rounded-ctl border border-transparent px-3 text-label font-medium hover:border-current aria-expanded:border-current"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => (open ? closeMenu() : openMenu(0))}
        onKeyDown={onButtonKeyDown}
      >
        Book
        <ChevronDownIcon
          size={16}
          className={cn(
            "transition-transform duration-200 ease-(--ease-out)",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        id={menuId}
        role="menu"
        tabIndex={-1}
        aria-labelledby={buttonId}
        className={styles.menu}
        hidden={!open}
        data-instant={instant ? "" : undefined}
        onKeyDown={onMenuKeyDown}
      >
        {bookingLinks.map((link, i) => (
          <Link
            key={link.href}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            role="menuitem"
            tabIndex={-1}
            href={link.href}
            className={styles.item}
            onClick={() => closeMenu({ immediate: true })}
          >
            <span className={styles.label}>{link.label}</span>
            <span className={styles.detail}>{link.detail}</span>
            {link.amharic && (
              <span className={styles.amharic} lang="am">
                {link.amharic}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
