# studio/[[...tool]]

## Overview
Optional catch-all route embedding Sanity Studio at `/studio`.

## Interface
- `page.tsx`: default `StudioPage`, a client component (`"use client"`) rendering `<NextStudio config={config} />` from `next-sanity/studio`, with config imported from `@/sanity/sanity.config`.

## Invariants
- Must stay a client component.
- Navbar and Footer hide themselves on paths starting with `/studio` (`components/layout/Navbar.tsx`, `Footer.tsx` use `pathname?.startsWith("/studio")`); the root layout still renders them.

## Side Effects
- Studio talks to the Sanity backend configured in `sanity.config`.

## Verification
- Run: `npm run build` (package.json has no test script; only dev/build/start)
