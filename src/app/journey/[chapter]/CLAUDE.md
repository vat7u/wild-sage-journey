# journey/[chapter]

## Overview
Dynamic route `/journey/<chapter>` listing the diary days of one chapter.

## Interface
- `page.tsx`: default `ChapterPage`; `generateStaticParams` (from `getAllChapters`); `generateMetadata` (from `getChapterBySlug`); `PageProps` with `params: Promise<{ chapter: string }>`.
- Uses `getChapterBySlug`, `getAllChapters`, `getDaysByChapter`, `getSlugString` from `@/lib/sanity/client`.
- Links to `/journey` and `/story/<daySlug>`.

## Invariants
- `params` is a Promise and must be awaited (`page.tsx:ChapterPage`).
- Unknown chapter slug calls `notFound()`.
- Slugs go through `getSlugString` before being put in URLs.

## Side Effects
- Sanity queries at build time (static params) and render time.

## Verification
- Run: `npm run build` (package.json has no test script; only dev/build/start)
