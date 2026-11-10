# Move Site Content into Sanity and Set Up the Studio

* **Author:** vat7u
* **Date:** 2026-11-10

## Overview

The Journey site shows about 70 diary entries, 4 chapters, 8 practices, a map of
about 32 places, and site text. All of it is served from a file in the code
(`src/lib/content/seedData.json`) and photos in `public/images`. The Sanity
project (`tun41dyc`, dataset `production`) is empty. The site only looks normal
because `src/lib/sanity/client.ts` quietly falls back to the seed file when
Sanity returns nothing.

The goal: the site owner, who is the only editor, adds and changes diary
entries, photos, places, practices and site text in Sanity Studio, and the live
site shows those changes without code changes.

Much of the plumbing exists: schemas for five document types, a Studio at
`/studio`, and page code that reads from Sanity. What is missing is the content
in Sanity, a way for Studio edits to reach the live site, and fixes so that new
Studio entries do not break pages.

"Blog posts" means the existing diary entries (the `day` type). No second post
type is planned.

## Analysis

Reviewers raised these points. They are listed with the most serious first.

**1. Studio edits will not show on the live site today.** Pages are built ahead
of time and nothing tells them to rebuild when content changes. The dynamic
routes (`/story/[slug]`, `/journey/[chapter]`, `/practices/[slug]`) list their
pages at build time, so a new diary entry would not get a page until the next
deploy. "Without code changes" is false until one of these is added: a timed
refresh (for example every 60 seconds), a Sanity webhook that calls a refresh
endpoint (seconds of delay, more code), or a webhook that triggers a Vercel
deploy (no code, one to two minutes of delay). The target delay has to be
chosen first.

**2. The two migration scripts do not work together.** `import-content-to-sanity.ts`
is the one wired to `npm run import:sanity`, but it uploads no images and
writes fake image references. `upload-all-to-sanity.ts` uploads images but is
not wired to npm. They use different document IDs and different day URLs
(one prefixes the date, the other uses only the title). The live site was
built from the first one's output. Running the second changes every
`/story/<slug>` URL and breaks old links. Running both creates duplicates.
Using only titles as IDs can silently overwrite entries that share a title.
`upload-all-to-sanity.ts` also reads Markdown from `../Content`, a folder
outside the repository that may not match what is live. The lowest-risk source
is the current `seedData.json`, because it is what visitors see today.

**3. Token and safety.** A working Sanity token is hard-coded in
`scripts/upload-all-to-sanity.ts` and is in git history. It must be revoked in
the Sanity dashboard before anything else. The migration needs a new write
token with the lowest role that works, kept only in `.env.local` (not in
Vercel, not `NEXT_PUBLIC_`), and revoked afterward. Both scripts write to
`production` straight away and use `createOrReplace`, so re-running after the
owner starts editing would erase edits. The migration should run once, refuse
to run if entries already exist, take an export first, and be tried on a test
dataset before production.

**4. The silent fallback hides failures.** Today it hides an empty dataset.
After migration it becomes a second problem: if Sanity errors, or the owner
deletes everything of one type, the old seed content comes back and Studio edits
look broken. Removing it too early gives the opposite: an empty site, or a
build during a Sanity outage that publishes nothing. Reviewers agreed on the
order: migrate, check, deploy with the fallback on, add the refresh mechanism,
then remove the fallback and the seed file in a later, separate commit. The
Vercel deployment from before that commit is the rollback.

**5. New Studio entries can break or land in the wrong place.** `order` and
`dayNumber` are typed by hand and optional, and lists sort by `order`; a new
entry without it can sort first, and a missing `dayNumber` prints
"Dayundefined". `date` is free text with no year, so there is nothing real to
sort on. A new chapter without a cover image passes nothing to the image
component. The home page picks entries by title keywords and fixed positions
(`allDays[1]`, `[16]`, `[57]`, `[67]`), so adding entries changes the home
page. `siteSettings` can be created twice in Studio and the site reads the
first one. The Preparation page fetches settings but does not use them, and
the About page is inline text, so editing those in Studio may do nothing.

**6. Content the owner writes can be dropped.** The Studio allows bold, italic,
links, headings and lists, but `PortableStory.tsx` renders plain paragraphs and
images only. The migrated content is plain blocks, so the problem appears
after the owner's first formatted edit. The `place` schema has an image field
that no code reads. Rule: every Studio field either has code that shows it, or
is removed from the Studio.

**7. Images.** The size of `public/images` is not measured and may exceed
Sanity plan limits. Photos are served as original files with no resizing. A
smaller first release is possible: move text and structure first and leave old
photos in `public/images`, because the queries already accept either source.
The cost is that the owner cannot replace old photos without a code change. If
`public/images` is later deleted, three hard-coded paths must be fixed first:
the home hero fallback, the Preparation photo, and the default share image in
`layout.tsx`. `metadataBase` is still `http://localhost:3000`, which breaks
share links in production.

