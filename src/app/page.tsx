import Image from "next/image";
import Link from "next/link";
import { getAllChapters, getAllDays, getFeaturedDays, getSiteSettings, getSlugString } from "@/lib/sanity/client";
import { ArrowRight, Compass } from "lucide-react";

export default async function HomePage() {
  const [settings, chapters, allDays, curatedMoments] = await Promise.all([
    getSiteSettings(),
    getAllChapters(),
    getAllDays(),
    getFeaturedDays(4),
  ]);

  const firstDay = allDays[0];
  const firstDaySlug = firstDay ? getSlugString(firstDay.slug) : "";

  return (
    <div className="min-h-screen">
      {/* 1. DIGITAL TRAVEL BOOK COVER HERO */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-border-subtle">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Header Title & Subtitle */}
          <div className="space-y-4">
            <span className="inline-block font-display tracking-[0.3em] text-xs sm:text-sm uppercase text-ink-600 font-semibold">
              The Journey
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-ink-900 leading-[1.1]">
              A Personal Travel Diary
            </h1>
            <p className="font-sans text-xs sm:text-sm tracking-[0.25em] uppercase text-terracotta font-medium pt-1">
              {settings.countries} · {settings.dateRange}
            </p>
          </div>

          {/* Large Hero Photograph (Site Settings → Home page) */}
          {settings.heroImageUrl && (
            <figure className="relative aspect-[16/10] sm:aspect-[21/9] w-full max-h-[620px] rounded-sm overflow-hidden bg-paper-200 border border-border-subtle shadow-md my-8">
              <Image
                src={settings.heroImageUrl}
                alt={settings.heroImageAlt || settings.siteTitle}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </figure>
          )}

          {/* Begin the journey CTA */}
          {firstDaySlug && <div className="pt-4">
            <Link
              href={`/story/${firstDaySlug}`}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-sage text-white font-sans text-xs sm:text-sm tracking-[0.18em] uppercase hover:bg-sage-dark transition-all duration-300 shadow-sm hover:shadow-md group"
            >
              Begin the journey <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>}
        </div>
      </section>

      {/* 2. INTRODUCTION USING ABOUT CONTENT */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-paper-50/50 border-b border-border-subtle">
        <div className="max-w-2xl mx-auto space-y-6 text-center">
          <span className="font-display tracking-[0.25em] text-xs uppercase text-ink-500 font-medium">
            From the Memoir
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-900 font-medium leading-snug">
            Pursuing Wellness Coaching Across Three Continents
          </h2>
          {settings.introduction && (
            <div className="font-serif text-ink-700 text-lg sm:text-xl leading-relaxed space-y-4 pt-2">
              <p className="italic">&ldquo;{settings.introduction.trim()}&rdquo;</p>
            </div>
          )}
          <div className="pt-4">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-xs font-sans tracking-widest uppercase text-sage-dark hover:text-ink-900 font-medium border-b border-border-medium pb-1"
            >
              Read full story <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. MAJOR JOURNEY CHAPTERS */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-border-subtle">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="font-display tracking-[0.25em] text-xs uppercase text-sage-dark font-medium">
              Stages of the Narrative
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-ink-900">
              The Chapters
            </h2>
            <p className="font-serif italic text-base text-ink-600">
              Chronologically unfolding through {chapters.length} stages of the journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {chapters.map((chap) => {
              const chapSlug = getSlugString(chap.slug);
              const isInterlude = chap.type === "interlude";

              return (
                <Link
                  key={chap._id}
                  href={`/journey/${chapSlug}`}
                  className="group flex flex-col rounded-sm bg-paper-50 hover:bg-paper-200/70 border border-border-subtle hover:border-border-medium transition-all duration-300 shadow-sm overflow-hidden"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper-200">
                    <Image
                      src={chap.imageUrl}
                      alt={chap.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  <div className="p-6 sm:p-8 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-sans tracking-[0.18em] uppercase text-terracotta font-medium">
                        <span>{isInterlude ? "Interlude" : `0${chap.order}`}</span>
                        <span>{chap.dateRange}</span>
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-ink-900 group-hover:text-sage-dark transition-colors font-medium">
                        {chap.title}
                      </h3>
                      <p className="font-serif italic text-sm text-ink-600 line-clamp-2">
                        {chap.description}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-sans tracking-widest uppercase text-sage-dark font-semibold pt-4">
                      Enter Chapter <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. CURATED MOMENTS: entries ticked "Featured on home page" in the Studio */}
      {curatedMoments.length > 0 && <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border-subtle">
            <div className="space-y-2">
              <span className="font-display tracking-[0.25em] text-xs uppercase text-sage-dark font-medium">
                Curated Entries
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink-900 font-medium">
                Selected Moments
              </h2>
            </div>
            <Link
              href="/journey"
              className="inline-flex items-center gap-1.5 text-xs font-sans tracking-widest uppercase text-ink-600 hover:text-sage-dark font-medium"
            >
              View Full Timeline ({allDays.length} Days) <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {curatedMoments.map((day) => {
              if (!day) return null;
              const slugStr = getSlugString(day.slug);

              return (
                <Link
                  key={day._id}
                  href={`/story/${slugStr}`}
                  className="group flex flex-col space-y-3"
                >
                  <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-paper-200 border border-border-subtle group-hover:shadow-md transition-all">
                    {day.coverImageUrl ? (
                      <Image
                        src={day.coverImageUrl}
                        alt={day.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-paper-300 text-ink-400">
                        <Compass size={24} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="font-serif italic text-xs text-ink-500">
                      {day.date} · {day.location}
                    </span>
                    <h3 className="font-serif text-lg text-ink-900 group-hover:text-sage-dark transition-colors font-medium line-clamp-2">
                      {day.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>}
    </div>
  );
}
