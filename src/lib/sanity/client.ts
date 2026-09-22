import { createClient } from "@sanity/client";
import seedData from "@/lib/content/seedData.json";
import { Day, Chapter, Practice, Place, SiteSettings } from "@/lib/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2024-03-01";

export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === "production",
    })
  : null;

// Helper to normalize slug strings
export function getSlugString(slug: { current: string } | string | undefined): string {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug.current;
}

// 1. Site Settings
export async function getSiteSettings(): Promise<SiteSettings> {
  if (sanityClient) {
    try {
      const res = await sanityClient.fetch<SiteSettings>(`*[_type == "siteSettings"][0]`);
      if (res) return res;
    } catch (e) {
      console.warn("Sanity fetch failed, using local seed data:", e);
    }
  }
  return seedData.siteSettings as unknown as SiteSettings;
}

// 2. Chapters
export async function getAllChapters(): Promise<Chapter[]> {
  if (sanityClient) {
    try {
      const res = await sanityClient.fetch<Chapter[]>(`*[_type == "chapter"] | order(order asc)`);
      if (res && res.length > 0) return res;
    } catch (e) {
      console.warn("Sanity fetch failed, using local seed data:", e);
    }
  }
  return (seedData.chapters as unknown as Chapter[]).sort((a, b) => a.order - b.order);
}

export async function getChapterBySlug(slug: string): Promise<Chapter | null> {
  const chapters = await getAllChapters();
  return chapters.find((c) => getSlugString(c.slug) === slug) || null;
}

// 3. Days
export async function getAllDays(): Promise<Day[]> {
  if (sanityClient) {
    try {
      const res = await sanityClient.fetch<Day[]>(`*[_type == "day"] | order(order asc)`);
      if (res && res.length > 0) return res;
    } catch (e) {
      console.warn("Sanity fetch failed, using local seed data:", e);
    }
  }
  return (seedData.days as unknown as Day[]).sort((a, b) => a.order - b.order);
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

// 4. Practices
export async function getAllPractices(): Promise<Practice[]> {
  if (sanityClient) {
    try {
      const res = await sanityClient.fetch<Practice[]>(`*[_type == "practice"] | order(order asc)`);
      if (res && res.length > 0) return res;
    } catch (e) {
      console.warn("Sanity fetch failed, using local seed data:", e);
    }
  }
  return (seedData.practices as unknown as Practice[]).sort((a, b) => a.order - b.order);
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
  if (sanityClient) {
    try {
      const res = await sanityClient.fetch<Place[]>(`*[_type == "place"]`);
      if (res && res.length > 0) return res;
    } catch (e) {
      console.warn("Sanity fetch failed, using local seed data:", e);
    }
  }
  return seedData.places as unknown as Place[];
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
