# map

## Overview
Client-side interactive map of the places visited, built on Leaflet with OpenStreetMap tiles (real coastlines, countries, towns; pan and zoom), plus a detail panel listing the diary entries for the selected place. Rebuilt on 2026-11-10 to replace the earlier dotted canvas with a fixed linear projection.

## Interface
- `EditorialMap({ places }: { places: PlacePoint[] })` in `EditorialMap.tsx` (`"use client"`). `PlacePoint` (`name`, `country`, `lat`, `lng`, `days: Day[]`) is a local, non-exported interface. `Day` comes from `@/lib/types`; `getSlugString` from `@/lib/sanity/client`.
- Local helpers: `pinHtml(selected)` (inline-styled pin markup for `L.divIcon`), `formatCoordinates(lat, lng)` (N/S and E/W by sign).
- Dependencies: `leaflet` (loaded with `await import("leaflet")` inside `useEffect`, so it never runs on the server) and `leaflet/dist/leaflet.css`.

## Invariants
- Places with non-numeric or `NaN` `lat`/`lng` are filtered out (`validPlaces`).
- Selection is tracked by place `name` (`activeName`), so place names must be unique; the initial selection is `validPlaces[0]`.
- Region buttons are derived from the data: "Whole journey" plus each distinct `country`, ordered by the earliest `day.order` of its places. They are hidden when there is only one country. A region click calls `flyToBounds` on that country's places (`maxZoom: 10`).
- The initial view fits all places (`fitBounds`). Clicking a pin selects it and, when zoomed out below `PLACE_ZOOM - 2`, flies to it at `PLACE_ZOOM` (9) so overlapping towns separate.
- The dashed route line connects places in order of their earliest `day.order`; it is derived from data, not hard-coded.
- Scroll-wheel zoom is off until the map is clicked and turns off again on `mouseout`, so the page can scroll past the map.
- The map is created once per `validPlaces` value and removed on unmount (`map.remove()`); pin icons are re-created when the selection changes.
- The wrapper uses `isolate` so Leaflet's high z-index panes stay below the sticky navbar.
- Story links go to `/story/${getSlugString(day.slug)}`, keyed by `day._id`.

## Side Effects
- Network: map tiles are fetched in the browser from `https://tile.openstreetmap.org/{z}/{x}/{y}.png` (no API key; the OpenStreetMap attribution must stay visible and usage must respect the OSM tile usage policy). CARTO basemaps were tried and rejected because they now require an API key.
- A `<style>` block inside the component styles `.journey-map` (tile tint filter, tooltip, controls).
- Local React state only otherwise; no storage.

## Verification
- Run: `npm run build` (no test script in `package.json`), then open `/places` and check that tiles load, a region button zooms, and a pin click updates the entries panel.
