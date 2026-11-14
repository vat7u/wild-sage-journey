# src/app Blueprint

## System Overview
Next.js 15 App Router tree for "The Journey" travel memoir. Every page reads its content from Sanity through `@/lib/sanity/client`; cached results are refreshed by the Sanity webhook (`api/revalidate`).

## Local Interface & Invariants
- `layout.tsx`: async `RootLayout` loads fonts Newsreader/Cinzel/Outfit, fetches `getSiteSettings()` and `getAllChapters()`, and passes them as props to `Navbar` and `Footer`. `generateMetadata` builds the default title/description/Open Graph image from Site Settings; `metadataBase` is `NEXT_PUBLIC_SITE_URL` or `https://wild-sage-journey.vercel.app`.
- `page.tsx`: `HomePage` (async) fetches settings, chapters, all days and `getFeaturedDays(4)`; hero photo, quote (`introduction`), countries and dates come from Site Settings; "Selected Moments" are the entries ticked "Featured on home page" (section hidden when none); "Begin the journey" links to the first entry by date.
- `globals.css`: Tailwind directives, `:root` colors, body font, selection and scrollbar styles.

## Subdirectories & System Boundaries
- about: [./about/CLAUDE.md](./about/CLAUDE.md) - About page from Site Settings.
- api/revalidate: [./api/revalidate/CLAUDE.md](./api/revalidate/CLAUDE.md) - Sanity webhook that refreshes cached content.
- journey: [./journey/CLAUDE.md](./journey/CLAUDE.md) - chapters index; child [chapter](./journey/[chapter]/CLAUDE.md).
- photographs: [./photographs/CLAUDE.md](./photographs/CLAUDE.md) - photo archive.
- places: [./places/CLAUDE.md](./places/CLAUDE.md) - map page.
- practices: [./practices/CLAUDE.md](./practices/CLAUDE.md) - practices index; child [slug](./practices/[slug]/CLAUDE.md).
- preparation: [./preparation/CLAUDE.md](./preparation/CLAUDE.md) - prologue page from Site Settings.
- story: [./story/CLAUDE.md](./story/CLAUDE.md) - entry pages; child [slug](./story/[slug]/CLAUDE.md).
- studio: [./studio/CLAUDE.md](./studio/CLAUDE.md) - embedded Sanity Studio; child [[...tool]](./studio/[[...tool]]/CLAUDE.md).

## Global Invariants
- No content is hard-coded in pages; headings, taglines, labels and SEO descriptions are code by decision, and visible counts are derived from data.
- Dynamic routes await `params`, use `generateStaticParams`, keep `dynamicParams` on (new entries render on first visit), and call `notFound()` on missing data.
- Slugs are converted with `getSlugString` before URL use.
- The layout fetches Sanity for every route (including `/studio`), so a Sanity outage fails the build rather than serving partial chrome.

## Global Side Effects
- Sanity reads on build, render and revalidation; Google font fetch via `next/font/google`.

## System Verification
- Run: `npm run build` (package.json has no test script; only dev/build/start)
