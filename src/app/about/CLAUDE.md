# about

## Overview
Static `/about` page: hard-coded personal narrative plus a call-to-action to the journey.

## Interface
- `page.tsx`: default export `AboutPage` (sync server component); exports `metadata`.
- Links out to `/journey` via `next/link`.

## Invariants
- No data fetching; narrative text is inline JSX (`page.tsx:AboutPage`), so copy edits require code changes.

## Side Effects
- None (no network or disk access in `page.tsx`).

## Verification
- Run: `npm run build` (package.json has no test script; only dev/build/start)
