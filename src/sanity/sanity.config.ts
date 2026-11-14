import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
import { SITE_SETTINGS_ID } from "./schemaTypes/siteSettingsType";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "tun41dyc";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const SINGLETON_TYPES = new Set(["siteSettings"]);

export default defineConfig({
  basePath: "/studio",
  name: "wild_sage_journey_studio",
  title: "The Journey — Editorial Memoir Studio",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .id(SITE_SETTINGS_ID)
              .child(S.document().schemaType("siteSettings").documentId(SITE_SETTINGS_ID)),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => !SINGLETON_TYPES.has(item.getId() ?? "")),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // Site Settings cannot be created again from the "new document" menu
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    // Site Settings cannot be deleted or duplicated
    actions: (actions, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
});
