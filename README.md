# Wild Sage Journey — Digital Travel Memoir

A polished editorial-style travel diary and memoir website built on **Next.js**, **TypeScript**, **Tailwind CSS**, and **Sanity CMS**.

## Overview

This site documents a personal 5-month journey across:
- **Chapter 01 — The Netherlands & Belgium** (March 21 – May 30, 2026)
- **Chapter 02 — Morocco** (June 4 – July 20, 2026)
- **Interlude — Orlando, Florida** (July 30 – August 3, 2026)
- **Chapter 03 — Argentina** (August 6 – August 18, 2026)

Seventy diary entries, authentic travel photography, an interactive journey map, a visual photograph archive, and an exploration of The 8 Practices.

---

## Tech Stack

- **Next.js 15** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS** + `@tailwindcss/typography`
- **Sanity CMS v3** with Portable Text
- **Google Fonts**: Newsreader (serif), Cinzel (display), Outfit (sans)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token
```

> Without these, the app reads content from the local seed dataset at `src/lib/content/seedData.json` (already populated from the source markdown files).

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Content Management

### Sanity Studio

Open [http://localhost:3000/studio](http://localhost:3000/studio) to access the embedded Sanity Studio.

### One-time Content Migration

To import all 70 diary entries, 4 chapters, 8 practices, and place coordinates into Sanity:

```bash
npm run import:sanity
```

This script:
1. Parses all Markdown source files from the `Content/` folder (original diary writings, preserved verbatim)
2. Maps real travel photographs by date and keyword
3. Generates `src/lib/content/seedData.json` (local fallback)
4. Generates `sanity-export.ndjson` for Sanity CLI import
5. Optionally pushes directly to Sanity if env vars are set

You can also import the NDJSON file via Sanity CLI:

```bash
npx sanity dataset import sanity-export.ndjson production
```

---

## Routes

| Route | Description |
|---|---|
| `/` | Homepage — digital travel book cover |
| `/journey` | Chronological visual timeline of all 70 days |
| `/journey/[chapter]` | Chapter detail page |
| `/story/[slug]` | Individual day reading page (most important) |
| `/photographs` | Filterable visual archive |
| `/places` | Interactive journey map |
| `/practices` | The 8 Practices index |
| `/practices/[slug]` | Practice with related diary moments |
| `/preparation` | Before the journey prologue |
| `/about` | About the author |
| `/studio` | Embedded Sanity Studio |

---

## Content Rules

1. Never rewrite the original diary text
2. Never summarize or invent experiences
3. Sanity CMS is the single source of truth after migration
4. The `seedData.json` provides a seamless fallback before Sanity is configured

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── journey/            # Timeline & chapter pages
│   ├── story/[slug]/       # Day reading pages
│   ├── photographs/        # Photo archive
│   ├── places/             # Journey map
│   ├── practices/          # The 8 Practices
│   ├── preparation/        # Pre-journey prologue
│   ├── about/              # Author about page
│   └── studio/[[...tool]]/ # Sanity Studio
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── story/              # PortableStory renderer
│   ├── gallery/            # PhotoArchive
│   └── map/                # EditorialMap
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── sanity/client.ts    # Sanity client & GROQ queries
│   └── content/seedData.json  # Local content seed
└── sanity/
    ├── sanity.config.ts    # Sanity Studio config
    └── schemaTypes/        # Day, Chapter, Practice, Place schemas
```
