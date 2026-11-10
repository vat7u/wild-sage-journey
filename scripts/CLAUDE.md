# scripts

## Overview
One-off Node/TypeScript migration scripts (run with `tsx`) that turn the
Markdown source content in the sibling `../Content` directory plus the images
in `public/images` into the Sanity documents used by the site
(`siteSettings`, chapters, practices, places, days). Both scripts also
regenerate the local fallback dataset `src/lib/content/seedData.json`.

## Interface
- `migrate-seed-to-sanity.ts` — the migration that was actually run
  (2026-11-10) to fill the `production` dataset. Reads
  `src/lib/content/seedData.json` and `public/images`, uploads every image as
  a Sanity asset, rewrites image URLs into asset references (`coverImage`,
  `image`, `heroImage`, story images, `gallery`), drops the legacy
  `*Url`/`chapterSlug`/`practiceSlugs` fields, and `createOrReplace`s all
  documents with their seed IDs and slugs. Dry run by default; `--confirm`
  writes; it aborts if content documents already exist unless `--force` is
  given (which would overwrite Studio edits). Do not re-run it against a
  dataset the owner has edited.
- `import-content-to-sanity.ts` — wired to `npm run import:sanity`
  (`package.json`). Top-level script; nothing is exported. Internal helpers:
  `slugify`, `parseStoryHeading`, `extractLocation`,
  `determineCountryAndChapter`, `mapImagesToStory`, `detectPractices`,
  `buildPortableText`, `run`. Uses the `CITY_COORDINATES` lookup table and the
  `StoryEntry` interface.
  - Outputs: `src/lib/content/seedData.json` and `sanity-export.ndjson` (repo
    root, gitignored), suitable for `npx sanity dataset import`.
  - Pushes to Sanity only when `NEXT_PUBLIC_SANITY_PROJECT_ID` and
    `SANITY_API_TOKEN` are both set (`NEXT_PUBLIC_SANITY_DATASET` defaults to
    `production`).
- `upload-all-to-sanity.ts` — not wired to an npm script. Same parsing helpers
  as above (its `determineCountryAndChapter` takes no `index`), plus
  `uploadImages` and `run`. Uploads every file in `public/images` as a Sanity
  image asset (skipping `originalFilename`s already in the dataset), rebuilds
  the documents with asset references, rewrites `seedData.json`, then
  `createOrReplace`s all documents.

## Invariants
- Must be run with the project root as `process.cwd()`: paths are
  `path.resolve(process.cwd(), "../Content")`, `"public/images"`,
  `"src/lib/content/seedData.json"` and `"sanity-export.ndjson"`.
- `../Content` must contain `About.md`, `Preparation.md`, `The 8 Practices.md`
  and `Storyline.md`; `import-content-to-sanity.ts` throws if the directory is
  missing.
- Document writes are idempotent (`createOrReplace`); `upload-all-to-sanity.ts`
  commits in chunks of 20 documents (`chunkSize`).
- API version is pinned to `2024-03-01` with `useCdn: false`.
- Keep the output shape of `seedData.json`
  (`siteSettings`, `chapters`, `practices`, `days`, `places`) in sync with
  `src/lib/types.ts` and the schema in `src/sanity/schemaTypes`.

## Side Effects
- Overwrites `src/lib/content/seedData.json` on every run (creates the
  directory if needed).
- `import-content-to-sanity.ts` also overwrites `sanity-export.ndjson`.
- Network: writes to the Sanity project/dataset resolved from env
  (`upload-all-to-sanity.ts` defaults to project `tun41dyc`, dataset
  `production` when env vars are absent) — it mutates live content and
  uploads assets.
- Security: `upload-all-to-sanity.ts` used to fall back to a hard-coded API
  token. The literal was removed on 2026-11-10 (the script now throws without
  `SANITY_API_TOKEN`) and the token was revoked, but it remains in git history.
- Known gap: `package.json` defines `export:dataset` pointing at
  `scripts/export-sanity-dataset.ts`, which does not exist in this directory.

## Verification
- Run: `npm run build` (the repo defines no test script; the scripts are not
  covered by the Next.js build, so exercise them with
  `npx tsx scripts/<file>.ts` only against a non-production dataset).
