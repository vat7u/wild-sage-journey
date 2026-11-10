# preparation

## Overview
`/preparation` prologue page with inline text and a static image.

## Interface
- `page.tsx`: default `PreparationPage` (async); exports `metadata`.
- Calls `getSiteSettings()` and `getAllDays()`; the "Begin the Journey" link targets `/story/<first day slug>`.
- Image src: `/images/Preparation%20for%20this%20trip!.jpg` (public asset).

## Invariants
- Falls back to slug `arrived-in-amsterdam` when no days exist.
- `settings` is fetched but not used in the rendered output.

## Side Effects
- Sanity reads via `@/lib/sanity/client`.

## Verification
- Run: `npm run build` (package.json has no test script; only dev/build/start)
