/**
 * One-shot migration: pushes the content the live site shows today
 * (src/lib/content/seedData.json + public/images) into Sanity.
 *
 *   npx tsx scripts/migrate-seed-to-sanity.ts            # dry run, writes nothing
 *   npx tsx scripts/migrate-seed-to-sanity.ts --confirm  # upload images + documents
 *
 * Document IDs and slugs are taken from seedData.json unchanged, so every
 * existing URL keeps working. The script refuses to write if the dataset
 * already holds content documents (pass --force to overwrite them).
 */
import fs from "fs";
import path from "path";
import { createClient } from "@sanity/client";

const ROOT = process.cwd();
const SEED_PATH = path.join(ROOT, "src/lib/content/seedData.json");
const IMAGES_DIR = path.join(ROOT, "public/images");
const CONTENT_TYPES = ["day", "chapter", "practice", "place", "siteSettings"];

const CONFIRM = process.argv.includes("--confirm");
const FORCE = process.argv.includes("--force");

function loadEnvLocal() {
  const file = path.join(ROOT, ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf-8").split(/\r?\n/)) {
    const i = line.indexOf("=");
    if (i < 1 || line.trim().startsWith("#")) continue;
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

type AnyDoc = Record<string, any>;

function filenameFromUrl(url: string): string {
  return decodeURIComponent(url.replace(/^\/images\//, ""));
}

async function main() {
  loadEnvLocal();
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_TOKEN;
  if (!projectId || !dataset) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET must be set.");

  const seed = JSON.parse(fs.readFileSync(SEED_PATH, "utf-8"));
  const imageFiles = fs.readdirSync(IMAGES_DIR).filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f));

  console.log(`Target: project=${projectId} dataset=${dataset} mode=${CONFIRM ? "WRITE" : "dry run"}`);
  console.log(`Seed: ${seed.days.length} days, ${seed.chapters.length} chapters, ${seed.practices.length} practices, ${seed.places.length} places, 1 siteSettings`);
  console.log(`Images in public/images: ${imageFiles.length}`);

  // ---- 1. asset map: filename -> Sanity asset id ----
  const assetMap: Record<string, string> = {};
  let client: ReturnType<typeof createClient> | null = null;

  if (CONFIRM) {
    if (!token) throw new Error("SANITY_API_TOKEN is not set (.env.local). A write token is required with --confirm.");
    client = createClient({ projectId, dataset, token, apiVersion: "2024-03-01", useCdn: false });

    const existing: number = await client.fetch(`count(*[_type in $types])`, { types: CONTENT_TYPES });
    if (existing > 0 && !FORCE) {
      throw new Error(`Dataset already has ${existing} content documents. Refusing to overwrite. Use --force only if you accept losing Studio edits.`);
    }

    const already: { _id: string; originalFilename?: string }[] = await client.fetch(
      `*[_type == "sanity.imageAsset"]{_id, originalFilename}`
    );
    for (const a of already) if (a.originalFilename) assetMap[a.originalFilename] = a._id;
    console.log(`Assets already in Sanity: ${Object.keys(assetMap).length}`);

    let n = 0;
    for (const filename of imageFiles) {
      if (assetMap[filename]) continue;
      let lastErr: unknown;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const res = await client.assets.upload("image", fs.createReadStream(path.join(IMAGES_DIR, filename)), { filename });
          assetMap[filename] = res._id;
          lastErr = undefined;
          break;
        } catch (e) {
          lastErr = e;
          await new Promise((r) => setTimeout(r, 1500 * attempt));
        }
      }
      if (lastErr) throw new Error(`Upload failed for "${filename}": ${String(lastErr)}`);
      n++;
      console.log(`  uploaded ${n}: ${filename}`);
    }
    console.log(`Uploaded ${n} new images.`);
  } else {
    for (const f of imageFiles) assetMap[f] = `image-DRYRUN-${f}`;
  }

  const missing = new Set<string>();
  function imageRef(url: string | undefined) {
    if (!url) return undefined;
    const filename = filenameFromUrl(url);
    const id = assetMap[filename];
    if (!id) {
      missing.add(filename);
      return undefined;
    }
    return { _type: "reference", _ref: id };
  }
  function image(url: string | undefined, extra: AnyDoc = {}) {
    const asset = imageRef(url);
    if (!asset) return undefined;
    const out: AnyDoc = { _type: "image", asset };
    for (const [k, v] of Object.entries(extra)) if (v !== undefined && v !== "") out[k] = v;
    return out;
  }
  const clean = (doc: AnyDoc) => Object.fromEntries(Object.entries(doc).filter(([, v]) => v !== undefined));

  // ---- 2. transform documents to match the Studio schema ----
  const { heroImageUrl, ...settingsRest } = seed.siteSettings;
  const siteSettings = clean({ ...settingsRest, heroImage: image(heroImageUrl) });

  const chapters = seed.chapters.map((c: AnyDoc) => {
    const { imageUrl, ...rest } = c;
    return clean({ ...rest, coverImage: image(imageUrl, { alt: c.title }) });
  });

  const practices = seed.practices.map((p: AnyDoc) => {
    const { imageUrl, ...rest } = p;
    return clean({ ...rest, image: image(imageUrl, { alt: p.title }) });
  });

  const places = seed.places.map((p: AnyDoc) => clean({ ...p }));

  const days = seed.days.map((d: AnyDoc) => {
    const { chapterSlug, practiceSlugs, coverImageUrl, coverImageCaption, story, gallery, practices: refs, ...rest } = d;
    return clean({
      ...rest,
      coverImage: image(coverImageUrl, { caption: coverImageCaption, alt: coverImageCaption || d.title }),
      story: (story || []).map((b: AnyDoc, i: number) => {
        if (b._type !== "image") return b;
        return (
          image(b.url, { _key: b._key || `img-${i}`, caption: b.caption, alt: b.alt, layout: b.layout }) ||
          // keep the legacy URL if the file is missing so nothing disappears
          b
        );
      }),
      gallery: (gallery || [])
        .map((g: AnyDoc, i: number) => image(g.url, { _key: `gal-${i}`, caption: g.caption, altText: g.altText || g.caption }))
        .filter(Boolean),
      practices: (refs || []).map((r: AnyDoc, i: number) => ({ ...r, _key: `pr-${i}` })),
    });
  });

  if (missing.size > 0) {
    throw new Error(`Images referenced by the seed but not found in public/images: ${[...missing].join(", ")}`);
  }

  const allDocs: AnyDoc[] = [siteSettings, ...chapters, ...practices, ...places, ...days];

  // ---- 3. checks ----
  const ids = new Set(allDocs.map((d) => d._id));
  if (ids.size !== allDocs.length) throw new Error("Duplicate document IDs in seed data.");
  for (const d of days) {
    if (!ids.has(d.chapter?._ref)) throw new Error(`Day ${d._id} references a missing chapter.`);
    for (const r of d.practices) if (!ids.has(r._ref)) throw new Error(`Day ${d._id} references a missing practice ${r._ref}.`);
  }
  const used = new Set<string>();
  JSON.stringify(allDocs, (_k, v) => {
    if (v && v._type === "reference" && typeof v._ref === "string" && v._ref.startsWith("image-")) used.add(v._ref);
    return v;
  });
  const inline = days.reduce((n: number, d: AnyDoc) => n + d.story.filter((b: AnyDoc) => b._type === "image").length, 0);
  const gal = days.reduce((n: number, d: AnyDoc) => n + d.gallery.length, 0);
  console.log(`Prepared ${allDocs.length} documents; ${used.size} distinct images referenced (${inline} inline, ${gal} gallery).`);

  if (!CONFIRM) {
    const out = path.join(ROOT, "sanity-migration-dryrun.json");
    fs.writeFileSync(out, JSON.stringify(allDocs, null, 2));
    console.log(`Dry run only. Nothing was written to Sanity. Preview saved to ${out}`);
    return;
  }

  // ---- 4. write (referenced docs first) ----
  const chunkSize = 20;
  for (let i = 0; i < allDocs.length; i += chunkSize) {
    const tx = client!.transaction();
    for (const doc of allDocs.slice(i, i + chunkSize)) tx.createOrReplace(doc as any);
    await tx.commit();
    console.log(`  committed documents ${i + 1}-${Math.min(i + chunkSize, allDocs.length)} of ${allDocs.length}`);
  }

  // ---- 5. verify ----
  const counts = await client!.fetch(
    `{"day":count(*[_type=="day"]),"chapter":count(*[_type=="chapter"]),"practice":count(*[_type=="practice"]),"place":count(*[_type=="place"]),"siteSettings":count(*[_type=="siteSettings"]),"imageAssets":count(*[_type=="sanity.imageAsset"]),
      "daysWithoutChapter":count(*[_type=="day" && !defined(chapter->_id)]),
      "brokenStoryImages":count(*[_type=="day" && count(story[_type=="image" && !defined(asset->url)])>0])}`
  );
  console.log("Sanity now contains:", counts);
}

main().catch((err) => {
  console.error("Migration failed:", err.message || err);
  process.exit(1);
});
