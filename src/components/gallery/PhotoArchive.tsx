"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, ArrowUpRight } from "lucide-react";

interface PhotoItem {
  url: string;
  caption?: string;
  dayTitle: string;
  daySlug: string;
  date: string;
  location: string;
  country: string;
  chapterSlug: string;
}

interface PhotoArchiveProps {
  photos: PhotoItem[];
}

export function PhotoArchive({ photos }: PhotoArchiveProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");

  const countries = useMemo(() => {
    const list = Array.from(new Set(photos.map((p) => p.country).filter(Boolean)));
    return ["all", ...list];
  }, [photos]);

  const chapters = useMemo(() => {
    const list = Array.from(new Set(photos.map((p) => p.chapterSlug).filter(Boolean)));
    return ["all", ...list];
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      const matchCountry = selectedCountry === "all" || p.country === selectedCountry;
      const matchChapter = selectedChapter === "all" || p.chapterSlug === selectedChapter;
      return matchCountry && matchChapter;
    });
  }, [photos, selectedCountry, selectedChapter]);

  return (
    <div className="space-y-10">
      {/* Editorial Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border-subtle font-sans text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-ink-400 uppercase tracking-widest mr-2">Country:</span>
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              className={`px-3 py-1.5 rounded-full uppercase tracking-wider transition-all ${
                selectedCountry === c
                  ? "bg-sage text-white font-medium shadow-xs"
                  : "bg-paper-200 text-ink-600 hover:bg-paper-300"
              }`}
            >
              {c === "all" ? "All Countries" : c}
            </button>
          ))}
        </div>

        <div className="text-ink-500 font-serif italic text-sm">
          Showing {filteredPhotos.length} photograph{filteredPhotos.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Editorial Masonry/Varied Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPhotos.map((photo, idx) => {
          // Subtle aspect ratio rhythm for visual memoir feel
          const aspectClass =
            idx % 5 === 0
              ? "aspect-[4/5]"
              : idx % 3 === 0
              ? "aspect-[16/10]"
              : "aspect-[4/3]";

          return (
            <article
              key={`${photo.url}-${idx}`}
              className="group flex flex-col space-y-3"
            >
              <Link
                href={`/story/${photo.daySlug}`}
                className="relative block w-full overflow-hidden rounded-sm bg-paper-200 border border-border-subtle shadow-sm group-hover:shadow-md transition-all duration-300"
              >
                <div className={`relative w-full ${aspectClass} overflow-hidden`}>
                  <Image
                    src={photo.url}
                    alt={photo.caption || photo.dayTitle}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 bg-ink-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="inline-flex items-center gap-1 font-sans text-xs text-white uppercase tracking-wider bg-ink-900/60 backdrop-blur-sm px-2.5 py-1 rounded">
                    Read Story <ArrowUpRight size={13} />
                  </span>
                </div>
              </Link>

              <div className="space-y-1">
                <p className="font-serif text-base text-ink-900 line-clamp-1 group-hover:text-sage-dark transition-colors font-medium">
                  {photo.caption || photo.dayTitle}
                </p>
                <div className="flex items-center justify-between text-xs font-sans text-ink-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={11} className="text-terracotta" /> {photo.location}
                  </span>
                  <span className="font-serif italic text-ink-500">{photo.date}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
