# story

## Overview
Server-compatible (no `"use client"`) Portable Text renderers built on `@portabletext/react`: diary entry bodies (paragraphs and inline photographs) and text-only rich text for the About and Preparation pages.

## Interface
- `PortableStory({ blocks }: { blocks: StoryBlock[] })` in `PortableStory.tsx` — paragraphs with bold, italic and links, plus `image` blocks (caption, `layout`).
- `RichText({ blocks, dropCap? })` — paragraphs with bold, italic and links only (images ignored); used by `src/app/about` and `src/app/preparation`.
- `StoryBlock` comes from `@/lib/types`.

## Invariants
- Both return `null` for falsy or empty `blocks`; empty (whitespace-only) paragraphs render nothing.
- Rendered marks are exactly the ones the Studio allows (`src/sanity/schemaTypes/richText.ts`): `strong`, `em`, `link`. Links pass `safeHref` (only `http`, `https`, `mailto`; anything else renders as plain text); external links open in a new tab with `rel="noopener noreferrer"`.
- `PortableStory` gives the drop cap to the paragraph at index 0 only when the first block is text; `RichText` does so when `dropCap` is set.
- Image `layout === "full"` selects the wide variant; anything else uses `max-w-2xl`. Alt falls back to `caption`, then `"Travel photograph"`. Images without `url` are skipped.

## Side Effects
- None (pure render). Uses `next/image` with `fill`, so image hosts must be allowed by Next image config (`cdn.sanity.io`).

## Verification
- Run: `npm run build`; a story with bold text and a link should render `<strong>` and an `<a target="_blank">`.
