import { getAllPlaces, getAllDays } from "@/lib/sanity/client";
import { EditorialMap } from "@/components/map/EditorialMap";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Places & Journey Map — The Journey",
  description:
    "An editorial geographic map tracing seventy days of discovery across the Netherlands, Belgium, Morocco, and Argentina.",
};

export default async function PlacesPage() {
  const [places, days] = await Promise.all([getAllPlaces(), getAllDays()]);

  // Connect places with days matching that location
  const placePoints = places
    .filter((p) => p.coordinates && typeof p.coordinates.lat === "number")
    .map((p) => {
      const placeDays = days.filter(
        (d) =>
          d.location.toLowerCase().includes(p.name.toLowerCase()) ||
          p.name.toLowerCase().includes(d.location.toLowerCase())
      );
      return {
        name: p.name,
        country: p.country,
        lat: p.coordinates.lat,
        lng: p.coordinates.lng,
        days: placeDays,
      };
    })
    .filter((p) => p.days.length > 0);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center space-y-4 max-w-2xl mx-auto">
          <p className="font-display tracking-[0.25em] text-xs uppercase text-sage-dark font-medium">
            Geographical Exploration
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-ink-900">
            Journey Map
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-ink-600">
            Explore the path from the North Sea canals through the Atlantic coast of Morocco to the avenues of Buenos Aires. Select any location to discover its diary entries.
          </p>
        </header>

        <EditorialMap places={placePoints} />
      </div>
    </div>
  );
}
