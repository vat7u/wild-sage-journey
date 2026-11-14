/**
 * One-off content patch that moves the last hard-coded content into Sanity and
 * fills the new fields added to the schemas on 2026-11-14.
 *
 *   npx tsx scripts/patch-content-model.ts                      # dry run, writes nothing
 *   npx tsx scripts/patch-content-model.ts --confirm            # apply
 *   npx tsx scripts/patch-content-model.ts --cleanup --confirm  # afterwards: remove the legacy
 *                                                                # `date` text and `dayNumber`
 *
 * Every write uses setIfMissing, so re-running never overwrites a value the
 * owner has already edited in the Studio. Run --cleanup only once the site
 * version that reads `entryDate` is deployed (older versions read `date`).
 */
import fs from "fs";
import path from "path";
import { createClient } from "@sanity/client";

const ROOT = process.cwd();
const CONFIRM = process.argv.includes("--confirm");
const YEAR = 2026;

function loadEnvLocal() {
  const file = path.join(ROOT, ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf-8").split(/\r?\n/)) {
    const i = line.indexOf("=");
    if (i < 1 || line.trim().startsWith("#")) continue;
    const key = line.slice(0, i).trim();
    if (!(key in process.env)) process.env[key] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
}

// ---- Content that was typed into the page code until now (copied verbatim) ----

/** src/app/about/page.tsx */
const ABOUT_PARAGRAPHS = [
  "I was born in Pennsylvania and lived there until I was 8 years old. I lived near my grandparents and lots of cousins. My fondest memories are times with family. At age 8 my family moved to New York. Every year we would go back to PA for Christmas and the whole family would gather in my grandparents tiny house. The rest of the week we would travel around to other Aunt and Uncles celebrating all week. To this day Christmas is my favorite time of year.",
  "I have had many careers from working in medical manufacturing, school aide and librarian to health and wellness retail. I am a lifelong learner which inspired me to go back to school and graduate with a B.S. in Alternative Medicine. During that time I decided I wanted to pursue wellness coaching.",
  "While working on that career change I am taking a journey and pursuing certification as a wellness coach. This site will follow that journey.",
];

/** src/app/preparation/page.tsx */
const PREPARATION_PARAGRAPHS = [
  "To go on this trip I tried to think of all the things that I needed, what I was most afraid could happen and how to make things easier.",
  "Luggage (suitcase, carry on that is also a backpack), crossbody bag and RFid pouch around my neck to hold credit cards and passport, clothes for the right weather, journal, shoes that were weather appropriate.",
  "Places to stay, plane tickets making sure that when I landed the time was in enough daylight to find the place I'm staying, directions to the airbnb so I don't look like a tourist.",
  "Packing clothes for 5 months with layers since it will be 50's in the Netherlands, 90's in Morocco and back to 50's in Argentina. Started looking for ways to save money. In the Netherlands you can purchase a pass that is good for a year and for one price you can get into over 500 museums. You can also purchase a month long pass to ride all trains, metro and buses in Amsterdam for one price. For a short time period you can get a City Card for 7 days of attractions and transportation.",
];

/** src/app/page.tsx, "From the Memoir" quote */
const HOME_QUOTE =
  "I am a lifelong learner which inspired me to go back to school and graduate with a B.S. in Alternative Medicine. During that time I decided I wanted to pursue wellness coaching. While working on that career change I am taking a journey and pursuing certification as a wellness coach. This site will follow that journey.";

/** src/components/layout/Footer.tsx */
const FOOTER_TEXT =
  "A personal travel memoir recorded chronologically across seventy days through original writing, photographs, and mindful contemplation.";
const FOOTER_QUOTE = "Every cup has a story.";

const PREPARATION_IMAGE_FILE = "Preparation for this trip!.jpg";

/** The four entries the home page picked by title keyword until now (by legacy order). */
const FEATURED_ORDERS = [2, 17, 58, 68];

/**
 * Entries whose legacy date text is not a calendar date. Chosen so the
 * chronological order of the site does not change.
 */
const DATE_OVERRIDES: Record<number, string> = {
  66: "2026-07-28", // "End of July" — between July 20 (65) and July 30 (67); owner to confirm
};

const MONTHS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

function parseMonthDay(text: string | undefined): string | null {
  const m = (text || "").trim().match(/^([A-Za-z]+)\s+(\d{1,2})(?:,\s*(\d{4}))?$/);
  if (!m || !MONTHS[m[1].toLowerCase()]) return null;
  const y = m[3] ? Number(m[3]) : YEAR;
  return `${y}-${String(MONTHS[m[1].toLowerCase()]).padStart(2, "0")}-${m[2].padStart(2, "0")}`;
}

function blocks(paragraphs: string[], prefix: string) {
  return paragraphs.map((text, i) => ({
    _type: "block",
    _key: `${prefix}${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${prefix}${i}s`, text, marks: [] }],
  }));
}

