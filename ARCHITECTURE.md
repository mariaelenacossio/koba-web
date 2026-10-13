# Koba website: architecture and build standards

This file sets the technical foundation for the Koba site. Read it together with `DESIGN.md` (how Koba looks and feels), `CLAUDE.md` (the redesign prompt), and `.ux-profile.md`. If anything here conflicts with those, ask before deciding.

Use the latest stable version of every tool below at setup time, and pin exact versions in `package.json` once installed.

---

## 1. Version control

**Git + GitHub, private repository named `koba-web`.**

Branches
- `main` is production. Protected: no direct pushes, changes only through pull requests.
- Work happens on short-lived branches: `feat/gursha-booking`, `fix/menu-search`, `chore/deps`, `content/fall-menu`.
- Every pull request gets an automatic Vercel preview link. Review the preview before merging.

Commits
- Conventional commits: `feat:`, `fix:`, `style:`, `content:`, `chore:`, `docs:`, `perf:`.
- Small, focused commits. One idea per commit.

What stays out of Git
- Master video files and raw exports (keep in Google Drive under `Koba/Masters`).
- `.env.local` and any secrets.
- Only optimized, web-ready assets live in the repo. Anything over 5MB goes to Vercel Blob (see section 6).

Tags
- Tag each production release: `v1.0.0`, `v1.1.0`. Add a short note in `CHANGELOG.md`.

---

## 2. Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js (App Router) | Static pages for speed, server actions for bookings, built-in image and font handling |
| Language | TypeScript, strict mode | Catches errors in menu data and booking forms early |
| Styling | Tailwind CSS v4 with tokens in `@theme` | Design tokens live in one place; matches the color, type, and spacing system |
| Motion | CSS transitions and scroll-driven animations first; Motion (Framer Motion) only for the hero entrance and dialog/menu presence | Keeps the bundle light and motion on the compositor |
| Fonts | `next/font/local` with the woff2 files bundled in `app/fonts` (OFL): Bodoni Moda, Jost, Noto Serif Ethiopic, Noto Sans Ethiopic | Self-hosted, no layout shift, builds never depend on Google |
| Images | `next/image` with AVIF and WebP | Correct sizes, lazy loading, no layout shift |
| Forms | Server Actions + Zod validation (shared schema client and server) | One source of truth for validation rules |
| Database | Supabase (Postgres) | Stores reservations and Gursha seat bookings |
| Email | Resend + React Email templates | Guest confirmations and restaurant notifications |
| Spam protection | Cloudflare Turnstile + honeypot field + rate limit per IP | Keeps fake bookings out without annoying guests |
| Hosting | Vercel | Preview deploys per pull request, edge caching |
| Video hosting | Vercel Blob (public store) for the full film; hero loop served from `/public` if under 3MB | Keeps the repo small; public blobs stream straight from the CDN |
| Analytics | Vercel Analytics + Speed Insights | Privacy-friendly, no cookie banner needed |
| Package manager | pnpm | Fast, strict installs |
| Runtime | Node.js LTS | Stable |

Not using (on purpose)
- No CMS for v1. Menu and bar content live in typed files. Revisit if the restaurant team needs to edit menus themselves.
- No full component library installed wholesale (MUI, Chakra, a complete shadcn kit). Individual 21st.dev components are allowed as starting points under the rules in section 12.
- No jQuery, no carousel libraries, no heavy animation libraries beyond Motion.

---

## 3. Project structure

