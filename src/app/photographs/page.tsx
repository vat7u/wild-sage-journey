import { getAllPhotographs } from "@/lib/sanity/client";
import { PhotoArchive } from "@/components/gallery/PhotoArchive";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photographs Archive — The Journey",
  description:
    "An editorial visual archive of the journey across the Netherlands, Belgium, Morocco, and Argentina.",
};

export default async function PhotographsPage() {
  const photos = await getAllPhotographs();

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-4 max-w-2xl mx-auto">
          <p className="font-display tracking-[0.25em] text-xs uppercase text-sage-dark font-medium">
            Visual Memoir Archive
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-ink-900">
            Photographs
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-ink-600">
            Moments, architectural wonders, and quiet encounters captured throughout seventy days of travel.
          </p>
        </header>

        <PhotoArchive photos={photos} />
      </div>
    </div>
  );
}
