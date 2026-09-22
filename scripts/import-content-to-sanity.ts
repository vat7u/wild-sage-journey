import fs from "fs";
import path from "path";
import { createClient } from "@sanity/client";

// Source paths
const CONTENT_DIR = path.resolve(process.cwd(), "../Content");
const IMAGES_DIR = path.resolve(process.cwd(), "public/images");

interface StoryEntry {
  title: string;
  dateStr: string;
  dayNumber: number;
  location: string;
  country: string;
  chapterSlug: string;
  text: string;
  images: { filename: string; caption: string }[];
  coordinates?: { lat: number; lng: number };
  practiceSlugs: string[];
}

const CITY_COORDINATES: Record<string, { lat: number; lng: number; country: string }> = {
  Amsterdam: { lat: 52.3676, lng: 4.9041, country: "The Netherlands" },
  Utrecht: { lat: 52.0907, lng: 5.1214, country: "The Netherlands" },
  Delft: { lat: 52.0116, lng: 4.3571, country: "The Netherlands" },
  Muiden: { lat: 52.3304, lng: 5.0664, country: "The Netherlands" },
  Leiden: { lat: 52.1601, lng: 4.497, country: "The Netherlands" },
  Leeuwarden: { lat: 53.2012, lng: 5.7999, country: "The Netherlands" },
  Naarden: { lat: 52.2958, lng: 5.1611, country: "The Netherlands" },
  Alkmaar: { lat: 52.6324, lng: 4.7534, country: "The Netherlands" },
  Haarlem: { lat: 52.3874, lng: 4.6462, country: "The Netherlands" },
  Keukenhof: { lat: 52.2697, lng: 4.5469, country: "The Netherlands" },
  Bruges: { lat: 51.2093, lng: 3.2247, country: "Belgium" },
  Ghent: { lat: 51.0543, lng: 3.7174, country: "Belgium" },
  Brussels: { lat: 50.8503, lng: 4.3517, country: "Belgium" },
  Amersfoort: { lat: 52.1561, lng: 5.3878, country: "The Netherlands" },
  Gouda: { lat: 52.0116, lng: 4.7105, country: "The Netherlands" },
  Hoorn: { lat: 52.6425, lng: 5.0597, country: "The Netherlands" },
  Almere: { lat: 52.3508, lng: 5.2647, country: "The Netherlands" },
  Weesp: { lat: 52.3072, lng: 5.0422, country: "The Netherlands" },
  Rotterdam: { lat: 51.9244, lng: 4.4777, country: "The Netherlands" },
  Giethoorn: { lat: 52.7404, lng: 6.0792, country: "The Netherlands" },
  Zaandam: { lat: 52.442, lng: 4.8292, country: "The Netherlands" },
  Antwerp: { lat: 51.2194, lng: 4.4025, country: "Belgium" },
  "Den Haag": { lat: 52.0705, lng: 4.3007, country: "The Netherlands" },
  Enkhuizen: { lat: 52.7042, lng: 5.2917, country: "The Netherlands" },
  Zwolle: { lat: 52.5168, lng: 6.083, country: "The Netherlands" },
  Casablanca: { lat: 33.5731, lng: -7.5898, country: "Morocco" },
  Rabat: { lat: 34.0209, lng: -6.8416, country: "Morocco" },
  "El Jadida": { lat: 33.2316, lng: -8.5007, country: "Morocco" },
  Marrakech: { lat: 31.6295, lng: -7.9811, country: "Morocco" },
  Tangier: { lat: 35.7595, lng: -5.834, country: "Morocco" },
  Chefchaouen: { lat: 35.1688, lng: -5.2684, country: "Morocco" },
  Orlando: { lat: 28.5383, lng: -81.3792, country: "United States" },
  "Buenos Aires": { lat: -34.6037, lng: -58.3816, country: "Argentina" },
  Iguazu: { lat: -25.6953, lng: -54.4367, country: "Argentina" },
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseStoryHeading(heading: string): { dateStr: string; title: string; location: string } {
  const raw = heading.replace(/^##\s*/, "").trim();
  const matchDash = raw.match(/^(.+?)\s*[—–-]\s*(.+)$/);

  if (matchDash) {
    const p1 = matchDash[1].trim();
    const p2 = matchDash[2].trim();
    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const isP1Date = months.some((m) => p1.toLowerCase().includes(m));

    if (isP1Date) {
      let loc = extractLocation(p2);
      return { dateStr: p1, title: p2, location: loc };
    }
  }

  return { dateStr: "", title: raw, location: extractLocation(raw) };
}

function extractLocation(text: string): string {
  for (const city of Object.keys(CITY_COORDINATES)) {
    if (new RegExp(`\\b${city}\\b`, "i").test(text)) {
      return city;
    }
  }
  if (/amsterdam/i.test(text)) return "Amsterdam";
  if (/utrecht/i.test(text)) return "Utrecht";
  if (/delft/i.test(text)) return "Delft";
  if (/casablanca/i.test(text)) return "Casablanca";
  if (/rabat/i.test(text)) return "Rabat";
  if (/chefchaouen/i.test(text)) return "Chefchaouen";
  if (/buenos aires/i.test(text)) return "Buenos Aires";
  return "";
}

function determineCountryAndChapter(dateStr: string, location: string, text: string, index: number): { country: string; chapterSlug: string } {
  const d = dateStr.toLowerCase();
  const t = text.toLowerCase();
  const loc = location.toLowerCase();

  if (d.includes("august") || loc.includes("buenos aires") || t.includes("buenos aires") || t.includes("argentina")) {
    return { country: "Argentina", chapterSlug: "argentina" };
  }
  if (d.includes("july 30") || t.includes("orlando") || t.includes("spider-man")) {
    return { country: "United States", chapterSlug: "orlando-interlude" };
  }
  if (d.includes("june") || d.includes("july") || loc.includes("casablanca") || loc.includes("chefchaouen") || loc.includes("rabat") || t.includes("morocco")) {
    return { country: "Morocco", chapterSlug: "morocco" };
  }
  if (loc.includes("bruges") || loc.includes("ghent") || loc.includes("brussels") || loc.includes("antwerp") || t.includes("belgium")) {
    return { country: "Belgium", chapterSlug: "netherlands-belgium" };
  }
  return { country: "The Netherlands", chapterSlug: "netherlands-belgium" };
}

function mapImagesToStory(title: string, dateStr: string, text: string, allImages: string[]): { filename: string; caption: string }[] {
  const matched: { filename: string; caption: string }[] = [];
  const normalizedTitle = title.toLowerCase();
  const normalizedDate = dateStr.toLowerCase();
  const normalizedText = text.toLowerCase();

  for (const img of allImages) {
    if (img.startsWith("The 8 Practices") || img === "Morocco.jpg" || img === "Netherland.jpg" || img === "Argentina.jpg" || img === "Preparation for this trip!.jpg") {
      continue;
    }

    const imgBase = img.replace(/\.[^/.]+$/, "");
    const imgLower = imgBase.toLowerCase();

    // Check date matches
    let dateMatch = false;
    const dateTokens = normalizedDate.match(/([a-z]+)\s+(\d+)/);
    if (dateTokens) {
      const month = dateTokens[1];
      const day = dateTokens[2];
      const regex1 = new RegExp(`\\b${month}\\s+0?${day}\\b`, "i");
      const regex2 = new RegExp(`\\b0?${day}th?\\b.*\\b${month}\\b`, "i");
      const regex3 = new RegExp(`\\b${month}${day}\\b`, "i");
      if (regex1.test(imgLower) || regex2.test(imgLower) || regex3.test(imgLower)) {
        dateMatch = true;
      }
      if (month === "april" && day === "18" && imgLower.includes("pril 18")) {
        dateMatch = true;
      }
      if (month === "august" && day === "7" && imgLower.includes("augaust 7")) {
        dateMatch = true;
      }
    }

    // Check title/content keyword match
    let keywordMatch = false;
    const keywords = imgLower.split(/[-_\s.]+/).filter((w) => w.length > 3 && !["march", "april", "june", "july", "august", "scaled"].includes(w));
    const matchCount = keywords.filter((k) => normalizedTitle.includes(k) || normalizedText.includes(k)).length;
    if (matchCount >= 2 || (keywords.length === 1 && matchCount === 1 && dateMatch)) {
      keywordMatch = true;
    }

    // Specific famous image mappings
    if (img === "Mannekin Pis.jpg" && normalizedTitle.includes("brussels")) keywordMatch = true;
    if (img === "Stroopwafels.jpg" && (normalizedTitle.includes("april 2") || normalizedText.includes("stroopwafel"))) keywordMatch = true;

    if (dateMatch || (keywordMatch && matchCount >= 2)) {
      matched.push({
        filename: img,
        caption: imgBase.replace(/^\w+\s+\d+\s*[-—]?\s*/, "").replace(/[-_]/g, " "),
      });
    }
  }

  return matched;
}

function detectPractices(text: string, title: string): string[] {
  const combined = (title + " " + text).toLowerCase();
  const practices: string[] = [];

  if (combined.includes("friend") || combined.includes("roommate") || combined.includes("noah") || combined.includes("sara") || combined.includes("anika") || combined.includes("world cup") || combined.includes("people") || combined.includes("group") || combined.includes("offline club") || combined.includes("tour guide")) {
    practices.push("social-connections");
  }
  if (combined.includes("miles") || combined.includes("walked") || combined.includes("steps") || combined.includes("climbed") || combined.includes("bike") || combined.includes("biking") || combined.includes("hike") || combined.includes("hiking")) {
    practices.push("exercise");
  }
  if (combined.includes("cappuccino") || combined.includes("waffle") || combined.includes("chocolate") || combined.includes("couscous") || combined.includes("stroopwafel") || combined.includes("pancakes") || combined.includes("tea") || combined.includes("lunch") || combined.includes("delicious") || combined.includes("quiche")) {
    practices.push("savor-every-moment");
  }
  if (combined.includes("amazing") || combined.includes("gorgeous") || combined.includes("beautiful") || combined.includes("blessed") || combined.includes("grateful") || combined.includes("fondest") || combined.includes("magical") || combined.includes("glad")) {
    practices.push("gratitude");
  }
  if (combined.includes("cat") || combined.includes("kind") || combined.includes("helped") || combined.includes("sweet") || combined.includes("caring") || combined.includes("share")) {
    practices.push("kindness");
  }
  if (combined.includes("garden") || combined.includes("quiet") || combined.includes("church") || combined.includes("mosque") || combined.includes("peaceful") || combined.includes("meditation") || combined.includes("cathedral") || combined.includes("contemplat")) {
    practices.push("meditation");
  }
  if (combined.includes("museum") || combined.includes("history") || combined.includes("science") || combined.includes("learned") || combined.includes("curious") || combined.includes("explore") || combined.includes("spanish") || combined.includes("books")) {
    practices.push("use-my-signature-strengths");
  }
  if (combined.includes("sleep") || combined.includes("rest") || combined.includes("exhausted") || combined.includes("tired") || combined.includes("settled")) {
    practices.push("sleep");
  }

  return Array.from(new Set(practices));
}

function buildPortableText(text: string, images: { filename: string; caption: string }[]) {
  const paragraphs = text
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const blocks: any[] = [];
  let imageIdx = 0;

  paragraphs.forEach((para, pIdx) => {
    // Add text paragraph
    blocks.push({
      _type: "block",
      _key: `p-${pIdx}`,
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `s-${pIdx}`,
          text: para,
          marks: [],
        },
      ],
    });

    // Intersperse images between paragraphs
    if (imageIdx < images.length && (pIdx === 0 || pIdx === Math.floor(paragraphs.length / 2))) {
      const img = images[imageIdx];
      blocks.push({
        _type: "image",
        _key: `img-${imageIdx}`,
        asset: {
          _type: "reference",
          _ref: `image-${slugify(img.filename)}`,
        },
        url: `/images/${encodeURIComponent(img.filename)}`,
        filename: img.filename,
        caption: img.caption,
        alt: img.caption,
        layout: imageIdx === 0 ? "full" : "standard",
      });
      imageIdx++;
    }
  });

  // Any remaining images
  while (imageIdx < images.length) {
    const img = images[imageIdx];
    blocks.push({
      _type: "image",
      _key: `img-${imageIdx}`,
      asset: {
        _type: "reference",
        _ref: `image-${slugify(img.filename)}`,
      },
      url: `/images/${encodeURIComponent(img.filename)}`,
      filename: img.filename,
      caption: img.caption,
      alt: img.caption,
      layout: "standard",
    });
    imageIdx++;
  }

  return blocks;
}