```
koba-web/
  app/
    layout.tsx            fonts, theme, skip link, nav, footer
    page.tsx              home: hero > welcome > menu > gursha > bar > film > gallery > visit
    gursha/page.tsx       Gursha Table detail and booking (own URL, multi-step)
    reserve/page.tsx      regular reservation (own URL)
    actions/
      reserve.ts          server action: validate, save, email
      gursha.ts           server action: validate, check seats, save, email
    api/
      health/route.ts
  components/
    hero/                 HeroVideo, HeroEntrance
    menu/                 MenuTabs, MenuList, MenuSearch
    bar/
    gursha/
    gallery/              GalleryGrid, Lightbox (native <dialog>)
    film/                 FilmPlayer, SubtitleToggle
    forms/                Field, Stepper, TimeSlots, SubmitButton
    brand/                Wordmark, TibebBand, LeafMotif
    nav/                  Nav, BookMenu, MobileTabBar, ThemeToggle
    layout/               Footer, SectionHeading, SocialLinks
    icons/                line icons (functional only)
  content/
    menu.ts               typed menu data
    bar.ts                typed drinks data
    gallery.ts            stills, categories, alt text
    stills.generated.json written by pnpm media:stills (frame times, sizes)
    media.generated.json  written by pnpm media:film:upload (film URL)
    site.ts               address, hours, phone, email, socials (placeholders until confirmed)
  emails/
    ReservationConfirmation.tsx
    GurshaConfirmation.tsx
    RestaurantNotification.tsx
  lib/
    schemas.ts            Zod schemas shared by forms and actions
    supabase.ts           server-only client
    resend.ts
    ratelimit.ts
  styles/
    globals.css           Tailwind import, @theme tokens, base styles
    motion.css            duration and easing tokens, reduced-motion overrides
  public/
    media/                hero loop (webm, mp4) and hero poster
      stills/             film stills, 1920x1080 JPG sources
    subtitles/            koba-am.vtt, koba-en.vtt
  scripts/
    media/                hero, stills, film and upload scripts (ffmpeg-static)
    brand/                logo.svg, favicon, og-image.jpg
  supabase/
    migrations/           SQL migrations, committed to Git
  tests/
    e2e/                  Playwright: booking flows, menu search, lightbox, keyboard
    a11y/                 axe checks on every page
  DESIGN.md
  CLAUDE.md
  ARCHITECTURE.md
  .ux-profile.md
  CHANGELOG.md
```

Rules
- Server-only code (Supabase service key, Resend key) never imports into client components. Use `import "server-only"`.
- Content is data, not markup. Changing a price means editing `content/menu.ts`, nothing else.
- One component per file. Co-locate small styles with the component.

---

## 4. Design system in code

All tokens live in `styles/globals.css` under `@theme`. No hard-coded colors, sizes, or durations in components.

Color (dark default, light via `data-theme="light"`)
```
--color-canvas      #0E241B   light #F6F0E4
--color-surface     #14342A   light #EEE5D3
--color-surface-2   #1D4535   light #E6DAC3
--color-ink         #F3EBDD   light #12291F
--color-ink-muted   #B9B09C   light #56604F
--color-gold        #C9A24A   light #8C6A1E
--color-gold-ink    #C9A24A   light #7A5A14   (small gold text, primary button)
--color-gold-soft   #E3C27A   light #A88433
--color-gold-hover  #E3C27A   light #5F460F   (primary button hover)
--color-amharic     #E3C27A   light #7A5A14   (Amharic titles)
--color-brass       #A9743A   light #8A5A26
--color-line        rgba(243,235,221,.12)   light rgba(18,41,31,.12)
--color-error       #E08A72   light #A3432B
```

Type
- Display: Bodoni Moda. Body and UI: Jost. Amharic: Noto Serif Ethiopic (headings), Noto Sans Ethiopic (small text).
- Weights: 400, 500, 600 only.
- Sizes: 12 (meta), 14 (secondary), 16 (body), then a modular scale for headings. Nothing below 12px.

Spacing
- 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.

Radius
- 2px buttons and inputs, 4px images and cards.

Theme
- Dark on every first visit, whatever the system setting. Dark is the brand.
- Once the visitor uses the theme toggle, remember their choice in `localStorage` (`koba-theme`) and use it on every later visit.
- No flash of the wrong theme: set the theme attribute in an inline script in `<head>`.

---

## 5. Motion standards

Tokens (in `styles/motion.css`)
```
--motion-100: 100ms   micro feedback
--motion-150: 150ms   exits, hover
--motion-200: 200ms   dropdowns, dialogs, tabs
--motion-300: 300ms   hero entrance pieces
--ease-out: cubic-bezier(0.16, 1, 0.3, 1)
--ease-in:  cubic-bezier(0.7, 0, 0.84, 0)
```

