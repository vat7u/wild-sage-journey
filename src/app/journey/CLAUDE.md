# journey

## Overview
`/journey` index: groups all days under their chapters.

## Interface
- `page.tsx`: default `JourneyPage` (async); exports `metadata`.
- Fetches `getAllDays()` and `getAllChapters()` in parallel; groups days with `d.chapterSlug === getSlugString(chap.slug)`.
- Links to `/journey/<chapter>` and `/story/<day>`.
- Child route: [journey/[chapter]](./[chapter]/CLAUDE.md).

## Invariants
- Day-to-chapter grouping depends on `day.chapterSlug` matching the chapter slug string. The same comparison is duplicated in `getDaysByChapter` (used by the child route) rather than shared.

## Side Effects
- Sanity reads via `@/lib/sanity/client`.

## Verification
- Run: `npm run build` (package.json has no test script; only dev/build/start)
