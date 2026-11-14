# Wild Sage Journey Blueprint

## System Overview
A Next.js 15 (App Router, React 19, TypeScript, Tailwind) travel-memoir site.
All content (diary entries, chapters, practices, places, site settings and every
photograph) lives in Sanity (project `tun41dyc`, dataset `production`); there
is no local copy of content in the repo. Server-rendered routes read it through
the getters in `src/lib/sanity/client.ts`, which cache each query under the tag
of its document type. A Sanity webhook calls `/api/revalidate`, which
revalidates that tag, so published Studio edits appear on the live site within
seconds without a rebuild. The Sanity Studio is embedded at `/studio`. See
`README.md` for the human-facing description and
`docs/designs/sanity-content-migration.md` for the design decisions.

## Local Interface & Invariants
- `next.config.ts` — default `NextConfig`: allows remote images from
  `https` host `cdn.sanity.io` and adds a webpack alias `@` -> `src`.
- `package.json` scripts: `dev`, `build`, `start`.
- Environment (`.env.local`, gitignored; the same names in Vercel):
  `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` (read by the
  site and Studio), `SANITY_REVALIDATE_SECRET` (webhook signature, server only),
  optional `NEXT_PUBLIC_SITE_URL` (metadata base; defaults to the Vercel URL),
  and `SANITY_API_TOKEN` (write token, used only by the one-off script in
  `scripts/`, never by the site). `NEXT_PUBLIC_SANITY_API_VERSION` is unused
  (the client hard-codes `2024-03-01`).
- `@sanity/image-url` is installed but unused; images use `asset->url` through
  `next/image`.
- Also at the root: `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json`.

## Subdirectories & System Boundaries
- src: [./src/CLAUDE.md](./src/CLAUDE.md) - application code: routes
  (`app`, including the `api/revalidate` webhook), UI (`components`), data
  layer and types (`lib`), Studio config and schemas (`sanity`).
- scripts: [./scripts/CLAUDE.md](./scripts/CLAUDE.md) - the one-off content
  model patch (and its pending `--cleanup` step).
- docs: design brief/RFC (`docs/designs/`).

## Global Invariants
- Sanity is the single source of content. No page may hard-code content that
  the owner edits (texts, photos, dates, chapter lists, featured entries); page
  headings, taglines, button labels and SEO descriptions stay in code by
  decision.
- Sanity `_type` names and field names must agree across
  `src/sanity/schemaTypes`, the GROQ projections in `src/lib/sanity/client.ts`,
  and `src/lib/types.ts`.
- Every Studio field must either be shown by the site or be hidden in the
  Studio (rich text allows only paragraphs, bold, italic and links).
- A failed or empty fetch of days, chapters or site settings throws; a build
  then fails (previous deployment stays live) and a failed revalidation keeps
  the last good page. There is no fallback content.
- Project id/dataset defaults (`tun41dyc` / `production`) must stay in sync
  between `src/lib/sanity/client.ts` and `src/sanity/sanity.config.ts`.
- Dynamic route pages await `params`, call `notFound()` on missing data, and
  convert slugs with `getSlugString`; `dynamicParams` stays on so new entries
  get pages without a rebuild.
- Studio `basePath` `/studio` must match the `src/app/studio/[[...tool]]`
  route; Navbar and Footer render nothing on `/studio`.

## Global Side Effects
- Network: HTTPS reads from the Sanity content lake (no API CDN) at
  render/build/revalidation time; `next/font/google` fetches fonts; images load
  from `cdn.sanity.io` via the Next image optimizer; the map loads OpenStreetMap
  tiles in the browser.
- Inbound: `POST /api/revalidate` from the Sanity webhook.

## System Verification
- Run: `npm run build` (no test script is defined in `package.json`).