async function run() {
  console.log("=== THE JOURNEY — CONTENT MIGRATION TO SANITY ===");

  if (!fs.existsSync(CONTENT_DIR)) {
    throw new Error(`Content directory not found at ${CONTENT_DIR}`);
  }

  const allImages = fs.readdirSync(IMAGES_DIR);
  console.log(`Found ${allImages.length} images in ${IMAGES_DIR}`);

  // 1. Read source files
  const aboutText = fs.readFileSync(path.join(CONTENT_DIR, "About.md"), "utf-8").replace(/^#\s+.*\r?\n\r?\n?/, "").trim();
  const prepText = fs.readFileSync(path.join(CONTENT_DIR, "Preparation.md"), "utf-8").replace(/^#\s+.*\r?\n\r?\n?/, "").trim();
  const practicesRaw = fs.readFileSync(path.join(CONTENT_DIR, "The 8 Practices.md"), "utf-8");
  const storylineRaw = fs.readFileSync(path.join(CONTENT_DIR, "Storyline.md"), "utf-8");

  // 2. Build Practice documents
  const practiceLines = practicesRaw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const practiceDocs = practiceLines.map((title, idx) => {
    const slug = slugify(title);
    const imgFile = allImages.find((img) => img.toLowerCase().startsWith(`the 8 practices-${title.toLowerCase()}`) || img.toLowerCase().includes(title.toLowerCase()));

    return {
      _id: `practice-${slug}`,
      _type: "practice",
      title,
      slug: { _type: "slug", current: slug },
      order: idx + 1,
      imageUrl: imgFile ? `/images/${encodeURIComponent(imgFile)}` : undefined,
      description: `Exploring '${title}' as a grounding practice throughout the five-month journey.`,
    };
  });

  // 3. Build Chapter & Interlude documents
  const chapterDocs = [
    {
      _id: "chapter-netherlands-belgium",
      _type: "chapter",
      title: "Chapter 01 — The Netherlands & Belgium",
      slug: { _type: "slug", current: "netherlands-belgium" },
      type: "chapter",
      country: "The Netherlands & Belgium",
      subtitle: "Canals, Windmills, Great Museums, and Spring Awakening",
      dateRange: "March 21 – May 30, 2026",
      startDate: "2026-03-21",
      endDate: "2026-05-30",
      imageUrl: "/images/Netherland.jpg",
      description:
        "Arriving in Amsterdam in early spring: walking the historic canals, venturing through Delft, Utrecht, and Leiden, climbing the Domtoren, experiencing King's Day, and exploring the medieval squares and cathedrals of Bruges, Ghent, and Brussels.",
      order: 1,
    },
    {
      _id: "chapter-morocco",
      _type: "chapter",
      title: "Chapter 02 — Morocco",
      slug: { _type: "slug", current: "morocco" },
      type: "chapter",
      country: "Morocco",
      subtitle: "Atlantic Breezes, Medinas, Mountain Vistas, and the Blue Pearl",
      dateRange: "June 4 – July 20, 2026",
      startDate: "2026-06-04",
      endDate: "2026-07-20",
      imageUrl: "/images/Morocco.jpg",
      description:
        "From the bustling medinas and ancient ports of Casablanca and El Jadida to the exotic gardens of Rabat, the sensory maze of Marrakech, seaside Tangier, and the serene blue alleyways and mountain falls of Chefchaouen.",
      order: 2,
    },
    {
      _id: "interlude-orlando",
      _type: "chapter",
      title: "Interlude — Orlando, Florida",
      slug: { _type: "slug", current: "orlando-interlude" },
      type: "interlude",
      country: "United States",
      subtitle: "A Whirlwind Transition Between Continents",
      dateRange: "July 30 – August 3, 2026",
      startDate: "2026-07-30",
      endDate: "2026-08-03",
      imageUrl: "/images/pexels-photo-31719382-31719382-scaled.jpg",
      description:
        "A brief, loving pause between North Africa and South America: arriving in Florida to help Anika move and celebrate her college graduation before packing for the southern hemisphere.",
      order: 3,
    },
    {
      _id: "chapter-argentina",
      _type: "chapter",
      title: "Chapter 03 — Argentina",
      slug: { _type: "slug", current: "argentina" },
      type: "chapter",
      country: "Argentina",
      subtitle: "Winter in Buenos Aires, Historic Avenidas, and Natural Wonders",
      dateRange: "August 6 – August 18, 2026",
      startDate: "2026-08-06",
      endDate: "2026-08-18",
      imageUrl: "/images/Argentina.jpg",
      description:
        "Stepping into the southern winter: Japanese Gardens, historic squares of Buenos Aires, Eva Perón's legacy, bohemian San Telmo, majestic cathedrals, and the thundering majesty of Iguazu Falls.",
      order: 4,
    },
  ];

  // 4. Parse Storyline.md
  const rawSections = storylineRaw.split(/^##\s+/m);
  const introHeader = rawSections[0]; // **Bon Voyage — March 21, 2026**
  const daySections = rawSections.slice(1);

  console.log(`Parsed ${daySections.length} storyline entries.`);

  const dayDocs: any[] = [];
  let dayCounter = 1;

  daySections.forEach((sec, idx) => {
    const firstNewline = sec.indexOf("\n");
    const heading = firstNewline === -1 ? sec.trim() : sec.slice(0, firstNewline).trim();
    const body = firstNewline === -1 ? "" : sec.slice(firstNewline).trim();

    const { dateStr, title, location: detectedLocation } = parseStoryHeading(heading);
    const { country, chapterSlug } = determineCountryAndChapter(dateStr, detectedLocation, body, idx);
    const finalLocation = detectedLocation || (country === "Morocco" ? "Casablanca" : country === "Argentina" ? "Buenos Aires" : "Amsterdam");

    const coordinates = CITY_COORDINATES[finalLocation] || CITY_COORDINATES[detectedLocation] || undefined;
    const matchedImages = mapImagesToStory(title, dateStr, body, allImages);
    const practices = detectPractices(body, title);
    const slug = slugify(`${dateStr ? dateStr + "-" : ""}${title}`);

    const cover = matchedImages.length > 0 ? matchedImages[0] : undefined;
    const gallery = matchedImages.length > 1 ? matchedImages.slice(1) : [];

    const storyPortableText = buildPortableText(body, matchedImages);

    dayDocs.push({
      _id: `day-${slug}`,
      _type: "day",
      title,
      slug: { _type: "slug", current: slug },
      date: dateStr || (idx === 0 ? "March 21, 2026" : "Summer 2026"),
      dayNumber: dayCounter++,
      location: finalLocation,
      country,
      chapter: {
        _type: "reference",
        _ref: chapterSlug === "orlando-interlude" ? "interlude-orlando" : `chapter-${chapterSlug}`,
      },
      chapterSlug,
      coverImageUrl: cover ? `/images/${encodeURIComponent(cover.filename)}` : undefined,
      coverImageCaption: cover ? cover.caption : undefined,
      story: storyPortableText,
      gallery: gallery.map((g) => ({
        url: `/images/${encodeURIComponent(g.filename)}`,
        caption: g.caption,
        filename: g.filename,
      })),
      practices: practices.map((pSlug) => ({
        _type: "reference",
        _ref: `practice-${pSlug}`,
      })),
      practiceSlugs: practices,
      coordinates: coordinates ? { _type: "geopoint", lat: coordinates.lat, lng: coordinates.lng } : undefined,
      order: idx + 1,
    });
  });

  // 5. Build Site Settings document
  const siteSettingsDoc = {
    _id: "siteSettings",
    _type: "siteSettings",
    siteTitle: "The Journey",
    subtitle: "A digital travel memoir across five months, three continents, and seventy days of discovery.",
    dateRange: "March 21 – August 18, 2026",
    countries: "The Netherlands · Belgium · Morocco · Argentina",
    heroImageUrl: "/images/Netherland.jpg",
    introduction: aboutText,
    preparationText: prepText,
    aboutText: aboutText,
  };

  // 6. Build Place documents for the map
  const placeDocs = Object.entries(CITY_COORDINATES).map(([name, info]) => ({
    _id: `place-${slugify(name)}`,
    _type: "place",
    name,
    slug: { _type: "slug", current: slugify(name) },
    country: info.country,
    coordinates: { _type: "geopoint", lat: info.lat, lng: info.lng },
    description: `Stops and excursions throughout ${name}, ${info.country}.`,
  }));

  // Compile entire dataset
  const fullDataset = {
    siteSettings: siteSettingsDoc,
    chapters: chapterDocs,
    practices: practiceDocs,
    days: dayDocs,
    places: placeDocs,
  };

  // Save to src/lib/content/seedData.json
  const targetJson = path.resolve(process.cwd(), "src/lib/content/seedData.json");
  fs.mkdirSync(path.dirname(targetJson), { recursive: true });
  fs.writeFileSync(targetJson, JSON.stringify(fullDataset, null, 2), "utf-8");
  console.log(`Successfully generated local seed dataset at ${targetJson}`);

  // Write NDJSON format for Sanity CLI dataset import
  const ndjsonPath = path.resolve(process.cwd(), "sanity-export.ndjson");
  const ndjsonStream = fs.createWriteStream(ndjsonPath);
  ndjsonStream.write(JSON.stringify(siteSettingsDoc) + "\n");
  chapterDocs.forEach((doc) => ndjsonStream.write(JSON.stringify(doc) + "\n"));
  practiceDocs.forEach((doc) => ndjsonStream.write(JSON.stringify(doc) + "\n"));
  placeDocs.forEach((doc) => ndjsonStream.write(JSON.stringify(doc) + "\n"));
  dayDocs.forEach((doc) => ndjsonStream.write(JSON.stringify(doc) + "\n"));
  ndjsonStream.end();
  console.log(`Successfully generated Sanity NDJSON dataset at ${ndjsonPath}`);

  // 7. Optional Direct Sanity Client Push if env vars are present
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_API_TOKEN;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

  if (projectId && token) {
    console.log(`Connecting to Sanity project '${projectId}' (dataset: '${dataset}') to push documents...`);
    const client = createClient({
      projectId,
      dataset,
      token,
      apiVersion: "2024-03-01",
      useCdn: false,
    });

    const transaction = client.transaction();
    transaction.createOrReplace(siteSettingsDoc);
    chapterDocs.forEach((doc) => transaction.createOrReplace(doc));
    practiceDocs.forEach((doc) => transaction.createOrReplace(doc));
    placeDocs.forEach((doc) => transaction.createOrReplace(doc));
    dayDocs.forEach((doc) => transaction.createOrReplace(doc));

    const result = await transaction.commit();
    console.log(`Sanity mutation transaction committed successfully! Result:`, result);
  } else {
    console.log("\nNote: Sanity credentials (SANITY_API_TOKEN / NEXT_PUBLIC_SANITY_PROJECT_ID) not provided in env.");
    console.log("-> You can also import directly into Sanity using the generated file:");
    console.log("   npx sanity dataset import sanity-export.ndjson production");
    console.log("-> Meanwhile, Next.js will read seamlessly from the verified imported dataset in src/lib/content/seedData.json.");
  }

  console.log("\n=== MIGRATION COMPLETE ===");
}

run().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
