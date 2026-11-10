# story/[slug]

## Overview
Dynamic route `/story/<slug>`: a single diary day with prev/next navigation.

## Interface
- `page.tsx`: default `DayPage`; `generateStaticParams` (from `getAllDays`); `generateMetadata` (title, description, openGraph image from `day.coverImageUrl`); `PageProps` with `params: Promise<{ slug: string }>`.
- `getDayBySlug` returns `{ day, prevDay, nextDay }`.
- Renders body with `PortableStory` (`@/components/story/PortableStory`), gallery via `day.gallery` (`url`, `caption`).
- Links to `/journey`, `/practices/<slug>`, adjacent `/story/<slug>`.

## Invariants
- `params` is awaited; missing day calls `notFound()` (metadata returns "Day Not Found — The Journey"). Gallery figures are keyed by array index (`key={idx}`).

## Side Effects
- Sanity reads at build and render time.

## Verification
- Run: `npm run build` (package.json has no test script; only dev/build/start)
