"use client";

import Image from "next/image";
import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from "react";
import type { Still } from "@/content/gallery";
import { Tooltip } from "@/components/ui/Tooltip";
import styles from "./Lightbox.module.css";

type Props = {
  stills: readonly Still[];
  /** Index into `stills` of the photo to show, or null when closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

const icon = (d: string) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d={d} />
  </svg>
);

/**
 * Native modal <dialog>: the browser traps focus and handles Escape.
 * Arrow keys move between photos, a click outside the photo closes it, and
 * focus goes back to the thumbnail that opened it (the caller handles that in
 * onClose).
 */
export function Lightbox({ stills, index, onIndexChange, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const current = open ? stills[index] : undefined;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.classList.remove(styles.closing);
      dialog.showModal();
      closeRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function step(delta: number) {
    if (index === null || stills.length === 0) return;
    onIndexChange((index + delta + stills.length) % stills.length);
  }

  // Close button: fade out over 150ms, then close. Escape and light dismiss
  // close immediately (the native `close` event calls onClose).
  function closeWithFade() {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return dialog.close();
    dialog.classList.add(styles.closing);
    window.setTimeout(() => dialog.close(), 150);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  }

  // Light dismiss: the dialog fills the screen, so a click on its own empty
  // space (not the photo, caption or controls) counts as the backdrop.
  function onClick(event: MouseEvent<HTMLDialogElement>) {
    const target = event.target as HTMLElement;
    if (target === event.currentTarget || target.dataset.backdrop !== undefined) {
      dialogRef.current?.close();
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- the dialog's keyboard support is native (Escape) plus arrow keys for paging; the click handler is light dismiss.
    <dialog
      ref={dialogRef}
      aria-labelledby="lightbox-caption"
      className={styles.dialog}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={onClick}
    >
      <div className={styles.inner} data-backdrop="">
        <div className={styles.top} data-backdrop="">
          <span className={styles.count} aria-live="polite">
            {current && index !== null ? `${index + 1} of ${stills.length}` : ""}
          </span>
          <Tooltip label="Close photo" align="end">
            <button
              ref={closeRef}
              type="button"
              className={styles.control}
              onClick={closeWithFade}
              aria-label="Close photo"
            >
              {icon("M6 6l12 12M18 6L6 18")}
            </button>
          </Tooltip>
        </div>
        <div className={styles.stage} data-backdrop="">
          <Tooltip label="Show previous photo" side="top" align="start" className={styles.prev}>
            <button
              type="button"
              className={styles.control}
              onClick={() => step(-1)}
              aria-label="Show previous photo"
            >
              {icon("M15 5l-7 7 7 7")}
            </button>
          </Tooltip>
          <figure className={styles.figure} data-backdrop="">
            {current && (
              <Image
                key={current.id}
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="90vw"
                // Shown on demand inside the dialog, so load it right away.
                loading="eager"
                className={styles.image}
              />
            )}
            <figcaption id="lightbox-caption" className={styles.caption}>
              {current?.alt}
            </figcaption>
          </figure>
          <Tooltip label="Show next photo" side="top" align="end" className={styles.next}>
            <button
              type="button"
              className={styles.control}
              onClick={() => step(1)}
              aria-label="Show next photo"
            >
              {icon("M9 5l7 7-7 7")}
            </button>
          </Tooltip>
        </div>
      </div>
    </dialog>
  );
}
