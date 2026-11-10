# components

## Overview
Presentational React components for the Next.js 15 App Router site, grouped by feature. This directory holds no direct source files; each subdirectory contains one component. Components consume data shaped by `@/lib/types` and `@/lib/sanity/client` (only `map` imports from the Sanity client, for `getSlugString`).

## Subdirectories & Boundaries
- gallery: [./gallery/CLAUDE.md](./gallery/CLAUDE.md) - `PhotoArchive`, client-side filterable photo grid linking to `/story/[slug]`.
- layout: [./layout/CLAUDE.md](./layout/CLAUDE.md) - `Navbar` and `Footer`, both hidden on `/studio`.
- map: [./map/CLAUDE.md](./map/CLAUDE.md) - `EditorialMap`, interactive Leaflet/OpenStreetMap map with region shortcuts and a per-place story list.
- story: [./story/CLAUDE.md](./story/CLAUDE.md) - `PortableStory`, renders `StoryBlock[]` as paragraphs and images.

## Verification
- Run: `npm run build` (no test script in `package.json`)
