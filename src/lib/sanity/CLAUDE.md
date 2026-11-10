# src/lib/sanity

## Overview
Data-access layer for the site. `client.ts` creates a Sanity client and exposes async getters that query Sanity with GROQ and fall back to local seed data (`@/lib/content/seedData.json`) when Sanity is unavailable or returns nothing.

## Interface
- `client.ts:sanityClient` - `createClient({projectId, dataset, apiVersion: "2024-03-01", useCdn: NODE_ENV === "production"})`, or `null` if `projectId` is falsy.
- `client.ts:getSlugString(slug)` - normalizes `{current}` | string | undefined to a string (`""` when missing).
- `client.ts:getSiteSettings()` -> `SiteSettings`
- `client.ts:getAllChapters()`, `getChapterBySlug(slug)` -> `Chapter[]` / `Chapter | null`
- `client.ts:getAllDays()`, `getDayBySlug(slug)` (returns `{day, prevDay, nextDay}` or null), `getDaysByChapter(chapterSlug)`
- `client.ts:getAllPractices()`, `getPracticeBySlug(slug)` (returns `{practice, days}` or null)
- `client.ts:getAllPlaces()` -> `Place[]`
- `client.ts:getAllPhotographs()` - flattens each day's `coverImageUrl` and `gallery[].url` into a photo list.
- Types come from `@/lib/types` (see [../CLAUDE.md](../CLAUDE.md)).

## Invariants
- `projectId` defaults to `"tun41dyc"` and `dataset` to `"production"` when `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` are unset (`client.ts` top-level constants).
- Every getter falls back to seed data on a thrown fetch error or an empty/falsy result (`getSiteSettings` also requires `res.siteTitle`).
- Chapters, days and practices are queried `order(order asc)`; seed fallbacks are sorted by `order` ascending.
- GROQ projections use `coalesce(<asset>->url, <legacy url field>)` to yield `heroImageUrl`, `imageUrl`, `coverImageUrl`, `gallery[].url`, and inline `story` image `url`; `getAllDays` also derives `chapterSlug` and `practiceSlugs` via reference dereference with fallback to the stored fields. These output names must stay in sync with `src/lib/types.ts` and the schemas in `src/sanity/schemaTypes`.
- `getAllPlaces` uses `*[_type == "place"]` with no projection and no ordering.
- `getAllDays` also projects `coverImageCaption` (`coalesce(coverImage.caption, coverImageCaption)`).
- `getAllPhotographs` captions fall back to the day title (`coverImageCaption || title`, `g.caption || day.title`).
- `getChapterBySlug`, `getDayBySlug`, `getDaysByChapter` and `getPracticeBySlug` fetch the whole list and filter in memory; `getDaysByChapter` compares `d.chapterSlug === chapterSlug` directly (no `getSlugString`), and `getPracticeBySlug` selects days with `practiceSlugs?.includes(slug)`.
- Seed fallbacks call `.sort()` on the imported `seedData` arrays, which sorts them in place.

## Side Effects
- Network: HTTPS fetches to Sanity (CDN in production).
- `console.warn("Sanity fetch failed, using local seed data:", e)` on fetch errors.
- No writes to Sanity or disk.

## Verification
- Run: `npm run build` (package.json has no test script)
