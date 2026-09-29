import fs from "fs";
import path from "path";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "tun41dyc";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN || "sk9MxpxT7kpZA8P7Yr7a9UpVz8B1dkQ5wEF92w9YeQcAcMSjqh7J2aotXnpGMsFbJOgjKCxe5P8SxR5ZA9ZjsT1xLcNoGKBfmYzRS3HmlGDIErEf54RnIp6XtXe8w7dRRAs7BssiFz9Bfdl7IhIPDD11V8zmv52E6AFQFl9zkfk6iDhKsy4I";

console.log(`Connecting to Sanity: project=${projectId}, dataset=${dataset}`);

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-03-01",
  useCdn: false,
});

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

function determineCountryAndChapter(dateStr: string, location: string, text: string): { country: string; chapterSlug: string } {
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

    let keywordMatch = false;
    const keywords = imgLower.split(/[-_\s.]+/).filter((w) => w.length > 3 && !["march", "april", "june", "july", "august", "scaled"].includes(w));
    const matchCount = keywords.filter((k) => normalizedTitle.includes(k) || normalizedText.includes(k)).length;
    if (matchCount >= 2 || (keywords.length === 1 && matchCount === 1 && dateMatch)) {
      keywordMatch = true;
    }

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

function buildPortableText(
  text: string,
  images: { filename: string; caption: string }[],
  assetMap: Record<string, string>
) {
  const paragraphs = text
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const blocks: any[] = [];
  let imageIdx = 0;

  paragraphs.forEach((para, pIdx) => {
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

    if (imageIdx < images.length && (pIdx === 0 || pIdx === Math.floor(paragraphs.length / 2))) {
      const img = images[imageIdx];
      const assetId = assetMap[img.filename];
      const imgBlock: any = {
        _type: "image",
        _key: `img-${imageIdx}`,
        url: `/images/${encodeURIComponent(img.filename)}`,
        filename: img.filename,
        caption: img.caption,
        alt: img.caption,
        layout: imageIdx === 0 ? "standard" : "offset",
      };
      if (assetId) {
        imgBlock.asset = {
          _type: "reference",
          _ref: assetId,
        };
      }
      blocks.push(imgBlock);
      imageIdx++;
    }
  });

  return blocks;
}

async function uploadImages(allImageFiles: string[]): Promise<Record<string, string>> {
  console.log(`\n--- Fetching existing image assets from Sanity ---`);
  const existingAssets = await client.fetch<Array<{ _id: string; originalFilename: string }>>(
    `*[_type == "sanity.imageAsset"]{ _id, originalFilename }`
  );
  
  const assetMap: Record<string, string> = {};
  for (const asset of existingAssets) {
    if (asset.originalFilename) {
      assetMap[asset.originalFilename] = asset._id;
    }
  }
  console.log(`Found ${Object.keys(assetMap).length} already uploaded assets in Sanity.`);

  console.log(`\n--- Uploading missing images to Sanity Content Lake ---`);
  let uploadedCount = 0;
  for (const filename of allImageFiles) {
    if (assetMap[filename]) {
      continue;
    }
    const filePath = path.join(IMAGES_DIR, filename);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    try {
      const stream = fs.createReadStream(filePath);
      const res = await client.assets.upload("image", stream, {
        filename,
      });
      assetMap[filename] = res._id;
      uploadedCount++;
      process.stdout.write(`Uploaded (${uploadedCount}): ${filename} -> ${res._id}\n`);
    } catch (err) {
      console.error(`Error uploading ${filename}:`, err);
    }
  }

  console.log(`Completed image assets upload! Total mapped assets: ${Object.keys(assetMap).length}`);
  return assetMap;
}

async function run() {
  console.log("=== Starting Complete Sanity Content & Image Migration ===");

  // 1. Gather all images
  const allImages = fs.existsSync(IMAGES_DIR) ? fs.readdirSync(IMAGES_DIR) : [];
  console.log(`Found ${allImages.length} images in ${IMAGES_DIR}`);

  // 2. Upload all images to Sanity
  const assetMap = await uploadImages(allImages);

  // 3. Read Markdown Content
  const storylineMd = fs.readFileSync(path.join(CONTENT_DIR, "Storyline.md"), "utf-8");
  const aboutMd = fs.readFileSync(path.join(CONTENT_DIR, "About.md"), "utf-8");
  const prepMd = fs.readFileSync(path.join(CONTENT_DIR, "Preparation.md"), "utf-8");
  const practicesMd = fs.readFileSync(path.join(CONTENT_DIR, "The 8 Practices.md"), "utf-8");

  // 4. Parse Storyline into entries
  const rawSections = storylineMd.split(/(?=^##\s+)/m).filter((s) => s.trim().startsWith("##"));
  console.log(`Parsed ${rawSections.length} storyline days`);

  let dayIndex = 1;
  const storyEntries: StoryEntry[] = [];

  for (const sec of rawSections) {
    const lines = sec.trim().split("\n");
    const heading = lines[0];
    const body = lines.slice(1).join("\n").trim();
    const { dateStr, title, location } = parseStoryHeading(heading);
    const { country, chapterSlug } = determineCountryAndChapter(dateStr, location, body);
    const matchedImgs = mapImagesToStory(title, dateStr, body, allImages);
    const practices = detectPractices(body, title);
    const coords = location && CITY_COORDINATES[location] ? { lat: CITY_COORDINATES[location].lat, lng: CITY_COORDINATES[location].lng } : undefined;

    storyEntries.push({
      title,
      dateStr: dateStr || `Day ${dayIndex}`,
      dayNumber: dayIndex,
      location: location || (country === "Morocco" ? "Casablanca" : country === "Argentina" ? "Buenos Aires" : "Amsterdam"),
      country,
      chapterSlug,
      text: body,
      images: matchedImgs,
      coordinates: coords,
      practiceSlugs: practices,
    });
    dayIndex++;
  }

  // 5. Parse The 8 Practices
  const practiceNames = practicesMd
    .split("\n")
    .map((l) => l.replace(/^\d+\.\s*/, "").replace(/^-\s*/, "").trim())
    .filter(Boolean);

  const practiceDescriptions: Record<string, string> = {
    "Savor every moment": "Taking time to fully experience and cherish the small, sensory delights of everyday journeying.",
    Gratitude: "Consciously acknowledging the beauty, kindness, and serendipity encountered on the road.",
    Kindness: "Offering warmth, patience, and small acts of generosity to fellow travelers, hosts, and locals.",
    "Social connections": "Cultivating meaningful conversations, shared meals, and bonds with friends, roommates, and strangers.",
    Exercise: "Moving through landscapes on foot and by bicycle, grounding the mind through physical vitality.",
    Meditation: "Cultivating stillness and presence inside ancient courtyards, quiet canals, and sacred spaces.",
    "Use my signature strengths": "Applying curiosity, love of learning, and perspective to navigate and understand diverse cultures.",
    Sleep: "Honoring restorative rest, deep reflection, and balance across the changing rhythms of travel.",
  };

  const practiceImageFilenames: Record<string, string> = {
    "savor-every-moment": "The 8 Practices-Savor every moment.jpg",
    gratitude: "The 8 Practices-Gratitude.jpg",
    kindness: "The 8 Practices-Kindness.jpg",
    "social-connections": "The 8 Practices-Social connections.jpg",
    exercise: "The 8 Practices-Exercise.jpg",
    meditation: "The 8 Practices-Meditation.jpg",
    "use-my-signature-strengths": "The 8 Practices-Use my signature strengths.jpg",
    sleep: "The 8 Practices-sleep.jpg",
  };

  // Build Practice documents
  const practiceDocs = practiceNames.map((name, idx) => {
    const slug = slugify(name);
    const imgFilename = practiceImageFilenames[slug];
    const assetId = imgFilename ? assetMap[imgFilename] : null;

    const doc: any = {
      _id: `practice-${slug}`,
      _type: "practice",
      title: name,
      slug: { _type: "slug", current: slug },
      order: idx + 1,
      imageUrl: imgFilename ? `/images/${encodeURIComponent(imgFilename)}` : "",
      description: practiceDescriptions[name] || `Cultivating ${name} across the journey.`,
    };

    if (assetId) {
      doc.image = {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
        alt: name,
      };
    }

    return doc;
  });

  // Build Chapter documents
  const chapterDefinitions = [
    {
      slug: "netherlands-belgium",
      title: "The Netherlands & Belgium",
      type: "chapter",
      country: "The Netherlands & Belgium",
      subtitle: "Canals, cobbles, tulip fields, and historic cities across the Low Countries.",
      dateRange: "March 21 – May 30, 2026",
      startDate: "2026-03-21",
      endDate: "2026-05-30",
      imageFilename: "Netherland.jpg",
      description: "A spring exploration traversing Amsterdam's ring canals, historic windmills, Utrecht's wharfs, Keukenhof blossoms, and medieval Belgian architecture.",
      order: 1,
    },
    {
      slug: "morocco",
      title: "Morocco",
      type: "chapter",
      country: "Morocco",
      subtitle: "Ancient medinas, blue alleys, coastal fortresses, and fragrant tagines.",
      dateRange: "June 4 – July 20, 2026",
      startDate: "2026-06-04",
      endDate: "2026-07-20",
      imageFilename: "Morocco.jpg",
      description: "From Casablanca's grand oceanfront mosque to the indigo alleys of Chefchaouen, Marrakech's vibrant souks, and Rabat's quiet coastal gardens.",
      order: 2,
    },
    {
      slug: "orlando-interlude",
      title: "Orlando Interlude",
      type: "interlude",
      country: "United States",
      subtitle: "A brief transitional pause of family and cinematic wonder.",
      dateRange: "July 30, 2026",
      startDate: "2026-07-30",
      endDate: "2026-07-30",
      imageFilename: "pexels-photo-31719382-31719382-scaled.jpg",
      description: "A joyful summer interlude marked by amusement, cinema themes, and recharging between continental voyages.",
      order: 3,
    },
    {
      slug: "argentina",
      title: "Argentina",
      type: "chapter",
      country: "Argentina",
      subtitle: "Tango rhythms, majestic waterfalls, historic cafes, and vibrant avenues.",
      dateRange: "August 6 – August 18, 2026",
      startDate: "2026-08-06",
      endDate: "2026-08-18",
      imageFilename: "Argentina.jpg",
      description: "Winter in the Southern Hemisphere: the grand avenues of Buenos Aires, mate ceremonies, El Ateneo bookshops, and the roaring mist of Iguazu Falls.",
      order: 4,
    },
  ];

  const chapterDocs = chapterDefinitions.map((ch) => {
    const assetId = assetMap[ch.imageFilename];
    const doc: any = {
      _id: `chapter-${ch.slug}`,
      _type: "chapter",
      title: ch.title,
      slug: { _type: "slug", current: ch.slug },
      type: ch.type,
      country: ch.country,
      subtitle: ch.subtitle,
      dateRange: ch.dateRange,
      startDate: ch.startDate,
      endDate: ch.endDate,
      imageUrl: `/images/${encodeURIComponent(ch.imageFilename)}`,
      description: ch.description,
      order: ch.order,
    };

    if (assetId) {
      doc.coverImage = {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
        alt: ch.title,
        caption: ch.subtitle,
      };
    }

    return doc;
  });

  // Build Day documents
  const dayDocs = storyEntries.map((entry, idx) => {
    const slug = slugify(entry.title);
    const coverImg = entry.images.length > 0 ? entry.images[0] : null;
    const coverAssetId = coverImg ? assetMap[coverImg.filename] : null;

    const galleryImages = entry.images.slice(1).map((img, gIdx) => {
      const gAssetId = assetMap[img.filename];
      const gObj: any = {
        _type: "image",
        _key: `g-${gIdx}`,
        url: `/images/${encodeURIComponent(img.filename)}`,
        caption: img.caption,
        altText: img.caption,
        filename: img.filename,
      };
      if (gAssetId) {
        gObj.asset = {
          _type: "reference",
          _ref: gAssetId,
        };
      }
      return gObj;
    });

    const portableStory = buildPortableText(entry.text, entry.images, assetMap);

    const doc: any = {
      _id: `day-${slug}`,
      _type: "day",
      title: entry.title,
      slug: { _type: "slug", current: slug },
      date: entry.dateStr,
      dayNumber: entry.dayNumber,
      location: entry.location,
      country: entry.country,
      chapterSlug: entry.chapterSlug,
      chapter: {
        _type: "reference",
        _ref: `chapter-${entry.chapterSlug}`,
      },
      coverImageUrl: coverImg ? `/images/${encodeURIComponent(coverImg.filename)}` : undefined,
      coverImageCaption: coverImg ? coverImg.caption : undefined,
      story: portableStory,
      gallery: galleryImages,
      practices: entry.practiceSlugs.map((ps) => ({
        _type: "reference",
        _key: `ref-${ps}`,
        _ref: `practice-${ps}`,
      })),
      practiceSlugs: entry.practiceSlugs,
      order: idx + 1,
    };

    if (coverAssetId) {
      doc.coverImage = {
        _type: "image",
        asset: { _type: "reference", _ref: coverAssetId },
        alt: entry.title,
        caption: coverImg ? coverImg.caption : entry.title,
      };
    }

    if (entry.coordinates) {
      doc.coordinates = {
        _type: "geopoint",
        lat: entry.coordinates.lat,
        lng: entry.coordinates.lng,
      };
    }

    return doc;
  });

  // Build Site Settings Document
  const aboutText = aboutMd.replace(/^#\s*.*\n+/, "").trim();
  const prepText = prepMd.replace(/^#\s*.*\n+/, "").trim();
  const heroAssetId = assetMap["Netherland.jpg"];

  const siteSettingsDoc: any = {
    _id: "siteSettings",
    _type: "siteSettings",
    siteTitle: "The Journey",
    subtitle: "A digital travel memoir across five months, three continents, and seventy days of discovery.",
    dateRange: "March – August 2026",
    countries: "The Netherlands · Belgium · Morocco · Argentina",
    heroImageUrl: "/images/Netherland.jpg",
    introduction: aboutText,
    preparationText: prepText,
    aboutText: aboutText,
  };

  if (heroAssetId) {
    siteSettingsDoc.heroImage = {
      _type: "image",
      asset: { _type: "reference", _ref: heroAssetId },
    };
  }

  // Build Places
  const placeDocs = Object.entries(CITY_COORDINATES).map(([name, info]) => ({
    _id: `place-${slugify(name)}`,
    _type: "place",
    name,
    slug: { _type: "slug", current: slugify(name) },
    country: info.country,
    coordinates: { _type: "geopoint", lat: info.lat, lng: info.lng },
    description: `Stops and excursions throughout ${name}, ${info.country}.`,
  }));

  // Compile full dataset for local seed fallback
  const fullDataset = {
    siteSettings: siteSettingsDoc,
    chapters: chapterDocs,
    practices: practiceDocs,
    days: dayDocs,
    places: placeDocs,
  };

  const targetJson = path.resolve(process.cwd(), "src/lib/content/seedData.json");
  fs.mkdirSync(path.dirname(targetJson), { recursive: true });
  fs.writeFileSync(targetJson, JSON.stringify(fullDataset, null, 2), "utf-8");
  console.log(`Updated local seed dataset at ${targetJson}`);

  // Push all documents to Sanity
  console.log(`\n--- Pushing documents to Sanity project '${projectId}' (dataset: '${dataset}') ---`);
  
  const allDocs = [
    siteSettingsDoc,
    ...chapterDocs,
    ...practiceDocs,
    ...placeDocs,
    ...dayDocs,
  ];

  console.log(`Total documents to create/replace: ${allDocs.length}`);

  // Chunk transactions (max 25 per transaction for reliability)
  const chunkSize = 20;
  for (let i = 0; i < allDocs.length; i += chunkSize) {
    const chunk = allDocs.slice(i, i + chunkSize);
    const tx = client.transaction();
    chunk.forEach((doc) => tx.createOrReplace(doc));
    await tx.commit();
    console.log(`Committed chunk ${Math.floor(i / chunkSize) + 1} / ${Math.ceil(allDocs.length / chunkSize)} (${chunk.length} docs)`);
  }

  console.log("\n=== ALL CONTENT & IMAGES SUCCESSFULLY PUSHED AND LINKED IN SANITY! ===");
}

run().catch((err) => {
  console.error("Migration fatal error:", err);
  process.exit(1);
});