Rules
- Animate `transform` and `opacity` only.
- One signature moment: the hero entrance (wordmark, headline, subline, actions; 300ms each, 60ms stagger). No fade-up on every section.
- Images: subtle scroll-driven scale from 1.03 to 1, inside `@supports (animation-timeline: view())`.
- Dialogs and dropdowns: enter 200ms, exit 150ms. Escape never waits for an animation.
- No bounce, elastic, or infinite decorative loops.
- `prefers-reduced-motion: reduce`: hero shows the poster with a Play film button, no scroll-driven effects, opacity-only changes at 150ms or instant.

Where Motion (Framer Motion) is allowed
- `HeroEntrance` and `AnimatePresence` for the lightbox and nav dropdown. Everything else is CSS.

---

## 6. Media pipeline

Source
- The master film stays out of Git. Its local path goes in `KOBA_MASTER_FILM` in `.env.local`.
- ffmpeg comes from the `ffmpeg-static` dev dependency, so nobody needs a system install.

Scripts (`scripts/media`)
- `pnpm media:hero` cuts the first 8 seconds into `public/media/hero.webm` (VP9) and `hero.mp4` (H.264), muted, 1600px wide, and writes `hero-poster.jpg` from the first frame. It fails if either video is over 3MB.
- `pnpm media:stills` extracts the 14 gallery stills. For each timestamp it scores every frame within half a second with ffmpeg's `blurdetect` and keeps the sharpest. It writes 1920x1080 high-quality JPGs to `public/media/stills`, records the chosen frames in `content/stills.generated.json`, and writes a labelled contact sheet to `.media-out` for review. Timestamps follow `CLAUDE.md` section 9, with three swaps for variety: dining 0:28, gursha 0:30, tej 0:52.
- `pnpm media:film` compresses the full film to 1080p H.264 with AAC audio in `.media-out/koba-film.mp4` (gitignored).
- `pnpm media:film:upload` uploads that file to Vercel Blob and writes its URL to `content/media.generated.json`.
- `pnpm media` runs hero, stills and film in order.

Images
- The scripts export one high-quality JPG per still. `next/image` serves AVIF and WebP at 1x and 2x from it, so there is one source file per image instead of six.
- Every image has explicit width, height, and real alt text. Alt text lives in `content/gallery.ts`, and the build fails if a still has none.
- Hero poster loads with priority. Everything below the fold is lazy.
- The film poster is the dining-room still (`stills/dining-19.jpg`), so the film and the hero don't open on the same frame.

Blob
- The film lives in a public Blob store. Video players need a URL they can request directly with range requests, and a private store only serves blobs through an authenticated function.
- Auth uses Vercel OIDC, not a static token. `vercel env pull` provides `BLOB_STORE_ID` and a short-lived `VERCEL_OIDC_TOKEN`; `@vercel/blob` refreshes the token in development from your `vercel login` session and `.vercel/project.json`.

Subtitles
- `.vtt` files in `public/subtitles`, loaded with `<track>`.

---

## 7. Bookings

Flow
1. Guest fills the form. Client validation with the shared Zod schema (validate on blur, never disable submit).
2. Server action re-validates, checks Turnstile and rate limit, then writes to Supabase.
3. Resend sends a confirmation to the guest and a notification to the restaurant.
4. Guest sees a success message announced with `aria-live`.

Database tables (`supabase/migrations`)
- `reservations`: id, created_at, date, time_slot, guests, name, contact, notes, status (`requested`, `confirmed`, `cancelled`).
- `gursha_bookings`: id, created_at, date, time_slot, seats, set_type (`standard`, `vegetarian`, `vegan`), name, contact, notes, status.
- `gursha_sessions`: date, time_slot, capacity, seats_taken. Booking fails gracefully when full.

Security
- Row Level Security on for all tables. No public read or write. Only the server action, using the service key, can insert.
- No payment is taken in v1. Gursha price is shown, paid at the restaurant.
- Store only what's needed to confirm a booking.

Still to confirm (placeholders until then)
- Email address that receives bookings
- "From" address and domain for guest emails (domain must be verified in Resend)
- Gursha Table capacity per session
- Opening hours and time slots

---

## 8. Quality bar

Before any pull request merges
- `pnpm typecheck`, `pnpm lint`, `pnpm test` all pass.
- Playwright covers: both booking flows (valid and invalid), menu search and empty state, gallery filters, lightbox keyboard navigation, theme toggle.
- axe finds no critical or serious issues.
- No horizontal overflow at 375px and 1280px.

