# Koba

Website for Koba, Ethiopian fine dining in Gastown, Vancouver. Koba (ኮባ) means banana leaf in Amharic.

Read these before changing anything:

- `DESIGN.md`: how Koba looks and feels. Wins on anything visual.
- `ARCHITECTURE.md`: stack, structure, build order and quality bar.
- `CLAUDE.md`: the redesign brief: content, page order and features.
- `.ux-profile.md`: voice, accessibility target and banned patterns.

## Requirements

- Node.js 24 (see `.nvmrc`)
- pnpm, through Corepack: `corepack enable pnpm`

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm typecheck` | Generate route types and run TypeScript |
| `pnpm lint` | ESLint with Next.js and jsx-a11y rules |
| `pnpm format` | Format with Prettier |
| `pnpm test` | Tests (Playwright and axe arrive in step 7) |

## Workflow

`main` is production. Work on a short-lived branch (`feat/`, `fix/`, `chore/`, `content/`), open a pull request, check the Vercel preview, and merge once CI passes. Commits follow Conventional Commits.

Copy `.env.example` to `.env.local` for local secrets. Never commit `.env.local`.
