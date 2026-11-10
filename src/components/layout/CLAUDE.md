# layout

## Overview
Site chrome (header and footer) rendered as client components that hide themselves on the Sanity Studio route.

## Interface
- `Navbar()` in `Navbar.tsx` (`"use client"`): sticky header, desktop nav, mobile drawer toggled by `mobileMenuOpen` state. Nav items: `/journey`, `/places`, `/photographs`, `/practices`, `/about`, plus a separate `/preparation` link rendered outside `navItems` (desktop: `hidden lg:inline-flex`; the mobile drawer has its own copy).
- `Footer()` in `Footer.tsx` (`"use client"`): three-column footer with hard-coded chapter links (`/journey/netherlands-belgium`, `/journey/morocco`, `/journey/orlando-interlude`, `/journey/argentina`), exploration links, and a `/studio` link.

## Invariants
- Both components return `null` when `usePathname()` starts with `/studio` (`Navbar.tsx:Navbar`, `Footer.tsx:Footer`). Preserve this, since the Studio must render without site chrome (added in git commit `fix(studio): remove website header and footer on /studio route`; this rationale comes from history, not from code).
- Active nav state: `pathname === href || pathname.startsWith(href)` for non-`/` hrefs. The `/preparation` link has no active styling.
- Selecting a mobile link closes the drawer (`setMobileMenuOpen(false)`).
- Chapter slugs, trip dates ("March 21 – August 18, 2026") and copy in `Footer.tsx` are hard-coded, not fetched from Sanity; they must be kept in sync with content manually.
- In `Navbar`, the early `return null` occurs after `useState` and `usePathname`, so hook order is stable.

## Side Effects
- Local React state only; navigation via `next/link`. No network or storage. `Navbar` imports `Compass` but does not use it.

## Verification
- Run: `npm run build` (no test script in `package.json`)
