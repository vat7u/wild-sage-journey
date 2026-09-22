"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Navigation, ArrowRight, Calendar } from "lucide-react";
import { Day } from "@/lib/types";
import { getSlugString } from "@/lib/sanity/client";

interface PlacePoint {
  name: string;
  country: string;
  lat: number;
  lng: number;
  days: Day[];
}

interface EditorialMapProps {
  places: PlacePoint[];
}

export function EditorialMap({ places }: EditorialMapProps) {
  // Filter out any place without valid coordinates
  const validPlaces = places.filter(
    (p) => typeof p.lat === "number" && typeof p.lng === "number" && !isNaN(p.lat) && !isNaN(p.lng)
  );

  const [activePlace, setActivePlace] = useState<PlacePoint>(validPlaces[0] || null);

  // Convert lat/lng to SVG percentage coordinates using Mercator projection
  function project(lat: number, lng: number): { x: number; y: number } {
    // Mercator projection bounding box approximately encompassing Europe, North Africa & South America
    // Longitude from -85 to +20
    // Latitude from -40 to +60
    const minLng = -85;
    const maxLng = 20;
    const minLat = -38;
    const maxLat = 58;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    // Mercator y
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return {
      x: Math.max(4, Math.min(96, x)),
      y: Math.max(4, Math.min(96, y)),
    };
  }

  return (
    <div className="space-y-12">
      {/* Visual Map Canvas */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[21/10] max-h-[560px] rounded-sm bg-paper-200 border border-border-subtle overflow-hidden shadow-inner p-4 sm:p-8 flex items-center justify-center">
        {/* Subtle background grid / longitude lines */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#475B4B_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Decorative Compass Rose */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 pointer-events-none opacity-40 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-ink-400 flex items-center justify-center">
            <span className="font-sans text-[10px] font-semibold text-ink-600">N</span>
          </div>
        </div>

        {/* SVG Route lines & markers */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Subtle curved journey route arcs */}
          <path
            d="M 85,20 Q 75,55 75,65 Q 60,75 35,90"
            fill="none"
            stroke="#A85D41"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            opacity="0.4"
          />
        </svg>

        {/* Interactive Location Pins */}
        <div className="absolute inset-0 p-6 pointer-events-auto">
          {validPlaces.map((place) => {
            const { x, y } = project(place.lat, place.lng);
            const isSelected = activePlace?.name === place.name;

            return (
              <button
                key={place.name}
                onClick={() => setActivePlace(place)}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none transition-all z-10 ${
                  isSelected ? "z-30 scale-125" : "hover:scale-110"
                }`}
                aria-label={`View entries for ${place.name}`}
              >
                <div
                  className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-all shadow-md ${
                    isSelected
                      ? "bg-terracotta text-white ring-4 ring-terracotta/20"
                      : "bg-paper-50 text-ink-800 border border-border-medium hover:border-sage hover:text-sage"
                  }`}
                >
                  <MapPin size={14} />
                </div>

                {/* Pin Tooltip */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2.5 py-1 rounded bg-ink-900/90 text-white font-sans text-[11px] tracking-wider whitespace-nowrap shadow-lg pointer-events-none transition-opacity ${
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {place.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Location Stories Drawer */}
      {activePlace && (
        <div className="p-6 sm:p-8 rounded-sm bg-paper-50 border border-border-subtle shadow-sm space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-border-subtle">
            <div className="space-y-1">
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-terracotta font-semibold">
                {activePlace.country}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink-900">
                {activePlace.name}
              </h2>
            </div>
            <span className="font-sans text-xs text-ink-400">
              Coordinates: {activePlace.lat.toFixed(4)}° N, {activePlace.lng.toFixed(4)}° E
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="font-display tracking-[0.18em] text-xs uppercase text-ink-500">
              Stories from {activePlace.name} ({activePlace.days.length} entries)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePlace.days.map((day) => {
                const daySlug = getSlugString(day.slug);
                return (
                  <Link
                    key={day._id}
                    href={`/story/${daySlug}`}
                    className="group p-4 rounded bg-paper-100 hover:bg-paper-200/80 border border-border-subtle hover:border-border-medium transition-all flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="font-serif italic text-xs text-ink-500">
                        {day.date}
                      </span>
                      <h4 className="font-serif text-base text-ink-900 group-hover:text-sage-dark font-medium line-clamp-1">
                        {day.title}
                      </h4>
                    </div>

                    <ArrowRight
                      size={14}
                      className="text-ink-400 group-hover:text-sage-dark group-hover:translate-x-0.5 transition-all flex-shrink-0"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
