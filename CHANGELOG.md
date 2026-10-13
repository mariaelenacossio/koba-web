# Changelog

All notable changes to the Koba site. Versions follow semantic versioning; production releases are tagged.

## Unreleased

### Added (step 3: media pipeline)
- `pnpm media:hero`, `media:stills`, `media:film` and `media:film:upload` in `scripts/media`, using `ffmpeg-static`. The master film path comes from `KOBA_MASTER_FILM` in `.env.local`.
- Hero loop: `hero.webm` (1.91 MB) and `hero.mp4` (2.47 MB), 8 seconds, muted, plus `hero-poster.jpg`.
- 14 film stills, each the sharpest frame within half a second of its timestamp, with alt text and gallery categories in `content/gallery.ts`. Swapped dining 0:27, gursha 0:40 and tej 0:54 for 0:28, 0:34 and 0:52 for variety.
- Subtitles `koba-am.vtt` and `koba-en.vtt` in `public/subtitles` (cue timing still estimated from the scenes).
- Film upload to Vercel Blob with OIDC auth (`BLOB_STORE_ID` and `VERCEL_OIDC_TOKEN` from `vercel env pull`), via `@vercel/blob`.

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
