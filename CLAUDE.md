# Koba website redesign: match the brand film

You are redesigning the Koba restaurant site so it feels like the brand film. This is a visual, tone, and UX upgrade. Every existing feature must keep working.

## 0. Load these skills first (if installed), and follow them
Read each SKILL.md before writing code. If any rule below conflicts with a skill, follow the stricter one and tell me.
- frontend-design (plan, review against defaults, build, critique)
- modern-web-guidance: run searches for "background video hero", "lazy-load video", "motion scroll-driven animations", "native dialog lightbox", "optimize LCP"
- VectorLab UX skills: setup-ui-ux-skills, page-patterns, anti-slop, colour-palette, typography, spacing, motion, reduced-motion, transitions, keyboard, forms, labels, verbs, errors, loaders, empty-states, viewports, surfaces, then ux-audit at the end
- animatedwebs-hero and animatedwebs-backgrounds (video hero integration only; use our own film, no third-party footage)
- design:ux-copy, design:accessibility-review, humanizer

Create `.ux-profile.md` at the project root with:
- Aesthetic reference: quiet luxury hospitality, cinematic, candlelit. Apple-leaning motion (up to 300ms, purposeful).
- Accessibility target: WCAG 2.1 AA, 44x44px tap targets.
- Voice: warm, calm, confident, short. Sentence case. No em dashes. No filler words (thrilled, excited, passionate, elevate, curated experience).
- Banned: glassmorphism, rainbow or multi-hue gradients, cartoon illustrations, decorative pills, ALL-CAPS labels above every heading, middle-dot meta strings, arrows appended to buttons, numbered section markers.
- Icons: simple line icons, gold or ivory, functional only.

## 1. Source files
- index.html: current site (single file, inline CSS, JS, base64 images)
- koba-film-am-voice.mp4: brand film, 60s, 1920x1080, with Amharic voice
- koba-film-poster.jpg

## 2. The look to match
The film shows a Michelin-level Ethiopian restaurant at night: deep forest green walls with gold leaf banana leaf (koba) motifs, carved dark walnut doors with gold inlay, emerald velvet drapes with gold tassels, green marble bar with gold veining, gold honeycomb panels, backlit amber bottles, brass pendants, candlelight. The hostess wears a white habesha kemis with a green and gold tibeb border. The sign over the door is engraved gold serif capitals: KOBA.

The one memorable element is the film itself plus the tibeb border. Everything else stays quiet and disciplined.

## 3. Plan before you build (frontend-design process)
Before any code, write a short design plan in chat:
- Color: 4 to 6 named hex tokens
- Type: families, roles, scale
- Layout: ASCII wireframe of the home page at 1280px and 375px, with alignment rules
- Principles: what makes this specifically Koba
Name the route type from page-patterns (Home / landing marketing composition). Then review the plan against the generic defaults listed in frontend-design and revise anything that reads like a template. Only then build.

## 4. Color tokens
Dark is the default theme. Light theme is based on the ivory of the kemis.

Dark:
--canvas: #0E241B (forest night, 60%)
--surface: #14342A (emerald, cards and sections, 30%)
--surface-2: #1D4535 (velvet, hover and active)
--ink: #F3EBDD (ivory text)
--ink-muted: #B9B09C
--gold: #C9A24A (accent, 10%: primary buttons, links, focus, active nav, prices)
--gold-soft: #E3C27A
--brass: #A9743A (secondary accent, sparingly)
--line: rgba(243,235,221,.12)

Light:
--canvas: #F6F0E4, --surface: #EEE5D3, --surface-2: #E6DAC3, --ink: #12291F, --ink-muted: #56604F, --gold: #8C6A1E, --line: rgba(18,41,31,.12)

Rules from colour-palette: 60-30-10 measured on a screenshot. Elevation with 1px borders first; dark mode uses a subtle top-edge highlight (inset 0 1px 0 rgba(255,255,255,.06)), never glow stacks. Light mode shadows below .08 alpha. Gold is for accents and large text, never long body copy. Verify every text pairing meets AA in both themes.

