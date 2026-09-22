import { defineField, defineType } from "sanity";

export const dayType = defineType({
  name: "day",
  title: "Day Entry",
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
      name: "date",
      title: "Date Display",
      type: "string",
      description: "e.g., 'March 23, 2026' or 'March 23'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dayNumber",
      title: "Day Number",
      type: "number",
      description: "Sequential day of the journey (1, 2, 3...)",
    }),
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
        "Original diary text. Supports paragraphs, headings, emphasis, links, and inline editorial images with captions.",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 3", value: "h3" },
            { title: "Heading 4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "URL",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                  },
                ],
              },
            ],
          },
        },
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
      title: "Chronological Order Index",
      type: "number",
      description: "Used to sort the journey chronologically",
    }),
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      location: "location",
      media: "coverImage",
    },
    prepare({ title, date, location, media }) {
      return {
        title: title || "Untitled Day",
        subtitle: `${date || ""} · ${location || ""}`.trim(),
        media,
      };
    },
  },
  orderings: [
    {
      title: "Chronological Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