Production targets
- Lighthouse mobile: Performance 90+, Accessibility 100, Best Practices 100, SEO 100.
- LCP under 2.5s, CLS under 0.1, INP under 200ms.

Tooling
- ESLint (Next.js config + jsx-a11y), Prettier, TypeScript strict.
- Husky + lint-staged to run lint and format on commit.
- GitHub Actions: typecheck, lint, Playwright, and Lighthouse CI on every pull request.

---

## 9. SEO and sharing

- Metadata per page through the Next.js metadata API.
- Open Graph image: a still from the film with the KOBA wordmark.
- `Restaurant` JSON-LD schema with address, hours, menu link, and reservation link (fill in once confirmed).
- `sitemap.xml` and `robots.txt` generated by Next.js.
- `lang="en"` on the page, `lang="am"` on Amharic text.

---

## 10. Environment variables

Stored in Vercel and `.env.local` (never committed). Commit a `.env.example` with names only.

```
NEXT_PUBLIC_SITE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
BOOKINGS_NOTIFY_EMAIL=
BOOKINGS_FROM_EMAIL=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
BLOB_STORE_ID=
VERCEL_OIDC_TOKEN=        (development only, from vercel env pull; refreshed automatically)
```

---

## 11. Build order

1. Repo, Next.js setup, tooling, CI, Vercel project with preview deploys.
2. Read `DESIGN.md` and the skills in section 12. Design tokens, fonts, theme, layout shell, nav, footer.
3. Media pipeline: hero loop, stills, subtitles.
4. Home sections in film order, using content files.
5. Gallery and lightbox, film player.
6. Supabase schema, booking server actions, Resend emails, Turnstile.
7. Tests, accessibility pass, performance pass.
8. Run the `ux-audit` skill, fix findings, then tag `v1.0.0` and deploy.

After each step, open a pull request, check the preview link, and merge before starting the next.

---

## 12. Skills and design sources

Load and follow these during the build.

### DESIGN.md (awesome-design-md format)
- `DESIGN.md` at the project root is Koba's own design system, written in the Google Stitch DESIGN.md format used by the awesome-design-md collection (github.com/VoltAgent/awesome-design-md).
- Read it before building or changing any UI. It wins over any component's default styling.
- Do not copy another company's DESIGN.md from the collection into this project. Those files describe other brands (Stripe, Linear, and so on) and would pull Koba toward their look. The collection is useful only as a reference for how thorough a DESIGN.md should be.
- When the design changes, update `DESIGN.md` in the same pull request.

### 21st.dev (21st-ui skill and MCP)
- Setup: free API key from 21st.dev/mcp, stored as `API_KEY_21ST` in the plugin config. Never commit it.
- Use it for interactive building blocks where a solid base saves time: date picker, time-slot selector, segmented control, tabs, accordion, image lightbox, mobile nav sheet.
- Do not use it for the hero, the Gursha Table section, the tibeb band, or the wordmark. Those are bespoke.
- Workflow: `search`, compare up to three options, `get_component`, install into `components/ui/`, then restyle fully with Koba tokens. No default shadcn grey, no default radius, no default shadows, no glass effects.
- Every installed component must pass the same rules as custom code: keyboard support, visible focus, 44px targets, motion tokens, reduced motion, and the anti-slop list in `DESIGN.md`.
- Free tier allows 2 installs per day. Plan installs in order of need.
- Only use AI generation (`generate`) if `get_usage` shows it is enabled. Otherwise search and adapt.
- Log each installed component and its source link in `CHANGELOG.md`.

### Other skills (if installed)
- frontend-design: plan, review against defaults, build, critique
- modern-web-guidance: search before building video, motion, dialogs, forms, and performance work
- VectorLab UX skills: anti-slop, colour-palette, typography, spacing, motion, reduced-motion, transitions, keyboard, forms, labels, verbs, errors, loaders, empty-states, viewports, surfaces, page-patterns, ux-audit
- animatedwebs-hero and animatedwebs-backgrounds: video hero integration only, using Koba's own film
- design:ux-copy, design:accessibility-review, humanizer
