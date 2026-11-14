import { defineArrayMember } from "sanity";

/**
 * Text block allowed everywhere the site renders rich text: plain paragraphs
 * with bold, italic and links. Headings, quotes and lists are deliberately
 * not offered, because the site does not render them.
 */
export const richTextBlock = defineArrayMember({
  type: "block",
  styles: [{ title: "Paragraph", value: "normal" }],
  lists: [],
  marks: {
    decorators: [
      { title: "Bold", value: "strong" },
      { title: "Italic", value: "em" },
    ],
    annotations: [
      {
        name: "link",
        type: "object",
        title: "Link",
        fields: [
          {
            title: "URL",
            name: "href",
            type: "url",
            validation: (Rule) => Rule.uri({ scheme: ["http", "https", "mailto"] }),
          },
        ],
      },
    ],
  },
});
