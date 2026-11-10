# src

## Overview
Application source for the Next.js 15 App Router site. Routes live in `app`,
presentational client components in `components`, the Sanity data layer and
shared types in `lib`, and the embedded Sanity Studio configuration and
schemas in `sanity`.

## Subdirectories & Boundaries
- app: [./app/CLAUDE.md](./app/CLAUDE.md) - root layout, home page, and the
  route segments (about, journey, photographs, places, practices,
  preparation, story, studio).
- components: [./components/CLAUDE.md](./components/CLAUDE.md) - `gallery`,
  `layout` (Navbar/Footer), `map`, and `story` (PortableStory) components.
- lib: [./lib/CLAUDE.md](./lib/CLAUDE.md) - domain types and the Sanity client
  with seed-data fallback (`lib/sanity`).
- sanity: [./sanity/CLAUDE.md](./sanity/CLAUDE.md) - Studio config mounted at
  `/studio` and document schemas (`sanity/schemaTypes`).
