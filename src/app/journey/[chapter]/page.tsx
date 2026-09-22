import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getChapterBySlug, getAllChapters, getDaysByChapter, getSlugString } from "@/lib/sanity/client";
import { ChevronLeft, MapPin, Calendar } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ chapter: string }>;
}

export async function generateStaticParams() {
  const chapters = await getAllChapters();
  return chapters.map((c) => ({
    chapter: getSlugString(c.slug),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapter } = await params;
  const chap = await getChapterBySlug(chapter);
  if (!chap) return { title: "Chapter Not Found — The Journey" };

  return {
    title: `${chap.title} — The Journey`,
    description: chap.description,
    openGraph: {
      title: chap.title,
      description: chap.description,
      images: chap.imageUrl ? [chap.imageUrl] : [],
    },
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { chapter } = await params;
  const chap = await getChapterBySlug(chapter);

  if (!chap) {
    notFound();
  }

  const days = await getDaysByChapter(getSlugString(chap.slug));

  return (
    <div className="min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/journey"
            className="inline-flex items-center gap-1 font-sans text-xs tracking-widest uppercase text-ink-500 hover:text-sage-dark transition-colors"
          >
            <ChevronLeft size={14} /> Full Journey Timeline
          </Link>
        </div>

        {/* Chapter Header */}
        <header className="space-y-4 mb-12 text-center">
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-terracotta font-semibold">
            {chap.type === "interlude" ? "Interlude" : `Chapter 0${chap.order}`} · {chap.dateRange}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-ink-900">
            {chap.title}
          </h1>
          <p className="font-serif italic text-lg text-ink-600 max-w-2xl mx-auto">
            {chap.description}
          </p>
        </header>

        {/* Hero Image */}
        {chap.imageUrl && (
          <div className="relative aspect-[16/9] w-full max-h-[520px] rounded-sm overflow-hidden mb-16 bg-paper-200 border border-border-subtle shadow-sm">
            <Image
              src={chap.imageUrl}
              alt={chap.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )}

        {/* Days List in this Chapter */}
        <section className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <h2 className="font-display tracking-[0.2em] text-xs uppercase text-ink-500">
              Entries in this Stage ({days.length} Days)
            </h2>
          </div>

          <div className="space-y-4">
            {days.map((day) => {
              const slugStr = getSlugString(day.slug);
              const dayNumberStr = day.dayNumber < 10 ? `0${day.dayNumber}` : `${day.dayNumber}`;

              return (
                <Link
                  key={day._id}
                  href={`/story/${slugStr}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-sm bg-paper-50 hover:bg-paper-200/70 border border-border-subtle hover:border-border-medium transition-all shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-sans text-xs tracking-wider uppercase text-sage-dark font-semibold">
                        Day {dayNumberStr}
                      </span>
                      <span className="font-serif italic text-xs text-ink-500">
                        {day.date}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl text-ink-900 group-hover:text-sage-dark transition-colors font-medium">
                      {day.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-sans text-xs text-ink-400">
                      <MapPin size={12} className="text-terracotta" />
                      {day.location}
                    </span>

                    {day.coverImageUrl && (
                      <div className="relative w-16 h-12 rounded overflow-hidden border border-border-subtle flex-shrink-0">
                        <Image
                          src={day.coverImageUrl}
                          alt={day.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
