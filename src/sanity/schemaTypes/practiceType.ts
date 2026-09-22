import { defineField, defineType } from "sanity";

export const practiceType = defineType({
  name: "practice",
  title: "The 8 Practices",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Practice Title",
      type: "string",
      description: "e.g., 'Savor every moment', 'Gratitude', 'Social connections'",
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
      name: "description",
      title: "Description / Essence",
      type: "text",
      rows: 4,
      description: "Brief reflection on what this practice means in the context of the journey",
    }),
    defineField({
      name: "image",
      title: "Practice Photograph",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
        },
      ],
    }),
    defineField({
      name: "order",
      title: "Order Index (1-8)",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      order: "order",
    },
    prepare({ title, media, order }) {
      return {
        title: `Practice 0${order}: ${title}`,
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