**8. Drafts and Studio setup.** The site shows only published content, so a
saved draft shows nothing; the owner needs to be told this. Studio needs the
owner's account invited with an editor role, and the live domain, any Vercel
preview URL and localhost added as allowed origins in Sanity. Nothing in the
repo does this. Field help text, required fields, alt text, and naming rules for
slugs, order, chapters and places are missing.

**9. The map.** All reviewers agreed to keep the map as it is and change only
where the data comes from, since it already reads places. Studio makes these
risks visible to the owner: `/places` matches days to places by a two-way
substring test, so a place named "Rabat" or "Den" attaches the wrong days; the
map has fixed lat/lng bounds, so a place outside them falls off the canvas; and
a place without coordinates breaks the projection. Minimum: require
coordinates, check them against the map bounds, and document naming rules. A
proper fix (each diary entry references a place) is larger and can be deferred
if the risk is written down. The place count is 34 in the script's city table
and about 32 on the live map; the real number needs checking.

**10. Verification and rollback are not defined.** Suggested checks: day count
equals the number of entries in the source, 4 chapters, 8 practices, the checked
place count, 1 `siteSettings`, image assets equal files uploaded, no broken
references, every entry has a chapter, every image field has an asset, and a
before/after comparison of key pages. Take a dataset export before writing.
`export:dataset` in `package.json` points to a file that does not exist.
After cutover, Sanity is the source of truth and the Markdown in `../Content`
should be archived.

## Goals vs. Non-Goals

* **In-Scope Goals:**
  * Revoke the exposed token and make the scripts refuse to run without an
    environment token.
  * Fix the Studio schemas before migrating, so content is not migrated twice:
    one `siteSettings` document, a real way to order entries, required fields,
    alt text, and place coordinate checks.
  * One migration of the current live content (from `seedData.json`) into a
    test dataset, then production, keeping today's URLs.
  * A freshness mechanism, tested by publishing an edit and seeing it live.
  * Render the formatting the Studio allows (bold, italic, links, headings), or
    remove those options.
  * Remove the silent fallback and the seed file once the checks pass.
  * Short owner notes on slugs, order, chapters, places, and draft versus
    publish.
* **Out-of-Scope Non-Goals:**
  * A map redesign or a new map library.
  * A separate "blog post" type or route renames.
  * Draft preview, custom Studio branding, plugins.
  * Rewriting the getters to query per slug.
  * Improving the image-matching and practice-tagging rules used by the old
    scripts (accept the results; the owner fixes in Studio).
  * Moving existing photos into Sanity (decided: a later phase).
  * Posts outside the trip (decided: trip entries only).
  * Headings, lists and quotes in the editor (working assumption; the owner
    can ask for them, and then the site must render them).

## Alternatives Weighed

* **Keep the fallback permanently.** Rejected: it hides failures and brings
  back deleted content. Kept only during verification.
* **Remove the fallback right away.** Rejected: an incomplete migration or an
  outage would publish an empty site.
* **Use `upload-all-to-sanity.ts` as the migration.** Rejected as the default:
  it reads an outside folder, changes live URLs, and overwrites on re-run.
* **Use `import-content-to-sanity.ts` as is.** Rejected: it uploads no images
  and writes fake image references.
* **Webhook with instant refresh.** Not chosen by default: more code and a
  secret to manage for one editor; the timed refresh is cheaper.
* **Deploy hook from a Sanity webhook.** Possible if a one to two minute delay
  is acceptable and no new code is wanted.
* **Move photos in a second phase.** Valid smaller scope; depends on whether
  the owner needs to swap old photos in Studio.
* **A second "blog post" document type.** Rejected: it would double routes,
  queries and upkeep for no current need.
* **Map redesign (clusters, MapLibre or Leaflet).** Cut from this scope.
* **Make each diary entry reference a place.** The better data model, deferred
  because it changes the schema, the pages and the data.

## Key Decisions & Staging for Next Steps

Decisions made with the owner during ideation (all nine resolved):

1. **DECIDED: Studio edits must appear within seconds.** This rules out the
   timed refresh and the deploy hook. The mechanism is a Sanity webhook that
   calls a refresh endpoint in the site (secret-protected), which refreshes
   pages tagged by content type. Every getter in `client.ts` needs a tag, and
   the fetches behind the refresh must skip Sanity's CDN (`useCdn: false`),
   otherwise the CDN can return the old content. A new entry's page must also
   be created on first visit, not only at build time. The webhook secret lives
   in Vercel and Sanity, not in the repo.
