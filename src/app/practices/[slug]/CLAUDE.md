# practices/[slug]

## Overview
Dynamic route `/practices/<slug>` showing one practice and its related days.

## Interface
- `page.tsx`: default `PracticeDetailPage`; `generateStaticParams` (from `getAllPractices`); `generateMetadata` (from `getPracticeBySlug`); `PageProps` with `params: Promise<{ slug: string }>`.
- `getPracticeBySlug` returns `{ practice, days }`.
- Links to `/practices` and `/story/<daySlug>`.

## Invariants
- `params` is awaited; missing practice calls `notFound()`.
- `practice.order` is zero-padded to two digits for display.

## Side Effects
- Sanity reads at build and render time.

## Verification
- Run: `npm run build` (package.json has no test script; only dev/build/start)
