# story

## Overview
Server-compatible (no `"use client"`) renderer that turns Sanity portable-text style story blocks into styled paragraphs and figures.

## Interface
- `PortableStory({ blocks }: { blocks: StoryBlock[] })` in `PortableStory.tsx`. Props type `PortableStoryProps` is local (not exported). `StoryBlock` comes from `@/lib/types`.

## Invariants
- Returns `null` when `blocks` is falsy or empty (`PortableStory.tsx:PortableStory`).
- Only `_type === "image"` (with a truthy `url`) and `_type === "block"` are rendered; any other block type renders `null`.
- Text blocks are flattened with `block.children?.map(c => c.text).join("")`; whitespace-only text renders nothing. Marks/styles/links are not rendered, even though `src/sanity/schemaTypes/dayType.ts` lets editors author `strong`/`em` decorators, a `link` annotation and block styles; that formatting is silently dropped.
- Only the block at index 0 gets the drop-cap classes, and only if it is a text block.
- Image `layout === "full"` selects the wide variant; anything else uses the `max-w-2xl` variant. Alt falls back to `caption`, then `"Travel photograph"`.
- Keys use `_key`, falling back to `img-${idx}` / `p-${idx}`.

## Side Effects
- None (pure render). Uses `next/image` with `fill`, so image hosts must be allowed by Next image config.

## Verification
- Run: `npm run build` (no test script in `package.json`)
