import { createClient } from "@sanity/client";
import { Day, Chapter, Practice, Place, SiteSettings } from "@/lib/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "tun41dyc";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2024-03-01";

/**
 * Sanity is the only source of content. Results are kept in the Next.js data
 * cache until the Sanity webhook (src/app/api/revalidate/route.ts) revalidates
 * the tag of the document type that changed, so published edits appear within
 * seconds without a rebuild. The API CDN is skipped so a revalidation never
 * reads a stale copy.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});

/** Document types the site reads; each one is also a cache tag. */
export const CONTENT_TAGS = ["day", "chapter", "practice", "place", "siteSettings"] as const;
type ContentTag = (typeof CONTENT_TAGS)[number];

async function query<T>(name: string, groq: string, tags: ContentTag[], params: Record<string, unknown> = {}): Promise<T> {
  try {
    return await sanityClient.fetch<T>(groq, params, { next: { revalidate: false, tags } });
  } catch (e) {
    // Fail loudly: a build stops here and the previous deployment stays live;
    // a failed background revalidation keeps serving the last good page.
    throw new Error(`Sanity query "${name}" failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

function required<T>(name: string, value: T | null | undefined): T {
  if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
    throw new Error(`Sanity query "${name}" returned no content. Check the dataset "${dataset}" in project "${projectId}".`);
  }
  return value;
}

// Helper to normalize slug strings
export function getSlugString(slug: { current: string } | string | undefined): string {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug.current;
}

/** "2026-03-23" -> "March 23, 2026" (parsed as a calendar date, no time zone shift). */
export function formatEntryDate(isoDate: string | undefined): string {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// 1. Site Settings
export async function getSiteSettings(): Promise<SiteSettings> {
  const res = await query<SiteSettings | null>(
    "siteSettings",
    `*[_type == "siteSettings"][0]{
      ...,
      "heroImageUrl": heroImage.asset->url,
      "heroImageAlt": heroImage.alt,
      "preparationImageUrl": preparationImage.asset->url,
      "preparationImageAlt": preparationImage.alt
    }`,
    ["siteSettings"]
  );
  return required("siteSettings", res);
}

// 2. Chapters
export async function getAllChapters(): Promise<Chapter[]> {
  const res = await query<Chapter[]>(
    "chapters",
    `*[_type == "chapter"] | order(order asc){
      ...,
      "imageUrl": coverImage.asset->url
    }`,
    ["chapter"]
  );
  return required("chapters", res);
}

export async function getChapterBySlug(slug: string): Promise<Chapter | null> {
  const chapters = await getAllChapters();
  return chapters.find((c) => getSlugString(c.slug) === slug) || null;
}

// 3. Days (diary entries), in date order
export async function getAllDays(): Promise<Day[]> {
  const res = await query<Day[]>(
    "days",
    `*[_type == "day" && defined(entryDate)] | order(entryDate asc, coalesce(order, 9999) asc){
      ...,
      "chapterSlug": chapter->slug.current,
      "practiceSlugs": practices[]->slug.current,
      "coverImageUrl": coverImage.asset->url,
      "coverImageCaption": coverImage.caption,
      "gallery": gallery[]{
        ...,
        "url": asset->url
      },
      "story": story[]{
        ...,
        _type == "image" => {
          ...,
          "url": asset->url
        }
      }
    }`,
    ["day", "chapter", "practice"]
  );
  // Day numbers and display dates are derived, so a new entry slots in by its date
  return required("days", res).map((d, i) => ({
    ...d,
    dayNumber: i + 1,
    date: formatEntryDate(d.entryDate),
  }));
}

export async function getDayBySlug(slug: string): Promise<{ day: Day; prevDay: Day | null; nextDay: Day | null } | null> {
  const days = await getAllDays();
  const index = days.findIndex((d) => getSlugString(d.slug) === slug);
  if (index === -1) return null;

  return {
    day: days[index],
    prevDay: index > 0 ? days[index - 1] : null,
    nextDay: index < days.length - 1 ? days[index + 1] : null,
  };
}

export async function getDaysByChapter(chapterSlug: string): Promise<Day[]> {
  const days = await getAllDays();
  return days.filter((d) => d.chapterSlug === chapterSlug);
}

/** Entries ticked "Featured on home page", earliest first, at most `limit`. */
export async function getFeaturedDays(limit = 4): Promise<Day[]> {
  const days = await getAllDays();
  return days.filter((d) => d.featured).slice(0, limit);
}

// 4. Practices
export async function getAllPractices(): Promise<Practice[]> {
  return query<Practice[]>(
    "practices",
    `*[_type == "practice"] | order(order asc){
      ...,
      "imageUrl": image.asset->url
    }`,
    ["practice"]
  );
}

export async function getPracticeBySlug(slug: string): Promise<{ practice: Practice; days: Day[] } | null> {
  const practices = await getAllPractices();
  const practice = practices.find((p) => getSlugString(p.slug) === slug);
  if (!practice) return null;

  const allDays = await getAllDays();
  const days = allDays.filter((d) => d.practiceSlugs?.includes(slug));

  return { practice, days };
}

// 5. Places
export async function getAllPlaces(): Promise<Place[]> {
  return query<Place[]>("places", `*[_type == "place"] | order(name asc)`, ["place"]);
}

// 6. Photographs archive
export async function getAllPhotographs(): Promise<
  {
    url: string;
    caption?: string;
    dayTitle: string;
    daySlug: string;
    date: string;
    location: string;
    country: string;
    chapterSlug: string;
  }[]
> {
  const days = await getAllDays();
  const photos: {
    url: string;
    caption?: string;
    dayTitle: string;
    daySlug: string;
    date: string;
    location: string;
    country: string;
    chapterSlug: string;
  }[] = [];

  for (const day of days) {
    const slugStr = getSlugString(day.slug);
    if (day.coverImageUrl) {
      photos.push({
        url: day.coverImageUrl,
        caption: day.coverImageCaption || day.title,
        dayTitle: day.title,
        daySlug: slugStr,
        date: day.date,
        location: day.location,
        country: day.country,
        chapterSlug: day.chapterSlug,
      });
    }

    if (day.gallery && day.gallery.length > 0) {
      for (const g of day.gallery) {
        if (g.url) {
          photos.push({
            url: g.url,
            caption: g.caption || day.title,
            dayTitle: day.title,
            daySlug: slugStr,
            date: day.date,
            location: day.location,
            country: day.country,
            chapterSlug: day.chapterSlug,
          });
        }
      }
    }
  }

  return photos;
}
