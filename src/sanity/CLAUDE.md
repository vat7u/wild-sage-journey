# src/sanity

## Overview
Sanity Studio configuration for the embedded studio at `/studio`. `sanity.config.ts` wires project settings, a custom desk structure (Site Settings as a single fixed document), and the schema list from the child directory.

## Interface
- `sanity.config.ts` default export `defineConfig({...})`: `basePath: "/studio"`, `name: "wild_sage_journey_studio"`, `title: "The Journey — Editorial Memoir Studio"`, `plugins: [structureTool({ structure })]`, `schema.types: schemaTypes`, `schema.templates` (Site Settings removed from "new document"), `document.actions` (Site Settings limited to publish / discard changes / restore).
- [schemaTypes](./schemaTypes/CLAUDE.md) - document schemas (day, chapter, practice, place, siteSettings) and the shared `richTextBlock`.

## Invariants
- Site Settings is a singleton: the structure opens document id `SITE_SETTINGS_ID` (`"siteSettings"`, from `schemaTypes/siteSettingsType.ts`); the site queries `*[_type == "siteSettings"][0]`, so a second document must never exist.
- `projectId` defaults to `"tun41dyc"` and `dataset` to `"production"` unless `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` are set; the same defaults are used in `src/lib/sanity/client.ts` and must stay in sync.
- `basePath: "/studio"` must match the Next.js route serving the Studio.

## Side Effects
- None at definition time; the Studio connects to the Sanity project at runtime with the editor's own login.

## Verification
- Run: `npm run build`, then open `/studio` and check that Site Settings opens directly and has no delete/duplicate action.
