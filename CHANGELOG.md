# Changelog

All notable changes to the Koba site. Versions follow semantic versioning; production releases are tagged.

## Unreleased

### Added (step 7: tests, accessibility, performance)
- Vitest unit tests: booking dates in Vancouver time (midnight and the November clock change), the 60-day window, every validation message, the rate-limit switch, and Amharic font coverage.
- Playwright end-to-end tests on desktop (1280px), mobile (375px) and iPhone WebKit: both booking flows, validation timing, a Gursha sitting filling up while a guest reviews, menu search and empty state, gallery filters, lightbox and Book menu by keyboard, theme, skip link and no sideways scroll. axe checks every page in both themes.
- Test bookings use Resend's test inbox and are removed before and after each run; `release_gursha_seats()` gives their seats back.
- Lighthouse CI with the section 8 targets, plus Playwright and Lighthouse jobs in GitHub Actions.
- `RATE_LIMIT_DISABLED` for test runs; production ignores it.

### Changed (step 7)
- Fonts are built by `pnpm fonts`: the Amharic fonts hold only the 64 characters the site uses, and every font keeps only the weights the CSS asks for. All four total 78KB, down from 491KB. Glyphs are unchanged: weight 400 is identical, and other weights move by at most 0.09% of the em from re-encoding. Lighthouse's simulated first paint on mobile went from about 3.0s to 1.2s.
- The hero loop starts once the poster has loaded and the browser is idle, so its 1.5MB download no longer competes with the poster. It looks the same and fades in a moment later.
- Booking forms show placeholders shaped like the form while loading, so the footer no longer jumps (layout shift 0.4 to 0).
- Phones get a portrait crop of the hero poster with an honest `srcset`. 3x phones now get a sharp poster, and the poster rather than the video is the LCP.
- Calendar days are named "Tuesday 13 October 2026", and gallery thumbnails start their name with the visible caption, so voice control matches what's on screen (WCAG 2.5.3).
- After a Gursha request is sent, the step leaves the URL.
- The autumn time zone test takes Vancouver's offset from `Intl`: newer time zone data keeps Vancouver on UTC-7 in November 2026, and the app already follows whatever the runtime says.

### Added (step 6: bookings)
- `/reserve` (one form) and `/gursha/book` (three steps, each with its own URL) backed by server actions, Supabase and Resend. `/gursha` now carries the full story, what's included and how paying works.
- Shared Zod rules (`lib/schemas.ts`) for browser and server: checked on first blur, cleared on edit, submit never disabled, focus moves to the first error. Kind, specific error messages.
- Spam protection: hidden honeypot field, a per-IP rate limit (hashed IPs only) and Cloudflare Turnstile. Preview and Development use Cloudflare's always-pass test keys.
- Supabase project `koba-web` (ca-central-1): `reservations`, `gursha_sessions`, `gursha_bookings` and `rate_limits` with Row Level Security and no public access; an atomic `book_gursha()` so two guests can't take the same last seats; a daily job deleting bookings 12 months after the visit.
- React Email templates for the guest's table and Gursha confirmations and the restaurant's notice.
- Live "seats left" per Gursha sitting; full sittings can't be chosen.
- Privacy note under each form.
- All booking rules in `content/site.ts` (demo values for now); emails and site URL in environment variables.

### Changed
- Gursha copy: "Everyone at the table pays the same, at the table." No drink choice at booking.
- Contact details: email required, phone optional.
- `TURNSTILE_SITE_KEY` renamed `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, because the browser needs it.
- Dependencies: `react-email` and `@daypicker/react` replace the deprecated `@react-email/components` and the old `react-day-picker` package name. `esbuild`'s install script (react-email's preview tooling) is explicitly not allowed.

### 21st.dev components
- **DatePicker** (`components/forms/DatePicker.tsx`), from "Calendar [React Day Picker]" by originui, 21st.dev component 462: https://21st.dev/r/originui/calendar. Kept React DayPicker and the component's class-name map. Replaced all styling with Koba tokens (44px day cells, 2px radius, gold selected day, gold focus ring, no shadows), swapped lucide-react for our own chevrons, and set today and the bookable range from the restaurant's time zone.

### Changed (media polish)
- Lightbox overlay is fully opaque in the light theme; dark keeps the 94% canvas. DESIGN.md section 4 updated.
- Both caption files describe the music: `[Music]` at the start and `[Music fades out]` at the end (Amharic: `[ሙዚቃ]`, `[ሙዚቃው ይደበዝዛል]`), placed at the top of the frame. Based on the audio level (a continuous bed fading to silence at 0:59.36); timings and wording are checked again against the voice-over script.

### Added (step 5: gallery, lightbox, film)
- Film section: the full film from the public Blob store, framed in a 1px gold border, with the dining-room still as its poster. The video, poster and metadata load only when the player nears the viewport (native `loading="lazy"` plus an IntersectionObserver fallback). No autoplay.
- Subtitles as `<track>` files: Amharic as captions (it transcribes the film's own voice) and English as subtitles. A segmented control (Amharic, English, Off) switches them and stays in step with the browser's own captions menu.
- Gallery: the 14 film stills in masonry columns with filters (All, Patio, Coffee ceremony, Dining, Gursha, Bar) and a live count of photos shown.
- Lightbox on a native modal `<dialog>`: focus trapped by the browser, Escape and a click outside the photo close it at once, the Close button fades out over 150ms, arrow keys page, focus returns to the thumbnail that opened it, and the page doesn't scroll behind it. Canvas overlay at 94% with gold 44px controls.

### Changed
- ARCHITECTURE.md: no animation library at all, matching the decision to leave Motion out; sections 2, 3 and 5 updated.

### 21st.dev components
- **SegmentedControl** (`components/ui/SegmentedControl.tsx`), from "Segmented Control" by ddoemonn, 21st.dev component 23552: https://21st.dev/r/ddoemonn/segmented-control. Kept its radio-group semantics, roving focus, arrow, Home and End keys, and sliding-thumb technique. Rewrote its Motion spring animation as one 200ms CSS transform transition, and replaced all styling with Koba tokens: 44px targets, 2px radius, no shadows, gold focus ring, 15px labels, and `lang` support for the Amharic option.

### Added (step 4: home sections)
- Home page in film order: hero, welcome and coffee ceremony, menu, Gursha Table teaser, bar ending on the tej, and visit. Film and gallery keep their anchors until step 5.
- Hero: the 8s patio loop over a preloaded poster, autoplaying only without reduced motion or data saving, with a Play/Pause film control. The CSS entrance (wordmark, headline, subline, actions; 300ms, 60ms stagger) is the only load animation.
- Menu and bar from typed content (`content/menu.ts`, `content/bar.ts`) through one `DishList`: text tabs with a sliding gold underline and full arrow-key support, a labelled search across every category, and an empty state with Clear search. On narrow screens the tabs stay on one row that scrolls inside its own box, keeping the active tab in view.
- Editorial split layout with stills bleeding off the left edge (coffee ceremony, gursha); the bar closes on tej-58.
- Visit: address, hours and contact placeholders, directions, socials, and a reserve card on the old `#reserve` anchor.