## 5. Typography
- Display: Bodoni Moda (or a similar high-contrast serif that reads like the engraved gold sign). Used for the wordmark, headings, and prices.
- Body and UI: Jost.
- Amharic: Noto Serif Ethiopic for headings, Noto Sans Ethiopic for small text.
- Max 3 weights total (400, 500, 600). Nothing above 700.
- Body 16px (17px is fine for long prose), secondary 14px, meta 12px. Nothing below 12px; fix every current 11px label.
- Line height 1.1 to 1.25 for headings, 1.5 to 1.6 for body. Slight negative tracking only at 32px and up.
- Prose max 65 to 75ch.
- The wordmark KOBA is the only all-caps text. Above each section heading, show the Amharic title in gold-soft (for example ምናሌ above "Menu"). This replaces generic uppercase eyebrows.
- Load fonts from Google Fonts with font-display: swap and fallback stacks.

## 6. Spacing and layout
- 8pt grid for components and sections, 4pt for micro spacing. Tokens: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Main content max-width around 1200px; html, body, and nav stay full width.
- No page-level horizontal scroll at 375px or 1280px.
- Asymmetric editorial layouts where they help (image bleeding off one edge, text column on the other). Avoid rows of identical cards.

## 7. Signature details
- Tibeb band: a reusable inline SVG pattern of the diamond and cross geometry from the hostess's dress border, in green and gold. Use it in three places only: under the hero, at the top of the Gursha Table section, and at the top of the footer. 8 to 12px tall.
- Banana leaf motif: one original SVG line drawing of an enset leaf in gold at 6 to 8% opacity, behind the Gursha Table section only.
- Hairline dividers only where they carry structure: menu rows, bar rows, form groups.
- Radius: 2px on buttons and inputs, 4px on images and cards. Hierarchy over one radius on everything.

## 8. Page structure: follow the film's walkthrough
1. Hero (the patio). Full-bleed, muted, looping, autoplay, playsinline video built from the first 8 seconds of the film. Poster image loads first with fetchpriority="high". Bottom gradient scrim so text passes AA. Content: KOBA wordmark, headline "Selam. Welcome to Koba." with ሰላም። እንኳን ደህና መጡ, subline "Ethiopian fine dining in Gastown, Vancouver." Actions: "Reserve a table" (primary) and "Book a Gursha seat" (secondary).
2. Welcome (entrance and coffee ceremony): short editorial block with a coffee ceremony still and two or three sentences on buna and hospitality.
3. Menu (the dining room).
4. The Gursha Table: its own section on the velvet surface, large gursha still, story copy, the $45 price in large display serif.
5. Bar: ends with the Tej in the berele flask as the hero image of the section.
6. Film: full 60s film, lazy-loaded, framed with a 1px gold border, existing subtitle controls (Amharic, English, Off) restyled as a proper segmented control.
7. Gallery, Visit, Footer.
Keep all existing anchors and nav links working.

## 9. Replace gallery images with film stills
The current gallery (terracotta patio, orange banquette, masks) does not match the brand. Extract stills from koba-film-am-voice.mp4 with ffmpeg, picking the sharpest frame within half a second of:
- Patio 0:02, 0:06
- Coffee ceremony 0:10, 0:14
- Dining 0:19, 0:24, 0:27
- Gursha 0:32, 0:37, 0:40
- Bar 0:44, 0:49
- Tej 0:54, 0:58
Export AVIF and WebP with a JPG fallback, 1x and 2x widths, explicit width and height to prevent layout shift. Gallery filters become: All, Patio, Coffee ceremony, Dining, Gursha, Bar. Write accurate alt text for each. Reuse these stills in the section images.

