# src/lib/sanity

## Overview
Data-access layer. `client.ts` creates the Sanity client and exposes async
getters that query Sanity with GROQ. Sanity is the only source: there is no
seed fallback. Every query is cached in the Next.js data cache under the tag of
the document type(s) it reads and stays cached until `/api/revalidate`
revalidates that tag.

## Interface
- `client.ts:sanityClient` - `createClient({projectId, dataset, apiVersion: "2024-03-01", useCdn: false, perspective: "published"})`.
- `client.ts:CONTENT_TAGS` - `["day","chapter","practice","place","siteSettings"]`, also used by the webhook route.
- `client.ts:getSlugString(slug)` - normalizes `{current}` | string | undefined to a string.
- `client.ts:formatEntryDate(iso)` - `"2026-03-23"` -> `"March 23, 2026"` (UTC, no time zone shift).
- `client.ts:getSiteSettings()` -> `SiteSettings` (projects `heroImageUrl/Alt`, `preparationImageUrl/Alt`).
- `client.ts:getAllChapters()`, `getChapterBySlug(slug)`.
- `client.ts:getAllDays()` - entries with `entryDate`, ordered `entryDate asc, coalesce(order, 9999) asc`; derives `dayNumber` (1-based position) and the display `date`. `getDayBySlug(slug)` (`{day, prevDay, nextDay}`), `getDaysByChapter(chapterSlug)`, `getFeaturedDays(limit = 4)`.
- `client.ts:getAllPractices()`, `getPracticeBySlug(slug)` (`{practice, days}`).
- `client.ts:getAllPlaces()` - ordered by name.
- `client.ts:getAllPhotographs()` - flattens each day's cover and gallery into a photo list.
- Types come from `@/lib/types` (see [../CLAUDE.md](../CLAUDE.md)).

## Invariants
- `query()` wraps every fetch with `{ next: { revalidate: false, tags } }` and rethrows failures as `Sanity query "<name>" failed: ...`.
- `getSiteSettings`, `getAllChapters` and `getAllDays` throw when the result is empty (`required()`); practices and places may be empty.
- `getAllDays` is tagged `day`, `chapter` and `practice` (it dereferences chapter and practice slugs).
- Output field names (`imageUrl`, `coverImageUrl`, `coverImageCaption`, `heroImageUrl`, `chapterSlug`, `practiceSlugs`, `gallery[].url`, `story[image].url`, `date`, `dayNumber`) are what the pages read; keep them in sync with `src/lib/types.ts` and the schemas.
- Derived getters (`getChapterBySlug`, `getDayBySlug`, `getDaysByChapter`, `getFeaturedDays`, `getPracticeBySlug`) filter the cached full lists in memory.

## Side Effects
- Network: HTTPS reads from Sanity (no CDN), cached by Next.js.
- No writes.

## Verification
- Run: `npm run build`; with `NEXT_PUBLIC_SANITY_DATASET` set to a missing dataset the getters throw with the query name.
