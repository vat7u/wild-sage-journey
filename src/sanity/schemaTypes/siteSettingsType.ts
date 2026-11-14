import { defineField, defineType } from "sanity";
import { richTextBlock } from "./richText";

/** Fixed document id: the Studio shows exactly one Site Settings document. */
export const SITE_SETTINGS_ID = "siteSettings";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "home", title: "Home page" },
    { name: "about", title: "About page" },
    { name: "preparation", title: "Preparation page" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
      group: "general",
      initialValue: "The Journey",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      group: "general",
      description: "Used as the site description for search engines and link previews.",
    }),
    defineField({
      name: "dateRange",
      title: "Date Range Display",
      type: "string",
      group: "general",
      description: "Shown on the home page and in the footer, e.g. 'March 21 – August 18, 2026'.",
    }),
    defineField({
      name: "countries",
      title: "Countries Visited",
      type: "string",
      group: "general",
      description: "Shown under the home page title, e.g. 'The Netherlands · Belgium · Morocco · Argentina'.",
    }),
    defineField({
      name: "heroImage",
      title: "Home Page Hero Photograph",
      type: "image",
      group: "home",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt Text" }],
    }),
    defineField({
      name: "introduction",
      title: "Home Page Quote",
      type: "text",
      group: "home",
      rows: 5,
      description: "The short quote shown in the 'From the Memoir' section of the home page.",
    }),
    defineField({
      name: "aboutText",
      title: "About Me (Full Text)",
      type: "array",
      group: "about",
      of: [richTextBlock],
    }),
    defineField({
      name: "preparationImage",
      title: "Preparation Photograph",
      type: "image",
      group: "preparation",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt Text" }],
    }),
    defineField({
      name: "preparationText",
      title: "Preparation / Before the Journey (Full Text)",
      type: "array",
      group: "preparation",
      description: "The first paragraph is shown as the opening; the rest appear in the indented block below it.",
      of: [richTextBlock],
    }),
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "text",
      group: "footer",
      rows: 3,
    }),
    defineField({
      name: "footerQuote",
      title: "Footer Quote",
      type: "string",
      group: "footer",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
