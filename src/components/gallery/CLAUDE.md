# gallery

## Overview
Client-side photograph archive with country filtering and a responsive grid linking each photo to its story page.

## Interface
- `PhotoArchive({ photos }: { photos: PhotoItem[] })` in `PhotoArchive.tsx` (`"use client"`). `PhotoItem` and `PhotoArchiveProps` are local, non-exported interfaces. `PhotoItem` fields: `url`, `caption?`, `dayTitle`, `daySlug`, `date`, `location`, `country`, `chapterSlug`.

## Invariants
- Filter options are derived from `photos` via `useMemo`, always prefixed with `"all"`; empty `country`/`chapterSlug` values are dropped.
- Filtering is `country AND chapter` (`filteredPhotos`). `selectedChapter` state and its `chapters` list exist, but the UI renders buttons only for country; chapter stays `"all"` (`PhotoArchive.tsx:PhotoArchive`).
- Each photo links to `/story/${photo.daySlug}`; alt is `caption || dayTitle`.
- Aspect ratio rhythm is index-based: `idx % 5 === 0` gives 4/5, else `idx % 3 === 0` gives 16/10, else 4/3.
- React key is `${photo.url}-${idx}`.

## Side Effects
- Local React state only (`useState`); no network or storage. Uses `next/image` (`fill`) and `next/link`.
- Imports `Calendar` from `lucide-react` but does not use it.

## Verification
- Run: `npm run build` (no test script in `package.json`)
