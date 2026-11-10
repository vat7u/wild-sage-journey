## CLAUDE.md (root)

- States `.env.local` supplies `NEXT_PUBLIC_SANITY_API_VERSION`; no code reads it (`src/lib/sanity/client.ts` hard-codes `apiVersion = "2024-03-01"`; `src/sanity/sanity.config.ts` sets none).
- Not documented: `package.json` dependencies `@portabletext/react` and `@sanity/image-url` have no usages in `src`, `scripts` or `next.config.ts`.

## scripts/CLAUDE.md

- Claim that `upload-all-to-sanity.ts` "rebuilds the documents with asset references" was not verified line-by-line (only the header, `uploadImages`, and the tail were read).
- Not documented: `import-content-to-sanity.ts` only reads `process.env` without a project-id fallback, whereas `upload-all-to-sanity.ts` falls back to `tun41dyc`; the doc mentions the fallback only for the latter, which is correct, but the two scripts' differing safety is not called out beyond the token note.

## src/CLAUDE.md

No drift detected.

## src/app/CLAUDE.md

- Not documented: root `metadata` sets default `openGraph.images` to `/images/Netherland.jpg` and a site description.
- Not documented: `HomePage` hero image falls back to `/images/Netherland.jpg` when `settings.heroImageUrl` is empty.

## src/app/about/CLAUDE.md, src/app/photographs/CLAUDE.md, src/app/practices/CLAUDE.md, src/app/practices/[slug]/CLAUDE.md, src/app/studio/CLAUDE.md, src/app/studio/[[...tool]]/CLAUDE.md, src/app/story/CLAUDE.md

No drift detected.

## src/app/journey/CLAUDE.md

- Not documented: `JourneyPage` compares `d.chapterSlug === getSlugString(chap.slug)` while `getDaysByChapter` (used by the child route) compares `d.chapterSlug === chapterSlug` directly; the grouping logic is duplicated, not shared.

## src/app/journey/[chapter]/CLAUDE.md

No drift detected.

## src/app/places/CLAUDE.md

- Not documented: places are matched to days with a bidirectional substring test, so short names (e.g. a place named "Rabat" and a day location containing it) can attach unrelated days; the doc states the rule but not this over-matching consequence.

## src/app/preparation/CLAUDE.md

No drift detected (the unused `settings` fetch is correctly recorded).

## src/app/story/[slug]/CLAUDE.md

- Not documented: gallery figures use `key={idx}` rather than a stable key.

## src/components/CLAUDE.md

No drift detected.

## src/components/gallery/CLAUDE.md

No drift detected (unused `Calendar` import and dormant `selectedChapter` filter confirmed in `PhotoArchive.tsx`).

## src/components/layout/CLAUDE.md

- The invariant citing the commit "remove website header and footer on /studio route" is grounded in git history, not in code; the actual subject is `fix(studio): remove website header and footer on /studio route`.
- Not documented: the `/preparation` link is rendered separately from `navItems` and carries the class `hidden lg:inline-flex` (desktop only in that position); the mobile drawer renders its own `/preparation` link.

## src/components/map/CLAUDE.md

- Overview says pins use a "Mercator-style projection"; `project()` uses a plain linear mapping in both axes (`y = (maxLat - lat) / (maxLat - minLat)`), i.e. not Mercator. The doc's own invariant says the y mapping is linear, so the overview contradicts it.
- Source comments in `project()` describe latitude "-40 to +60" while the constants are `minLat = -38`, `maxLat = 58`; the doc's numbers match the constants (the code comment is what has drifted).

## src/components/story/CLAUDE.md

- Cross-boundary drift: the schema (`src/sanity/schemaTypes/dayType.ts`) allows `strong`/`em` decorators, a `link` annotation (`href`) and block styles, but `PortableStory` flattens children to plain text and discards all marks, styles and links. The doc records the renderer behavior but not that authored formatting is silently lost.

## src/lib/CLAUDE.md

- `Place` in `types.ts` has no `image`/`imageUrl` field although `placeType` defines `image` and `getAllPlaces` applies no projection, so the doc's "keep them aligned with schemaTypes" invariant is already unmet for places.

## src/lib/sanity/CLAUDE.md

- Not documented: the `getAllPhotographs` caption falls back to the day title (`coverImageCaption || title`, `g.caption || day.title`).
- Not documented: `getAllDays` also projects `coverImageCaption`.
- Not documented: seed-data fallbacks call `.sort()` on the imported JSON arrays, which mutates them in place.
- Not documented: `getDaysByChapter` compares `chapterSlug` by strict equality without `getSlugString`; `getPracticeBySlug` selects days via `practiceSlugs?.includes(slug)`.
- Not documented: `getChapterBySlug`, `getDayBySlug`, `getDaysByChapter` and `getPracticeBySlug` fetch the full list and filter client-side rather than issuing per-slug GROQ queries.

## src/sanity/CLAUDE.md

No drift detected.

## src/sanity/schemaTypes/CLAUDE.md

- Not documented: `dayType.story` block defines `decorators` (`strong`, `em`) and a `link` annotation with a `url` field.
- Not documented: `practiceType.preview.prepare` builds the title as `` `Practice 0${order}: ${title}` `` (assumes a single-digit order).
- Not documented: `practiceType.image` has an `alt` subfield that no GROQ projection reads.
