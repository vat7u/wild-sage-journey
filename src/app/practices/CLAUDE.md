# practices

## Overview
`/practices` index: grid of "The 8 Practices".

## Interface
- `page.tsx`: default `PracticesPage` (async); exports `metadata`.
- Uses `getAllPractices`, `getSlugString`; renders `practice.imageUrl` through `next/image` when present; links to `/practices/<slug>`.
- Child route: [practices/[slug]](./[slug]/CLAUDE.md).

## Invariants
- Cards use `practice._id` as key and `practice.order` zero-padded for the label.

## Side Effects
- Sanity read per render/build.

## Verification
- Run: `npm run build` (package.json has no test script; only dev/build/start)
