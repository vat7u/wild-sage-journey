import Link from "next/link";
import Image from "next/image";
import { getAllDays, getAllChapters, getSlugString } from "@/lib/sanity/client";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Journey — Chronological Timeline",
  description:
    "Explore the complete chronological timeline of seventy days across the Netherlands, Belgium, Morocco, and Argentina.",
};

export default async function JourneyPage() {
  const [days, chapters] = await Promise.all([getAllDays(), getAllChapters()]);

  // Group days by chapter
  const chaptersWithDays = chapters.map((chap) => {
    const chapSlug = getSlugString(chap.slug);
    const chapDays = days.filter((d) => d.chapterSlug === chapSlug);
    return {
      ...chap,
      days: chapDays,
    };
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center space-y-4 mb-16 sm:mb-24">
          <p className="font-display tracking-[0.25em] text-xs uppercase text-sage-dark font-medium">
            Chronological Archive
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-ink-900">
            The Journey
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-ink-600 max-w-xl mx-auto">
            Seventy days recorded as they unfolded across three continents, from spring in Amsterdam to winter in Buenos Aires.
          </p>
        </header>

        {/* Chapters and Days Timeline */}
        <div className="space-y-24">
          {chaptersWithDays.map((chap) => {
            const chapSlug = getSlugString(chap.slug);
            const isInterlude = chap.type === "interlude";

            return (
              <section key={chap._id} className="relative">
                {/* Chapter Card Header */}
                <div className="mb-12 pb-8 border-b border-border-subtle flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-2">
                    <span className="font-sans text-xs tracking-[0.2em] uppercase text-terracotta font-medium">
                      {isInterlude ? "Interlude" : `Chapter 0${chap.order}`} · {chap.dateRange}
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-ink-900 font-medium">
                      {chap.title}
                    </h2>
                    <p className="font-serif italic text-sm text-ink-600 max-w-lg">
                      {chap.description}
                    </p>
                  </div>

                  <Link
                    href={`/journey/${chapSlug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-sans tracking-widest uppercase text-sage-dark hover:text-ink-900 transition-colors font-medium self-start md:self-auto"
                  >
                    View Chapter <ArrowRight size={13} />
                  </Link>
                </div>

                {/* Days Vertical Timeline */}
                <div className="relative pl-6 sm:pl-10 border-l border-border-medium space-y-10 ml-3 sm:ml-6">
                  {chap.days.map((day) => {
                    const slugStr = getSlugString(day.slug);
                    const dayNumberStr = day.dayNumber < 10 ? `0${day.dayNumber}` : `${day.dayNumber}`;

                    return (
                      <article
                        key={day._id}
                        className="relative group transition-all"
                      >
                        {/* Timeline node bullet */}
                        <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full bg-paper-100 border-2 border-ink-400 group-hover:border-sage group-hover:bg-sage transition-all" />

                        <Link
                          href={`/story/${slugStr}`}
                          className="block p-5 sm:p-6 rounded-sm bg-paper-50 hover:bg-paper-200/70 border border-border-subtle hover:border-border-medium transition-all shadow-sm group-hover:shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-sans text-xs tracking-[0.18em] uppercase text-sage-dark font-semibold">
                                Day {dayNumberStr}
                              </span>
                              <span className="font-serif italic text-xs text-ink-500">
                                {day.date}
                              </span>
                            </div>

                            <span className="flex items-center gap-1 font-sans text-xs text-ink-400">
                              <MapPin size={11} className="text-terracotta" />
                              {day.location}
                              {day.country ? ` · ${day.country}` : ""}
                            </span>
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                            <h3 className="font-serif text-xl sm:text-2xl text-ink-900 group-hover:text-sage-dark transition-colors font-medium">
                              {day.title}
                            </h3>

                            {day.coverImageUrl && (
                              <div className="relative w-20 h-14 sm:w-24 sm:h-16 flex-shrink-0 rounded overflow-hidden border border-border-subtle">
                                <Image
                                  src={day.coverImageUrl}
                                  alt={day.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="96px"
                                />
                              </div>
                            )}
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
