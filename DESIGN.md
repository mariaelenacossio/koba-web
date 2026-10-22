# DESIGN.md: Koba

Ethiopian fine dining in Gastown, Vancouver. Koba (ኮባ) means banana leaf in Amharic.

This is the design system for the Koba website. Read it before building or changing any UI. It overrides the default styling of any installed component.

---

## 1. Visual theme and atmosphere

Night at Koba. Deep forest green walls with gold leaf banana leaves, carved walnut doors, emerald velvet, a green marble bar with gold veining, brass pendants, and candlelight everywhere. The source of truth is the brand film.

- Mood: quiet luxury, warm, intimate, unhurried. A host welcoming you in, not a brand shouting at you.
- Density: spacious. Generous whitespace, few elements per screen.
- Philosophy: the film and the tibeb border are the memorable things. Everything else stays calm and disciplined so they can stand out.
- Culture is in the details, not in decoration: Amharic beside English, the berele flask, the jebena, the mesob, gursha.

---

## 2. Color palette and roles

Dark is the default theme, and every first visit opens in dark whatever the system setting. Light is based on the ivory of the hostess's habesha kemis and is used only after the visitor picks it.

| Token | Dark | Light | Role |
| --- | --- | --- | --- |
| canvas | #0E241B | #F6F0E4 | Page background (about 60% of a screen) |
| surface | #14342A | #EEE5D3 | Sections, cards, lists (about 30%) |
| surface-2 | #1D4535 | #E6DAC3 | Hover, active, velvet sections like the Gursha Table |
| ink | #F3EBDD | #12291F | Body text and headings |
| ink-muted | #B9B09C | #56604F | Descriptions, helper text |
| gold | #C9A24A | #8C6A1E | Accent (about 10%): focus ring, borders, large display numbers, the wordmark |
| gold-ink | #C9A24A | #7A5A14 | Gold used as text or behind text: links, prices, active nav, primary button fill, small gold labels |
| gold-soft | #E3C27A | #A88433 | Amharic titles and hover on gold in dark; decorative only in light |
| gold-hover | #E3C27A | #5F460F | Primary button hover |
| brass | #A9743A | #8A5A26 | Rare secondary accent |
| line | rgba(243,235,221,.12) | rgba(18,41,31,.12) | Dividers and borders |
| line-control | rgba(243,235,221,.48) | rgba(18,41,31,.56) | Edges of inputs, steppers, selectors and search: at least 3:1 against canvas, surface and velvet (WCAG 1.4.11) |
| error | #E08A72 | #A3432B | Form errors only, always with text |

Rules
- Gold is for accents and large text. Never long body copy in gold.
- Every text pairing meets WCAG AA in both themes.
- Small gold text uses gold-ink, never gold. In light, gold on canvas is 4.41:1 and gold-soft is 3.08:1, both under AA; gold-ink is 5.61:1, and ivory on a gold-ink button is 5.61:1.
- Amharic titles: gold-soft in dark, gold-ink in light.
- Inside the dark velvet section (surface-2), small gold text uses gold-soft. Gold there is 4.48:1, just under AA.
- No gradients as decoration. The only gradient allowed is the dark scrim over the hero video.

---

## 3. Typography rules

| Role | Family | Weight | Size | Line height |
| --- | --- | --- | --- | --- |
| Wordmark | Bodoni Moda, uppercase, wide tracking | 500 | as designed | 1 |
| Display (hero) | Bodoni Moda | 400 | clamp(44px, 7vw, 88px) | 1.1 |
| H2 | Bodoni Moda | 400 | clamp(32px, 4.5vw, 52px) | 1.15 |
| H3 | Bodoni Moda | 500 | 24px | 1.25 |
| Amharic title | Noto Serif Ethiopic | 500 | 16 to 18px, gold-soft (gold-ink in light) | 1.4 |
| Body | Jost | 400 | 16px (17px for long prose) | 1.6 |
| Secondary | Jost | 400 | 14px | 1.5 |
| UI labels, buttons | Jost | 500 | 15 to 16px, sentence case | 1.2 |
| Meta | Jost | 400 | 12px | 1.4 |
| Prices | Bodoni Moda | 500 | 18 to 20px, gold-ink | 1.2 |

Rules
- Three weights only: 400, 500, 600. Nothing above 700.
- Nothing below 12px.
- The wordmark KOBA is the only all-caps text on the site.
- Each section heading has its Amharic name above it in gold-soft. This replaces generic uppercase eyebrow labels.
- Prose stays within 65 to 75 characters per line.
- Slight negative tracking (-0.01em to -0.02em) only at 32px and up.
- Mark Amharic text with `lang="am"`.

---

## 4. Component stylings

Buttons
- Primary: solid gold-ink, canvas-colored text, 2px radius, min height 44px, padding 12px 24px. Hover gold-hover at 150ms. Press scale .98.
- Secondary: transparent, 1px gold border, ink text. Hover fills surface-2.
- Labels are sentence case and start with a verb: Reserve a table, Book a Gursha seat, Play film, Get directions. No arrows, no OK or Submit.

Navigation
- Transparent over the hero, then opaque canvas with a 1px line after scrolling. No blur.
- Active link in gold. Dropdown works with keyboard (Enter, arrows, Escape) and restores focus.
- Mobile: bottom tab bar on canvas with a 1px top line, respecting safe areas.

