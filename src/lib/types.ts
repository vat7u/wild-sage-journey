export interface InlineImage {
  _type: "image";
  _key: string;
  url: string;
  filename: string;
  caption?: string;
  alt?: string;
  layout?: "full" | "standard" | "offset";
}

export interface StoryBlock {
  _type: "block" | "image";
  _key: string;
  style?: string;
  children?: { _type: "span"; _key: string; text: string; marks: string[] }[];
  /** Link annotations referenced by span marks */
  markDefs?: { _key: string; _type: string; href?: string }[];
  url?: string;
  filename?: string;
  caption?: string;
  alt?: string;
  layout?: "full" | "standard" | "offset";
}

export interface GalleryImage {
  url: string;
  caption?: string;
  altText?: string;
  filename?: string;
}

export interface Day {
  _id: string;
  _type: "day";
  title: string;
  slug: { _type: "slug"; current: string } | string;
  /** Calendar date from Sanity, "YYYY-MM-DD" */
  entryDate: string;
  /** Display date derived from entryDate by the getter, e.g. "March 23, 2026" */
  date: string;
  /** 1-based position in date order, derived by the getter */
  dayNumber: number;
  featured?: boolean;
  location: string;
  country: string;
  chapterSlug: string;
  chapter?: {
    _ref?: string;
    title?: string;
    slug?: { current: string } | string;
  };
  coverImageUrl?: string;
  coverImageCaption?: string;
  story: StoryBlock[];
  gallery: GalleryImage[];
  practices?: { _ref: string }[];
  practiceSlugs?: string[];
  coordinates?: {
    _type: "geopoint";
    lat: number;
    lng: number;
  };
  /** Optional tie-break between entries that share a date */
  order?: number;
}

export interface Chapter {
  _id: string;
  _type: "chapter";
  title: string;
  slug: { _type: "slug"; current: string } | string;
  type: "chapter" | "interlude";
  country: string;
  subtitle: string;
  dateRange: string;
  startDate?: string;
  endDate?: string;
  imageUrl: string;
  description: string;
  order: number;
}

export interface Practice {
  _id: string;
  _type: "practice";
  title: string;
  slug: { _type: "slug"; current: string } | string;
  order: number;
  imageUrl?: string;
  description: string;
}

export interface Place {
  _id: string;
  _type: "place";
  name: string;
  slug: { _type: "slug"; current: string } | string;
  country: string;
  coordinates: {
    _type: "geopoint";
    lat: number;
    lng: number;
  };
  description?: string;
}

export interface SiteSettings {
  _id: string;
  _type: "siteSettings";
  siteTitle: string;
  subtitle: string;
  dateRange: string;
  countries: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  /** Short quote for the home page */
  introduction?: string;
  preparationText?: StoryBlock[];
  preparationImageUrl?: string;
  preparationImageAlt?: string;
  aboutText?: StoryBlock[];
  footerText?: string;
  footerQuote?: string;
}
