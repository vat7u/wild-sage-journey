# places

## Overview
`/places` journey map page.

## Interface
- `page.tsx`: default `PlacesPage` (async); exports `metadata`.
- Fetches `getAllPlaces()` and `getAllDays()` via `Promise.all`, builds `placePoints` (`name, country, lat, lng, days`) and passes them as `places` to `EditorialMap` (`@/components/map/EditorialMap`).

## Invariants
- Places without numeric `coordinates.lat` are dropped.
- A day matches a place when `day.location` and `place.name` contain each other (case-insensitive); places with no matching days are dropped. Because the match is a two-way substring test, a short place name can attach unrelated days.

## Side Effects
- Sanity reads via `@/lib/sanity/client`.

## Verification
- Run: `npm run build` (package.json has no test script; only dev/build/start)