Menu and bar lists
- Sit on a surface panel with hairline row dividers.
- Dish name in Bodoni Moda, price right-aligned in gold, description in ink-muted.
- Dietary marks (V, VE) as plain text, not pills.
- Category tabs: text tabs with a 2px gold underline on the active one.
- Empty search: "No dishes match "[term]"" with a Clear search button.

Forms
- Visible labels above every input. Placeholders only for format examples.
- Inputs: surface background, 1px line-control border, 2px radius, min height 44px. Focus: 2px gold ring with 2px offset.
- Validate on first blur, clear errors as soon as the guest corrects them, never disable submit.
- Errors in plain, kind language that explains how to fix it.
- Stepper buttons at least 44x44.

Cards
- Used only when content is truly a group (booking options, Gursha details). Surface background, 1px line border, 4px radius, inset top highlight in dark mode.
- No identical card grids.

Signature elements
- Tibeb band: the green and gold diamond and cross pattern from the kemis border, as an inline SVG, 8 to 12px tall. Used in three places only: under the hero, top of the Gursha Table section, top of the footer.
- Banana leaf motif: one original gold line drawing at 6 to 8% opacity, behind the Gursha Table section only.
- Wordmark: KOBA in Bodoni Moda, gold, inspired by the engraved sign in the film.

Media
- Images use film stills only. 4px radius. Explicit width and height. Real alt text.
- Film player framed with a 1px gold border and a segmented subtitle control (Amharic, English, Off).
- Lightbox is a native dialog with a canvas overlay, 94% opacity in dark and fully opaque in light (so the ivory page never shows through), and gold controls.

---

## 5. Layout principles

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Components on the 8pt grid.
- Main content max width about 1200px. Nav, footer, and full-bleed media span the viewport.
- Section padding: 96 to 128px on desktop, 64px on mobile.
- Editorial and asymmetric: an image bleeding off one edge with a text column beside it. Alternate sides down the page.
- Page order follows the film: patio (hero), entrance and coffee ceremony, dining (menu), Gursha Table, bar ending on the Tej, film, gallery, visit.
- Left-aligned text. Center only the hero and short closing statements.

---

## 6. Depth and elevation

| Level | Use | Treatment |
| --- | --- | --- |
| L0 | Canvas | No border, no shadow |
| L1 | Sections, lists, cards | Surface color, 1px line border |
| L2 | Dropdowns, dialogs | surface-2, 1px line border, soft shadow (0 16px 40px rgba(0,0,0,.35) in dark, alpha under .08 in light) |

- Dark mode uses a top edge highlight: inset 0 1px 0 rgba(255,255,255,.06).
- Candlelight warmth comes from the photography and video, not glow effects.

---

## 7. Do's and don'ts

Do
- Let the film stills do the visual work.
- Pair every English heading with its Amharic name.
- Keep one primary action visible per screen: usually Reserve a table.
- Use real content: real dishes, real prices, real Amharic.
- Respect reduced motion and keyboard users everywhere.

Don't
- Glassmorphism or backdrop blur.
- Rainbow, multi-hue, or decorative gradients.
- Pills around static text.
- All-caps labels above headings, numbered section markers, middle-dot meta strings, arrows in button text.
- Fade-up animations on every section.
- Stock photos, cartoon illustrations, or images that aren't from Koba.
- Default component library styling (grey shadcn look, default radius, default shadows).
- Em dashes in copy, or filler like "elevate", "curated experience", "passionate".
- Treating Ethiopian culture as decoration. Every cultural element should carry meaning or context.

---

## 8. Responsive behavior

- Breakpoints: narrow (up to 639px), medium (640 to 1023px), wide (1024px and up).
- No horizontal page scroll at 375px or 1280px.
- Narrow: nav links collapse into the bottom tab bar, asymmetric layouts stack image first, section padding drops to 64px, hero text sits low over the scrim.
- Touch targets at least 44x44 on every viewport. Hover effects only inside `@media (hover: hover)`.
- Hero video plays on all viewports unless reduced motion is on or the connection reports save-data, then the poster shows with a Play film button.

Motion
- Durations: 100, 150, 200, 300ms only. Ease-out to enter, ease-in to exit. No bounce.
- Animate transform and opacity only.
- One signature moment: the hero entrance (wordmark, headline, subline, actions; 300ms each, 60ms stagger).
- Images may scale from 1.03 to 1 on scroll with CSS scroll-driven animations.
- Reduced motion: no autoplay, no scroll effects, opacity only at 150ms or instant.

---

## 9. Agent prompt guide

When building any part of the Koba site:
1. Read this file first, then `ARCHITECTURE.md`.
2. Use tokens from section 2 and the type scale from section 3. No hard-coded values.
3. If you install a 21st.dev component, restyle it completely to match sections 4 and 6 before committing.
4. Check the result against section 7 before calling it done.

Quick prompts
- "Build the menu section following DESIGN.md: surface panel, hairline rows, Bodoni dish names, gold prices, Amharic category titles, text tabs with gold underline."
- "Build the Gursha Table section following DESIGN.md: surface-2 background, tibeb band on top, leaf motif behind, large gursha still bleeding off the left edge, story on the right, $45 in display serif gold."
- "Restyle this 21st.dev date picker to DESIGN.md: canvas and surface colors, gold selected state, 44px day cells, 2px radius, visible focus ring, no shadow."
