import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
      initialValue: "The Journey",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      initialValue: "A digital travel memoir across five months, three continents, and seventy days of discovery.",
    }),
    defineField({
      name: "dateRange",
      title: "Date Range Display",
      type: "string",
      initialValue: "March – August 2026",
    }),
    defineField({
      name: "countries",
      title: "Countries Visited",
      type: "string",
      initialValue: "The Netherlands · Belgium · Morocco · Argentina",
    }),
    defineField({
      name: "introduction",
      title: "Homepage Memoir Introduction",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "heroImage",
      title: "Homepage Hero Photograph",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "preparationText",
      title: "Preparation / Before the Journey (Full Text)",
      type: "text",
      rows: 10,
    }),
    defineField({
      name: "aboutText",
      title: "About Me (Full Text)",
      type: "text",
      rows: 10,
    }),
  ],
});
