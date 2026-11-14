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
      description:
        "Latitude and longitude for the map pin. Diary entries appear under this place when their Location contains the place name.",
      validation: (Rule) =>
        Rule.required().custom((value: { lat?: number; lng?: number } | undefined) => {
          if (!value) return true;
          const { lat, lng } = value;
          if (typeof lat !== "number" || lat < -90 || lat > 90) return "Latitude must be between -90 and 90";
          if (typeof lng !== "number" || lng < -180 || lng > 180) return "Longitude must be between -180 and 180";
          return true;
        }),
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
      // Not shown anywhere on the site yet
      hidden: true,
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
