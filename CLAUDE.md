# Wild Sage Journey Blueprint

## System Overview
A Next.js 15 (App Router, React 19, TypeScript, Tailwind) travel-memoir site
whose content is stored in Sanity (project `tun41dyc`, dataset `production`
by default). Server-rendered routes read content through the getters in
`src/lib/sanity/client.ts`, which fall back to the bundled
`src/lib/content/seedData.json` when Sanity errors or returns nothing. A
Sanity Studio is embedded at `/studio`. Content is produced from Markdown in a
sibling `../Content` directory by the migration scripts. See `README.md` for
the human-facing project description.

## Local Interface & Invariants
- `next.config.ts` — default `NextConfig`: allows remote images from
  `https` host `cdn.sanity.io` and adds a webpack alias `@` -> `src`.
- `package.json` scripts: `dev`, `build`, `start`, `import:sanity`
  (`tsx scripts/import-content-to-sanity.ts`), `export:dataset`
  (`tsx scripts/export-sanity-dataset.ts`, but that file does not exist).
- `.env.local` (gitignored) defines `NEXT_PUBLIC_SANITY_PROJECT_ID`,
  `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` and
  `SANITY_API_TOKEN`. Only the first two and the token are read by code;
  `NEXT_PUBLIC_SANITY_API_VERSION` is unused (the client hard-codes
  `2024-03-01`).
- `package.json` dependencies `@portabletext/react` and `@sanity/image-url`
  are not imported anywhere in `src`, `scripts` or `next.config.ts`.
- Also at the root: `tailwind.config.ts`, `postcss.config.mjs`,
  `tsconfig.json`, and the gitignored generated `sanity-export.ndjson`.

## Subdirectories & System Boundaries
- src: [./src/CLAUDE.md](./src/CLAUDE.md) - application code: routes
  (`app`), UI (`components`), data layer and types (`lib`), Studio config and
  schemas (`sanity`).
- scripts: [./scripts/CLAUDE.md](./scripts/CLAUDE.md) - Markdown-to-Sanity
  migration scripts that also regenerate `seedData.json`.
- `public/images` holds the photographs referenced by the scripts; it has no
  source code and no contract.

## Global Invariants
- Sanity `_type` names and field names must agree across three places:
  `src/sanity/schemaTypes`, the GROQ projections in `src/lib/sanity/client.ts`,
  and `src/lib/types.ts`; the seed data shape written by `scripts` must match
  the same types.
- Project id/dataset defaults (`tun41dyc` / `production`) must stay in sync
  between `src/lib/sanity/client.ts` and `src/sanity/sanity.config.ts`.
- Dynamic route pages await `params`, call `notFound()` on missing data, and
  convert slugs with `getSlugString`.
- Studio `basePath` `/studio` must match the `src/app/studio/[[...tool]]`
  route; Navbar and Footer render nothing on `/studio`.

## Global Side Effects
- Network: HTTPS reads from the Sanity content lake at render/build time;
  `next/font/google` fetches fonts; images load from `cdn.sanity.io`.
- The migration scripts write to the live Sanity dataset, overwrite
  `src/lib/content/seedData.json`, and (import script) `sanity-export.ndjson`.
- Security: `scripts/upload-all-to-sanity.ts` contains a hard-coded Sanity API
  token fallback and is tracked in git; revoke that token and require
  `SANITY_API_TOKEN` from the environment.

## System Verification
- Run: `npm run build` (no test script is defined in `package.json`).
