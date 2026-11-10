# photographs

## Overview
`/photographs` archive page; fetches photos and delegates rendering to a component.

## Interface
- `page.tsx`: default `PhotographsPage` (async); exports `metadata`.
- Uses `getAllPhotographs` (`@/lib/sanity/client`) and `PhotoArchive` (`@/components/gallery/PhotoArchive`, prop `photos`).

## Invariants
- Page only fetches and lays out the header; archive behavior lives in `PhotoArchive`.

## Side Effects
- Sanity read per render/build.

## Verification
- Run: `npm run build` (package.json has no test script; only dev/build/start)
