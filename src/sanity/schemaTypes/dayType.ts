import { defineField, defineType } from "sanity";
import { richTextBlock } from "./richText";

export const dayType = defineType({
  name: "day",
  title: "Diary Entry",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "entryDate",
      title: "Date",
      type: "date",
      description: "The day this entry is about. Entries are listed in date order.",
      options: { dateFormat: "MMMM D, YYYY" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured on home page",
      type: "boolean",
      description: "Show this entry under 'Selected Moments' on the home page (up to 4, earliest first).",
      initialValue: false,
    }),
    // Legacy fields kept hidden until the cleanup patch removes them from the data
    defineField({ name: "date", title: "Legacy date text", type: "string", hidden: true, readOnly: true }),
    defineField({ name: "dayNumber", title: "Legacy day number", type: "number", hidden: true, readOnly: true }),
    defineField({
      name: "location",
      title: "Location / City",
      type: "string",
      description: "e.g., Amsterdam, Delft, Casablanca, Buenos Aires",
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      description: "e.g., The Netherlands, Belgium, Morocco, Argentina",
    }),
    defineField({
      name: "chapter",
      title: "Chapter / Region",
      type: "reference",
      to: [{ type: "chapter" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
        },
      ],
    }),
    defineField({
      name: "story",
      title: "Story / Diary Content (Editorial Portable Text)",
      description:
        "Original diary text: paragraphs with bold, italic and links, plus inline photographs with captions.",
      type: "array",
      of: [
        richTextBlock,
        {
          type: "image",
          title: "Inline Editorial Image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
            },
            {
              name: "layout",
              type: "string",
              title: "Layout Style",
              options: {
                list: [
                  { title: "Full Bleed / Editorial Hero", value: "full" },
                  { title: "Standard Reading Width", value: "standard" },
                  { title: "Portrait Offset / Narrow", value: "offset" },
                ],
              },
              initialValue: "standard",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "gallery",
      title: "Additional Gallery Photographs",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
            {
              name: "altText",
              type: "string",
              title: "Alt Text",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "practices",
      title: "Connected Practices",
      type: "array",
      of: [{ type: "reference", to: [{ type: "practice" }] }],
      description: "Themes/practices reflected in this day's experience",
    }),
    defineField({
      name: "coordinates",
      title: "Coordinates (Latitude, Longitude)",
      type: "geopoint",
      description: "Location coordinates for the journey map",
    }),
    defineField({
      name: "order",
      title: "Order within the same date (optional)",
      type: "number",
      description:
        "Only needed when two entries share a date: the lower number is listed first. Leave empty otherwise.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      entryDate: "entryDate",
      location: "location",
      featured: "featured",
      media: "coverImage",
    },
    prepare({ title, entryDate, location, featured, media }) {
      return {
        title: `${featured ? "★ " : ""}${title || "Untitled entry"}`,
        subtitle: [entryDate, location].filter(Boolean).join(" · "),
        media,
      };
    },
  },
  orderings: [
    {
      title: "Date, earliest first",
      name: "entryDateAsc",
      by: [
        { field: "entryDate", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
    {
      title: "Date, newest first",
      name: "entryDateDesc",
      by: [{ field: "entryDate", direction: "desc" }],
    },
  ],
});
