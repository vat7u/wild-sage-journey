# src/lib

## Overview
Shared domain types plus the content-access layer. `types.ts` defines the TypeScript shapes of Sanity documents as the getters return them; the `sanity` child fetches them. There is no local content (`content/seedData.json` was removed on 2026-11-14).

## Interface
- [sanity](./sanity/CLAUDE.md) - Sanity client, cache-tagged getters, date formatting.
- `types.ts` exports interfaces: `InlineImage`, `StoryBlock` (Portable Text block or inline image, with `markDefs` for links), `GalleryImage`, `Day`, `Chapter`, `Practice`, `Place`, `SiteSettings`.
- `types.ts:Day.entryDate` is the stored `YYYY-MM-DD`; `Day.date` (display) and `Day.dayNumber` are derived by `getAllDays`; `Day.featured` is optional; `Day.order` is an optional same-date tie-break.
- `types.ts:SiteSettings.aboutText` / `preparationText` are `StoryBlock[]`; `introduction`, `footerText`, `footerQuote`, `heroImageUrl/Alt`, `preparationImageUrl/Alt` are optional.

## Invariants
- Interfaces are type-only (no runtime code in `types.ts`); `_type` discriminants are literals (`"day"`, `"chapter"`, `"practice"`, `"place"`, `"siteSettings"`).
- Flattened fields (`Day.chapterSlug`, `Day.coverImageUrl`, `Chapter.imageUrl`, `SiteSettings.heroImageUrl`, ...) come from GROQ projections in `sanity/client.ts`, not stored fields; keep them aligned with `src/sanity/schemaTypes`. `placeType.image` is hidden in the Studio and not typed here.

## Side Effects
- None in `types.ts`.

## Verification
- Run: `npm run build` (package.json has no test script)
