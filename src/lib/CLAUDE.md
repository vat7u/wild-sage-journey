# src/lib

## Overview
Shared domain types plus the content-access layer. `types.ts` defines the TypeScript shapes of Sanity documents; the `sanity` child fetches them. `content/` holds only `seedData.json` (a local data file with no source code, used as the offline fallback by the Sanity client); it has no contract of its own.

## Interface
- [sanity](./sanity/CLAUDE.md) - Sanity client and getters with seed-data fallback.
- `types.ts` exports interfaces: `InlineImage`, `StoryBlock`, `GalleryImage`, `Day`, `Chapter`, `Practice`, `Place`, `SiteSettings`.
- `types.ts:Day.slug`, `Chapter.slug`, `Practice.slug`, `Place.slug` are `{_type:"slug"; current} | string`.
- `types.ts:Chapter.type` is `"chapter" | "interlude"`; `StoryBlock.layout` / `InlineImage.layout` is `"full" | "standard" | "offset"`.

## Invariants
- Interfaces are type-only (no runtime code in `types.ts`); `_type` discriminants are literals (`"day"`, `"chapter"`, `"practice"`, `"place"`, `"siteSettings"`).
- Flattened fields such as `Day.chapterSlug`, `Day.coverImageUrl`, `Chapter.imageUrl`, `SiteSettings.heroImageUrl` are produced by GROQ projections in `sanity/client.ts`, not stored schema fields; keep them aligned with `src/sanity/schemaTypes`. Known gap: `placeType` defines `image`, but `Place` has no image field and `getAllPlaces` applies no projection, so place images are never surfaced.

## Side Effects
- None in `types.ts`.

## Verification
- Run: `npm run build` (package.json has no test script)
