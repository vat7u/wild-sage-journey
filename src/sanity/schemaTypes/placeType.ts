import { defineField, defineType } from "sanity";

export const placeType = defineType({
  name: "place",
  title: "Place / Map Location",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Place Name",
      type: "string",
      description: "e.g. 'Amsterdam', 'Chefchaouen', 'Buenos Aires'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coordinates",
      title: "Coordinates",
      type: "geopoint",
      description: "Latitude and longitude for placing on the map",
    }),
    defineField({
      name: "description",
      title: "Brief Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "country",
      media: "image",
    },
  },
});
