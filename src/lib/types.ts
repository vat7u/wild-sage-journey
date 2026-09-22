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
  date: string;
  dayNumber: number;
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
  order: number;
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
  heroImageUrl: string;
  introduction: string;
  preparationText: string;
  aboutText: string;
}
