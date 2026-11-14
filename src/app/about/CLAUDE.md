# about

## Overview
`/about` page: the owner's narrative from Site Settings plus a call-to-action to the journey.

## Interface
- `page.tsx`: default export `AboutPage` (async server component); exports static `metadata`.
- Reads `getSiteSettings().aboutText` (rendered with `RichText`, drop cap on the first paragraph) and `getAllDays()` (entry count in the call-to-action).
- Links out to `/journey`.

## Invariants
- The narrative is edited in the Studio (Site Settings → About page → About Me); the heading, tagline and labels stay in code.

## Side Effects
- Sanity reads via `@/lib/sanity/client` (cached, tag `siteSettings`/`day`).

## Verification
- Run: `npm run build`