2. **SUPERSEDED on 2026-11-10: the owner asked for photos to move too, and
   the migration is done.** `scripts/migrate-seed-to-sanity.ts` loaded 117
   documents and all 92 photos from `public/images` into `production`, with
   IDs and slugs unchanged; every image field now references a Sanity asset. A
   field-by-field comparison against `seedData.json` found no differences.
   The original decision is kept below for the record.
   *Original:* text first, photos later. The migration moves text and
   structure only. Existing photos stay in `public/images` and the site keeps
   serving them, because the queries already accept either a Sanity image or an
   old URL (`coalesce(asset->url, url)`). New entries use Studio uploads. Cost:
   the owner cannot replace an old photo without a code change until the photo
   phase. The migrated image fields must keep the old URL (not fake asset
   references), `public/images` and the three hard-coded paths stay as they
   are, and the size check against the Sanity plan moves to the photo phase.
3. **DECIDED: add a real date field.** Entries get a proper date (type `date`)
   and the site sorts by it, so a new entry lands in the right place without
   the owner typing an order number. Consequences to design: the current `date`
   is free text with no year ("March 23"; some entries read "Summer 2026" or
   "End of July"), so the migration must turn each into a full date (the trip
   runs March 21 to August 18, 2026) and the vague ones need a date chosen by
   the owner; same-day entries need a tie-break (keep `order` as an optional
   tie-break, or sort by date then title); `dayNumber` should be calculated or
   dropped so it cannot print "Dayundefined"; previous/next links and photo
   order follow the new sort; the display text on pages can still be formatted
   from the real date.
4. **DECIDED: featured checkbox.** Each diary entry gets a "Featured on home
   page" tick box (field on the `day` type) and the home page shows the ticked
   entries, replacing the hard-coded title keywords and fixed positions
   (`allDays[1]`, `[16]`, `[57]`, `[67]`). Details to settle in the draft: how
   many entries the home page shows (today it shows 4), the order of featured
   entries (by date), and what happens with zero or too many ticked (show none
   or the newest N). The migration ticks the four entries the home page picks
   today (Waterlooplein, Keukenhof, Chefchaouen, and Casa Rosada or Japanese
   Garden) so the home page looks the same after cutover.
5. **DECIDED: bold, italic and links must show on the site.** Fix
   `PortableStory.tsx` to render them (the unused `@portabletext/react`
   package is already installed and can do this; links need a safe `href`
   check and should open correctly). Working assumption, open to the owner:
   the Studio editor is limited to normal paragraphs, bold, italic and links,
   so headings, lists and quotes cannot be written. If the owner wants those,
   the site must render them too; every Studio option needs code that shows
   it. This work does not depend on the migration and can ship first.
6. **DECIDED: fail the build.** After the fallback is removed, a build stops
   with a clear error if a fetch fails or if days, chapters or site settings
   come back empty, so the previous working deployment stays live. Details for
   the draft: the error names the query that failed; the check applies to
   build time (page generation), while a refresh triggered by the webhook that
   fails keeps the last good page instead of replacing it; every getter logs
   which source served it until the fallback is gone.
7. **DECIDED: keep name matching.** `/places` keeps matching entries to places
   by name (one name contains the other); no schema change. Known risk, written
   down: a short or shared name (for example "Rabat", "Den") can attach unrelated
   entries or none. Safeguards in scope: place `coordinates` become required and
   are checked against the map bounds (latitude -38 to 58, longitude -85 to 20)
   so a pin cannot fall off the canvas; the owner notes include naming rules (an
   entry's location should contain the place name exactly as written on the
   place). Working assumption, open to the owner: the place image field is
   hidden in the Studio until the photo phase, since no page shows it. The
   entry-to-place reference stays a possible later improvement.
8. **DECIDED: trip entries only.** Every diary entry must belong to a chapter
   (the `chapter` reference stays required) and must have a date. No new page
   or listing for posts outside the trip. A new trip (or a new stage) is added
   as a new chapter document.
9. **DECIDED: About and Preparation text are editable in the Studio.** Both
   pages read their text from `siteSettings` (`aboutText`, `preparationText`)
   instead of inline code, with the same formatting rules as diary entries
   (paragraphs, bold, italic, links), so those two fields become rich text.
   The migration copies the current page text into them so the pages look the
   same after cutover. `siteSettings` becomes a single fixed document in the
   Studio so a second copy cannot be created.

Technical checks for the draft (no owner decision needed): confirm whether the
`production` dataset is public (the site reads without a token) and set the
client to read published content only; invite the owner with an editor role;
add the live domain, Vercel preview URLs and localhost as allowed origins in
Sanity; set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`
in Vercel instead of relying on the code defaults; fix `metadataBase`.

Proposed order of work:

0. Revoke the token, remove the literal, make scripts fail without the env
   token, add dry-run and confirm flags.
1. Schema and Studio changes (singleton settings, order or date, required
   fields, alt text, place checks, rename the Studio label to "Diary Entry").
2. One migration into a test dataset, with the count checks and a page
   comparison; the live site is unchanged because the fallback is still on.
3. One-time production migration; stop using `../Content`.
4. Rich text rendering (can ship earlier).
5. Freshness mechanism, tested with a real edit.
6. Remove the fallback and `seedData.json` and update the `CLAUDE.md`
   contracts for each directory touched.
7. Optional: place images and entry-to-place links.
