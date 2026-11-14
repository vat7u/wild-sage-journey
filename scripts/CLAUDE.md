# scripts

## Overview
One-off maintenance scripts run with `tsx` against the Sanity dataset. The site
itself never runs them. The earlier migration scripts (`import-content-to-sanity.ts`,
`upload-all-to-sanity.ts`, `migrate-seed-to-sanity.ts`) and `seedData.json`
were removed on 2026-11-14 after the content was verified in Sanity; they are
in git history.

## Interface
- `patch-content-model.ts` — moved the last hard-coded content into Sanity and
  filled the fields added on 2026-11-14:
  - `day.entryDate` from the legacy free-text `date` (year 2026;
    "End of July" set to 2026-07-28, `DATE_OVERRIDES`), `day.featured` on the four
    entries the home page used to pick by keyword (`FEATURED_ORDERS`);
  - `siteSettings.aboutText` / `preparationText` as Portable Text (copied from
    the old page code), `introduction` (home quote), `preparationImage`,
    `footerText`, `footerQuote`.
  - `--cleanup` mode unset the legacy `date` and `dayNumber` on all days (run 2026-11-14 after the deploy).
- Modes: dry run by default; `--confirm` writes; `--cleanup [--confirm]`.

## Invariants
- Run from the project root (reads `.env.local`); writes need
  `SANITY_API_TOKEN` (Editor token; revoke it afterwards).
- All main-mode writes use `setIfMissing` (or replace a field only while it is
  still the old plain-string type), so re-running never overwrites Studio edits.
- `--cleanup` refuses to run while any entry lacks `entryDate`, and must only
  run once the deployed site reads `entryDate` (older builds read `date`).
  After cleanup the main mode can no longer derive dates; it is not meant to be
  re-run.

## Side Effects
- Network writes to the Sanity dataset from `.env.local`.

## Verification
- Dry run: `npx tsx scripts/patch-content-model.ts` (expects 70 dated, 4 featured,
  "already converted").
