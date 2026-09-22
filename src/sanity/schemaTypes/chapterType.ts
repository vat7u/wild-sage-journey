import { defineField, defineType } from "sanity";

export const chapterType = defineType({
  name: "chapter",
  title: "Chapter / Journey Stage",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "e.g. 'Chapter 01 — The Netherlands & Belgium' or 'The Netherlands'",
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
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Main Chapter", value: "chapter" },
          { title: "Interlude", value: "interlude" },
        ],
        layout: "radio",
      },
      initialValue: "chapter",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "country",
      title: "Country / Region",
      type: "string",
      description: "e.g. 'The Netherlands & Belgium', 'Morocco', 'United States', 'Argentina'",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle / Tagline",
      type: "string",
      description: "Brief poetic or geographic tagline",
    }),
    defineField({
      name: "dateRange",
      title: "Date Range Display",
      type: "string",
      description: "e.g. 'March 21 – May 30, 2026'",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
    }),
    defineField({
      name: "coverImage",
      title: "Cover / Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
        },
      ],
    }),
    defineField({
      name: "description",
      title: "Chapter Introduction",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "order",
      title: "Chapter Order",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "dateRange",
      media: "coverImage",
      type: "type",
    },
    prepare({ title, subtitle, media, type }) {
      return {
        title,
        subtitle: `${type === "interlude" ? "[Interlude] " : ""}${subtitle || ""}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