## 10. Components
- Buttons: sentence case, verb first (verbs skill). Primary: solid gold, forest text. Secondary: transparent with 1px gold border, ivory text. Hover: 150ms color shift to gold-soft. Press: scale .98. Min 44px tall. No arrows in labels.
- Nav: transparent over the hero, then opaque canvas with a 1px line once scrolled (no backdrop blur). Active link in gold. The existing dropdown must open with Enter or Space, move with arrow keys, close with Escape, and restore focus.
- Menu and bar lists: L1 surface with hairline row dividers. Dish name in display serif, price right-aligned in gold, description in muted body text at 14 to 16px. Category tabs as text tabs with a 2px gold underline on the active tab, proper tablist roles and arrow-key navigation. Drop "V / VE" pills; show them as plain text.
- Search: visible label on desktop. Empty state: "No dishes match "[term]"" with a "Clear search" button.
- Booking forms (regular and Gursha): visible labels bound to inputs, placeholders only for format examples, correct autocomplete attributes, validate on first blur, clear errors as soon as the user corrects, never disable the submit button (on invalid submit, scroll to the first error), error copy that doesn't blame ("Enter a phone number or email so we can confirm"). Stepper buttons at least 44x44. Submit shows an inline spinner with "Sending request..." and aria-busy if it takes over 100ms. Success shows text plus an icon, announced with aria-live.
- Lightbox: rebuild on native <dialog> with focus trap, Escape to close, focus returned to the thumbnail, arrow keys for next and previous, light dismiss on the backdrop. Forest overlay, gold controls, 44px targets.
- Mobile tab bar: keep it, restyle to match, respect safe areas.
- Footer: replace "Koba · Culture Corner & Eat" and other middle-dot strings with plain separate lines.

## 11. Motion
Follow the motion, transitions, and reduced-motion skills.
- Duration tokens only: 100, 150, 200, 300ms. Ease-out on enter, ease-in on exit. No bounce or elastic.
- Animate transform and opacity only.
- One orchestrated moment: on load, the hero wordmark, headline, subline, and actions fade in with a 4 to 8px rise, 300ms each, 60ms stagger. That's the page's signature entrance. Do not add fade-up reveals to every section.
- Images may do a subtle scroll-driven scale from 1.03 to 1 using CSS scroll-driven animations inside @supports, nothing more.
- Interactive motion: tab underline slides with transform, dropdown and dialog enter 200ms and exit 150ms, Escape never waits for an animation.
- prefers-reduced-motion: hero shows the poster with a visible "Play film" button instead of autoplaying, no scroll-driven effects, opacity-only changes at 150ms or instant.

## 12. Accessibility
- Skip link as the first focusable element.
- Global :focus-visible ring: 2px gold with 2px offset, visible in both themes.
- Landmarks, one h1, logical heading order, lang="am" on Amharic text.
- Video: controls on the full film, captions kept, no autoplay with sound.
- Test at 200% zoom, keyboard only, and with VoiceOver.

## 13. Performance
- Move all base64 images out of index.html into optimized files.
- Hero loop: separate 8s clip, WebM and MP4, under 3MB, preload="metadata".
- Lazy-load the full film and its poster near the viewport, and gallery images below the fold.
- Targets: LCP under 2.5s, CLS under 0.1, Lighthouse mobile performance 90+.

## 14. Copy pass
Run the humanizer skill over all visible copy. Keep the meaning and every factual detail, keep placeholders like [street address to confirm] exactly as they are, and keep every Amharic label. No em dashes.

## 15. Must keep working
Menu and bar search, both booking flows with guest stepper and time slots, film subtitles, gallery filters and lightbox, theme toggle, dropdown nav, mobile tab bar, all Amharic labels.

## 16. Verify and report
1. Run the site locally and take screenshots at 375px and 1280px in both themes.
2. Critique the screenshots against the plan from step 3 and fix what's off.
3. Run the ux-audit skill and design:accessibility-review, and fix every critical and major issue.
4. Check no horizontal overflow at 375 and 1280, no console errors.
5. Give me a short list of what changed and anything you couldn't match from the film.
