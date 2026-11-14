# preparation

## Overview
`/preparation` prologue page: photograph and text from Site Settings.

## Interface
- `page.tsx`: default `PreparationPage` (async); exports static `metadata`.
- Reads `getSiteSettings()` (`preparationImageUrl`/`Alt`, `preparationText`) and `getAllDays()`; the "Begin the Journey" link targets `/story/<first entry slug>`.

## Invariants
- The first `preparationText` block is the opening paragraph (drop cap); the remaining blocks render inside the indented left-border block.
- The photograph and the link are omitted when their data is missing; no local fallback image exists.

## Side Effects
- Sanity reads via `@/lib/sanity/client`.

## Verification
- Run: `npm run build`
