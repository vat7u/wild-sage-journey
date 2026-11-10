# src/sanity

## Overview
Sanity Studio configuration for the embedded studio. `sanity.config.ts` wires project settings, the structure tool, and the schema list from the child directory.

## Interface
- `sanity.config.ts` default export `defineConfig({...})`: `basePath: "/studio"`, `name: "wild_sage_journey_studio"`, `title: "The Journey — Editorial Memoir Studio"`, `plugins: [structureTool()]`, `schema.types: schemaTypes`.
- [schemaTypes](./schemaTypes/CLAUDE.md) - document schemas (day, chapter, practice, place, siteSettings).

## Invariants
- `projectId` defaults to `"tun41dyc"` and `dataset` to `"production"` unless `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` are set; the same defaults are used in `src/lib/sanity/client.ts` and must stay in sync.
- `basePath: "/studio"` must match the Next.js route serving the Studio.

## Side Effects
- None at definition time; the config is consumed by Sanity Studio at runtime, which connects to the Sanity project.

## Verification
- Run: `npm run build` (package.json has no test script)
