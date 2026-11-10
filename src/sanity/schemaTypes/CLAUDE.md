# src/sanity/schemaTypes

## Overview
Sanity v3 document schemas built with `defineType` / `defineField` from `sanity`, aggregated in `index.ts`.

## Interface
- `index.ts:schemaTypes` - array `[dayType, chapterType, practiceType, placeType, siteSettingsType]`.
- `dayType.ts:dayType` - document `day`; fields title, slug, date, dayNumber, location, country, chapter (reference to `chapter`), coverImage, story (Portable Text with block + inline image having caption/alt/layout), gallery (images with caption/altText), practices (references to `practice`), coordinates (geopoint), order.
- `chapterType.ts:chapterType` - document `chapter`; fields title, slug, type (`chapter`|`interlude`, radio), country, subtitle, dateRange, startDate, endDate, coverImage, description, order.
- `practiceType.ts:practiceType` - document `practice`; fields title, slug, description, image, order.
- `placeType.ts:placeType` - document `place`; fields name, slug, country, coordinates, description, image.
- `siteSettingsType.ts:siteSettingsType` - document `siteSettings`; fields siteTitle, subtitle, dateRange, countries, introduction, heroImage, preparationText, aboutText.

## Invariants
- Required fields: day (title, slug, date, chapter); chapter (title, slug, type, order); practice (title, slug, order); place (name, slug, country); siteSettings (siteTitle).
- Slug `options.source` is `title` (day, chapter, practice) or `name` (place); maxLength 96.
- Image field names (`coverImage`, `image`, `heroImage`) are referenced by GROQ in `src/lib/sanity/client.ts` (`coverImage.asset->url`, `image.asset->url`, `heroImage.asset->url`); renaming them breaks the queries (the code falls back to seed data silently).
- Schema `name` values (`day`, `chapter`, `practice`, `place`, `siteSettings`) must match the `_type == "..."` filters in `client.ts`.
- New types must be added to `index.ts:schemaTypes` to appear in Studio.
- `dayType` and `chapterType` define `orderings` by `order` ascending.
- `dayType.story` text blocks allow `strong`/`em` decorators and a `link` annotation (`href`, type `url`); `src/components/story/PortableStory.tsx` does not render them.
- `practiceType.image` has an `alt` subfield that no GROQ projection reads, and `practiceType.preview.prepare` titles items `` `Practice 0${order}: ${title}` `` (assumes a single-digit order).

## Side Effects
- None at import time; definitions are declarative. They take effect when loaded by `../sanity.config.ts`.

## Verification
- Run: `npm run build` (package.json has no test script)
