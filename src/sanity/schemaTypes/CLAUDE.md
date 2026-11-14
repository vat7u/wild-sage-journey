# src/sanity/schemaTypes

## Overview
Sanity v3 document schemas built with `defineType` / `defineField` from `sanity`, aggregated in `index.ts`.

## Interface
- `index.ts:schemaTypes` - array `[dayType, chapterType, practiceType, placeType, siteSettingsType]`.
- `richText.ts:richTextBlock` - shared block definition: style `normal` only, no lists, decorators `strong`/`em`, `link` annotation (`href`: http, https or mailto).
- `dayType.ts:dayType` - document `day` (Studio title "Diary Entry"); fields title, slug, `entryDate` (date), `featured` (boolean), hidden read-only legacy `date`/`dayNumber`, location, country, chapter (reference), coverImage (alt, caption), story (`richTextBlock` + inline image with caption/alt/layout), gallery (images with caption/altText), practices (references), coordinates (geopoint), `order` (optional same-date tie-break).
- `chapterType.ts:chapterType` - document `chapter`; fields title, slug, type (`chapter`|`interlude`), country, subtitle, dateRange, startDate, endDate, coverImage (required), description, order.
- `practiceType.ts:practiceType` - document `practice`; fields title, slug, description, image, order.
- `placeType.ts:placeType` - document `place`; fields name, slug, country, coordinates (required, lat/lng range checked), description, image (hidden; not shown on the site).
- `siteSettingsType.ts:siteSettingsType` - document `siteSettings`, grouped General / Home page / About page / Preparation page / Footer; fields siteTitle, subtitle, dateRange, countries, heroImage (alt), introduction (home quote, text), aboutText (rich text), preparationImage (alt), preparationText (rich text), footerText, footerQuote. Exports `SITE_SETTINGS_ID`.

## Invariants
- Required fields: day (title, slug, entryDate, chapter); chapter (title, slug, type, coverImage, order); practice (title, slug, order); place (name, slug, country, coordinates); siteSettings (siteTitle).
- Every field must be shown by the site or hidden; rich text fields use `richTextBlock` because `src/components/story/PortableStory.tsx` renders only paragraphs, bold, italic and links.
- Field names are referenced by GROQ in `src/lib/sanity/client.ts` (`entryDate`, `featured`, `coverImage.asset->url`, `image.asset->url`, `heroImage`, `preparationImage`, ...); renaming one makes the site lose that content (there is no fallback).
- Schema `name` values must match the `_type == "..."` filters in `client.ts` and `CONTENT_TAGS`.
- `dayType` orderings: by `entryDate` (then `order`) ascending, and newest first. The legacy `date`/`dayNumber` fields are removed from the data by `scripts/patch-content-model.ts --cleanup`; drop their definitions after that.
- `practiceType.preview.prepare` titles items `` `Practice 0${order}: ${title}` `` (assumes a single-digit order).

## Side Effects
- None at import time; definitions are declarative. They take effect when loaded by `../sanity.config.ts`.

## Verification
- Run: `npm run build` (package.json has no test script)
