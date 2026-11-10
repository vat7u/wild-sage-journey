# src/app Blueprint

## System Overview
Next.js 15 App Router tree for "The Journey" travel memoir. Pages read content from Sanity through `@/lib/sanity/client`.

## Local Interface & Invariants
- `layout.tsx`: `RootLayout` loads fonts Newsreader/Cinzel/Outfit (CSS vars `--font-newsreader`, `--font-cinzel`, `--font-outfit`), exports `metadata` (`metadataBase` is `http://localhost:3000`), and wraps children in `Navbar` + `<main>` + `Footer`. `metadata` also sets a site description and default `openGraph.images` of `/images/Netherland.jpg`.
- `page.tsx`: `HomePage` (async) fetches `getSiteSettings`, `getAllChapters`, `getAllDays`; picks curated days by title keywords with fixed index fallbacks (`allDays[1]`, `[16]`, `[57]`, `[67]`); first-day slug falls back to `arrived-in-amsterdam`; the hero image falls back to `/images/Netherland.jpg` when `settings.heroImageUrl` is empty.
- `globals.css`: Tailwind directives, `:root` colors, body font, selection and scrollbar styles.

## Subdirectories & System Boundaries
- about: [./about/CLAUDE.md](./about/CLAUDE.md) - static About page.
- journey: [./journey/CLAUDE.md](./journey/CLAUDE.md) - chapters index; child [chapter](./journey/[chapter]/CLAUDE.md).
- photographs: [./photographs/CLAUDE.md](./photographs/CLAUDE.md) - photo archive.
- places: [./places/CLAUDE.md](./places/CLAUDE.md) - map page.
- practices: [./practices/CLAUDE.md](./practices/CLAUDE.md) - practices index; child [slug](./practices/[slug]/CLAUDE.md).
- preparation: [./preparation/CLAUDE.md](./preparation/CLAUDE.md) - prologue page.
- story: [./story/CLAUDE.md](./story/CLAUDE.md) - day pages; child [slug](./story/[slug]/CLAUDE.md).
- studio: [./studio/CLAUDE.md](./studio/CLAUDE.md) - embedded Sanity Studio; child [[...tool]](./studio/[[...tool]]/CLAUDE.md).

## Global Invariants
- Dynamic routes await `params` (Promise), use `generateStaticParams`, and call `notFound()` on missing data.
- Slugs are converted with `getSlugString` before URL use.

## Global Side Effects
- Sanity reads on build/render; Google font fetch via `next/font/google`.

## System Verification
- Run: `npm run build` (package.json has no test script; only dev/build/start)