async function main() {
  loadEnvLocal();
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_TOKEN;
  if (!projectId || !dataset) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET must be set.");
  if (CONFIRM && !token) throw new Error("SANITY_API_TOKEN is not set (.env.local). A write token is required with --confirm.");

  const client = createClient({ projectId, dataset, token, apiVersion: "2024-03-01", useCdn: false });
  console.log(`Target: project=${projectId} dataset=${dataset} mode=${CONFIRM ? "WRITE" : "dry run"}`);

  if (process.argv.includes("--cleanup")) {
    const legacy: { _id: string; entryDate?: string }[] = await client.fetch(
      `*[_type == "day" && (defined(date) || defined(dayNumber))]{_id, entryDate}`
    );
    const undated = legacy.filter((d) => !d.entryDate);
    if (undated.length) throw new Error(`${undated.length} entries have no entryDate yet; run the main patch first.`);
    console.log(`Entries with legacy date/dayNumber: ${legacy.length}`);
    if (!CONFIRM) return console.log("Dry run only. Re-run with --cleanup --confirm to remove them.");
    const cleanupTx = client.transaction();
    for (const d of legacy) cleanupTx.patch(d._id, (p) => p.unset(["date", "dayNumber"]));
    if (legacy.length) await cleanupTx.commit();
    return console.log(`Removed legacy fields from ${legacy.length} entries.`);
  }

  // ---- Days: entryDate + featured ----
  const days: { _id: string; title: string; date?: string; order?: number; entryDate?: string; featured?: boolean }[] =
    await client.fetch(`*[_type == "day" && !(_id in path("drafts.**"))] | order(order asc){_id, title, date, order, entryDate, featured}`);

  const tx = client.transaction();
  const problems: string[] = [];
  let dated = 0;
  let featured = 0;

  for (const d of days) {
    const entryDate =
      (d.order !== undefined && DATE_OVERRIDES[d.order]) || parseMonthDay(d.date) || parseMonthDay(d.title);
    if (!entryDate) {
      problems.push(`No date for "${d.title}" (${d._id}, legacy date "${d.date}")`);
      continue;
    }
    const isFeatured = d.order !== undefined && FEATURED_ORDERS.includes(d.order);
    if (isFeatured) featured++;
    dated++;
    tx.patch(d._id, (p) => p.setIfMissing({ entryDate, featured: isFeatured }));
  }

  // The resulting date order must match the current reading order
  const sorted = days
    .map((d) => ({ ...d, entryDate: (d.order !== undefined && DATE_OVERRIDES[d.order]) || parseMonthDay(d.date) || parseMonthDay(d.title) || "" }))
    .filter((d) => d.entryDate);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].entryDate < sorted[i - 1].entryDate) {
      problems.push(`Date order differs from reading order at "${sorted[i].title}" (${sorted[i].entryDate} < ${sorted[i - 1].entryDate})`);
    }
  }

  // ---- Site settings ----
  const settingsId = "siteSettings";
  const settings = await client.fetch(`*[_id == $id][0]{_id, aboutText, preparationText}`, { id: settingsId });
  if (!settings) problems.push(`Document ${settingsId} not found`);

  const prepAsset: string | null = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $f][0]._id`,
    { f: PREPARATION_IMAGE_FILE }
  );
  if (!prepAsset) problems.push(`Image asset "${PREPARATION_IMAGE_FILE}" not found in Sanity`);

  // aboutText / preparationText were plain strings: replace them only while they are still strings
  const settingsPatch: Record<string, unknown> = {};
  if (settings && !Array.isArray(settings.aboutText)) settingsPatch.aboutText = blocks(ABOUT_PARAGRAPHS, "about");
  if (settings && !Array.isArray(settings.preparationText)) settingsPatch.preparationText = blocks(PREPARATION_PARAGRAPHS, "prep");

  if (settings) {
    tx.patch(settingsId, (p) => {
      let patch = p.setIfMissing({
        footerText: FOOTER_TEXT,
        footerQuote: FOOTER_QUOTE,
        ...(prepAsset
          ? {
              preparationImage: {
                _type: "image",
                asset: { _type: "reference", _ref: prepAsset },
                alt: "Preparation for this trip - packing and travel gear",
              },
            }
          : {}),
      });
      if (Object.keys(settingsPatch).length) patch = patch.set(settingsPatch);
      // The quote used to be a copy of the full About text; replace it only if it still is
      return patch;
    });
    const intro: string | null = await client.fetch(`*[_id == $id][0].introduction`, { id: settingsId });
    if (!intro || intro.replace(/\s+/g, " ").startsWith("I was born in Pennsylvania")) {
      tx.patch(settingsId, (p) => p.set({ introduction: HOME_QUOTE }));
      console.log("introduction: will be set to the home page quote");
    }
  }

  console.log(`Days: ${days.length} found, ${dated} dated, ${featured} featured`);
  console.log(`Site settings: rich text fields converted: ${Object.keys(settingsPatch).join(", ") || "none (already converted)"}`);
  console.log(`Preparation image asset: ${prepAsset ?? "MISSING"}`);

  if (problems.length) {
    console.error("Problems:\n  " + problems.join("\n  "));
    throw new Error("Stopping because of the problems above. Nothing was written.");
  }

  if (!CONFIRM) {
    console.log("Dry run only. Nothing was written. Re-run with --confirm to apply.");
    return;
  }

  await tx.commit();
  const check = await client.fetch(`{
    "days": count(*[_type == "day"]),
    "withDate": count(*[_type == "day" && defined(entryDate)]),
    "featured": count(*[_type == "day" && featured == true]),
    "settings": *[_id == "siteSettings"][0]{"about": count(aboutText), "prep": count(preparationText), "prepImage": defined(preparationImage.asset), footerQuote, "intro": introduction}
  }`);
  console.log("Sanity now contains:", JSON.stringify(check, null, 2));
}

main().catch((err) => {
  console.error("Patch failed:", err.message || err);
  process.exit(1);
});