### Changed
- The mobile tab bar's Reserve fades out while the hero is in view, so the hero's own Reserve a table is the only primary action there. Its slot keeps its width, so the other tabs don't move.
- New `button` color token for primary button fills, so local text-color overrides (the velvet section's gold-soft) never change a button.
- ESLint: restored jsx-a11y's exception for `tabIndex` on `tabpanel` (ARIA tabs pattern), which the strict set drops.
- `next/image` serves AVIF then WebP, at quality 75, from `/media/**` only.

### Added (step 3: media pipeline)
- `pnpm media:hero`, `media:stills`, `media:film` and `media:film:upload` in `scripts/media`, using `ffmpeg-static`. The master film path comes from `KOBA_MASTER_FILM` in `.env.local`.
- Hero loop: `hero.webm` (1.91 MB) and `hero.mp4` (2.47 MB), 8 seconds, muted, plus `hero-poster.jpg`.
- 14 film stills, each the sharpest frame within half a second of its timestamp, with alt text and gallery categories in `content/gallery.ts`. Swapped dining 0:27, gursha 0:40 and tej 0:54 for 0:28, 0:30 and 0:52 for variety.
- Subtitles `koba-am.vtt` and `koba-en.vtt` in `public/subtitles` (cue timing still estimated from the scenes).
- Full film uploaded to the public `koba-media` Blob store with OIDC auth (`BLOB_STORE_ID` and `VERCEL_OIDC_TOKEN` from `vercel env pull`): `film/koba-film-e2c854bdcc.mp4`, 1080p, 19.1 MB, served as `video/mp4` with range requests.

### Changed
- Fonts are bundled in `app/fonts` and loaded with `next/font/local` instead of `next/font/google`, after a CI build failed fetching Noto Sans Ethiopic from Google. Licenses (OFL) sit beside the files.
- ARCHITECTURE.md section 6 rewritten for the scripts as built: one JPG source per still with `next/image` producing AVIF and WebP, a public Blob store for the film, and OIDC instead of `BLOB_READ_WRITE_TOKEN`.

### Added (step 2: design system and shell)
- Design tokens in `styles/globals.css` (`@theme`) and motion tokens in `styles/motion.css`, taken from DESIGN.md sections 2 to 6. Three breakpoints only: narrow, medium (640px) and wide (1024px).
- Fonts through `next/font`: Bodoni Moda (variable, with optical sizing), Jost, Noto Serif Ethiopic and Noto Sans Ethiopic.
- Layout shell: skip link, Nav (transparent over the hero, solid after), Book dropdown with full keyboard support, theme toggle, mobile tab bar with safe areas, and footer.
- Brand components: Wordmark, TibebBand, LeafMotif. SectionHeading pairs each English heading with its Amharic title.
- Placeholder `/reserve` and `/gursha` pages so nav links resolve until step 6.

### Changed
- New `gold-ink` token (#7A5A14 in light, same as gold in dark) for small gold text, the light primary button and light Amharic titles. In light, `gold` (#8C6A1E) measured 4.41:1 on canvas and `gold-soft` (#A88433) 3.08:1, both under WCAG AA. Small gold text inside the dark velvet section uses `gold-soft`, since `gold` there is 4.48:1.
- New `gold-hover` token (#5F460F in light) for primary button hover, because ivory on the light gold-soft fails AA.
- Theme: dark on every first visit, whatever the system setting. The visitor's choice is remembered once they use the toggle. DESIGN.md and ARCHITECTURE.md section 4 updated to match.
- Turbopack runs the Tailwind loader on global stylesheets only, so CSS Modules keep scoped class names.

### Added (step 1: setup)
- Next.js (App Router) project with TypeScript strict mode, Tailwind CSS v4 and pnpm.
- ESLint (Next.js core web vitals, TypeScript, jsx-a11y strict), Prettier with the Tailwind plugin, Husky and lint-staged.
- GitHub Actions CI: typecheck, lint, format check and build on every pull request, plus a check that every commit on `main` arrived through a pull request.
- Project docs: `DESIGN.md`, `ARCHITECTURE.md`, `CLAUDE.md` (the redesign brief) and `.ux-profile.md`.

### 21st.dev components
None installed yet.
