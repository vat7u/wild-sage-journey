# layout

## Overview
Site chrome (header and footer) rendered as client components that hide themselves on the Sanity Studio route.

## Interface
- `Navbar({ siteTitle })` in `Navbar.tsx` (`"use client"`): site title from Site Settings; sticky header, desktop nav, mobile drawer toggled by `mobileMenuOpen` state. Nav items: `/journey`, `/places`, `/photographs`, `/practices`, `/about`, plus a separate `/preparation` link rendered outside `navItems` (desktop: `hidden lg:inline-flex`; the mobile drawer has its own copy).
- `Footer({ siteTitle, footerText, dateRange, footerQuote, chapters })` in `Footer.tsx` (`"use client"`): three-column footer; text, dates and quote from Site Settings, chapter links built from `chapters` (`FooterChapter[]`, label = chapter title without the leading "Chapter "), fixed exploration links, and a `/studio` link.
- Both receive their data as props from the server `src/app/layout.tsx` (client components cannot call the Sanity getters).

## Invariants
- Both components return `null` when `usePathname()` starts with `/studio` (`Navbar.tsx:Navbar`, `Footer.tsx:Footer`). Preserve this, since the Studio must render without site chrome (added in git commit `fix(studio): remove website header and footer on /studio route`; this rationale comes from history, not from code).
- Active nav state: `pathname === href || pathname.startsWith(href)` for non-`/` hrefs. The `/preparation` link has no active styling.
- Selecting a mobile link closes the drawer (`setMobileMenuOpen(false)`).
- Footer content is never hard-coded: blocks for missing `footerText`, `dateRange` or `footerQuote` are simply omitted; the copyright year is the current year.
- In `Navbar`, the early `return null` occurs after `useState` and `usePathname`, so hook order is stable.

## Side Effects
- Local React state only; navigation via `next/link`. No network or storage. `Navbar` imports `Compass` but does not use it.

## Verification
- Run: `npm run build` (no test script in `package.json`)
