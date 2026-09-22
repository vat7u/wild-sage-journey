import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDayBySlug, getAllDays, getSlugString } from "@/lib/sanity/client";
import { PortableStory } from "@/components/story/PortableStory";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Sparkles } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const days = await getAllDays();
  return days.map((day) => ({
    slug: getSlugString(day.slug),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getDayBySlug(slug);
  if (!data) return { title: "Day Not Found — The Journey" };

  return {
    title: `${data.day.title} — The Journey`,
    description: `Day ${data.day.dayNumber}: ${data.day.date} · ${data.day.location}, ${data.day.country}.`,
    openGraph: {
      title: `${data.day.title} — The Journey`,
      description: `${data.day.date} · ${data.day.location}, ${data.day.country}`,
      images: data.day.coverImageUrl ? [data.day.coverImageUrl] : [],
    },
  };
}

export default async function DayPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getDayBySlug(slug);

  if (!data) {
    notFound();
  }

  const { day, prevDay, nextDay } = data;
  const dayNumberStr = day.dayNumber < 10 ? `0${day.dayNumber}` : `${day.dayNumber}`;

  return (
    <article className="min-h-screen pb-24 pt-8 sm:pt-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Breadcrumb / Stage Navigation */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-border-subtle font-sans text-xs tracking-[0.15em] uppercase text-ink-500">
          <Link
            href="/journey"
            className="hover:text-sage-dark transition-colors inline-flex items-center gap-1"
          >
            <ChevronLeft size={14} /> Back to Timeline
          </Link>
          <span>Day {dayNumberStr}</span>
        </div>

        {/* Header Metadata */}
        <header className="text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center space-x-2 text-xs font-sans tracking-[0.2em] uppercase text-ink-500">
            <span className="flex items-center gap-1">
              <Calendar size={13} className="text-sage" /> {day.date}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-terracotta" /> {day.location}
              {day.country ? ` · ${day.country}` : ""}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-ink-900 leading-[1.2] max-w-2xl mx-auto">
            {day.title}
          </h1>

          {/* Connected Practices badges */}
          {day.practiceSlugs && day.practiceSlugs.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              {day.practiceSlugs.map((pSlug) => {
                const label = pSlug.replace(/-/g, " ");
                return (
                  <Link
                    key={pSlug}
                    href={`/practices/${pSlug}`}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-sans tracking-wider uppercase bg-sage-light text-sage-dark hover:bg-sage/20 transition-colors"
                  >
                    <Sparkles size={10} />
                    {label}
                  </Link>
                );
              })}
            </div>
          )}
        </header>

        {/* Hero Photograph (if present) */}
        {day.coverImageUrl && (
          <figure className="mb-14 -mx-4 sm:-mx-6 md:-mx-10">
            <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full max-h-[580px] overflow-hidden rounded-sm bg-paper-200 border border-border-subtle shadow-sm">
              <Image
                src={day.coverImageUrl}
                alt={day.coverImageCaption || day.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
            {day.coverImageCaption && (
              <figcaption className="mt-3 text-center font-sans text-xs tracking-wider text-ink-500 italic">
                {day.coverImageCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Diary Story Body with Portable Text and Interspersed Photos */}
        <div className="my-10">
          <PortableStory blocks={day.story} />
        </div>

        {/* Additional Gallery Photos (if any not already inline) */}
        {day.gallery && day.gallery.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border-subtle">
            <h2 className="font-display tracking-[0.2em] text-xs uppercase text-ink-500 text-center mb-8">
              Additional Moments from this Day
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {day.gallery.map((g, idx) => (
                <figure key={idx} className="space-y-2">
                  <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-paper-200 border border-border-subtle">
                    <Image
                      src={g.url}
                      alt={g.caption || `${day.title} moment`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  {g.caption && (
                    <figcaption className="font-sans text-xs text-ink-500 italic text-center">
                      {g.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Previous / Next Day Editorial Navigation */}
        <nav className="mt-20 pt-10 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
          {prevDay ? (
            <Link
              href={`/story/${getSlugString(prevDay.slug)}`}
              className="group flex flex-col items-start max-w-[280px] text-left hover:text-sage-dark transition-colors"
            >
              <span className="inline-flex items-center gap-1 font-sans text-xs tracking-[0.18em] uppercase text-ink-400 group-hover:text-sage-dark">
                <ChevronLeft size={14} /> Previous Day
              </span>
              <span className="font-serif text-base text-ink-800 group-hover:text-sage-dark line-clamp-1 mt-1">
                {prevDay.title}
              </span>
              <span className="font-sans text-xs text-ink-400">{prevDay.date}</span>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          <Link
            href="/journey"
            className="font-display text-xs tracking-[0.2em] uppercase text-ink-500 hover:text-ink-900 border-b border-border-medium pb-1"
          >
            All Days
          </Link>

          {nextDay ? (
            <Link
              href={`/story/${getSlugString(nextDay.slug)}`}
              className="group flex flex-col items-end max-w-[280px] text-right hover:text-sage-dark transition-colors"
            >
              <span className="inline-flex items-center gap-1 font-sans text-xs tracking-[0.18em] uppercase text-ink-400 group-hover:text-sage-dark">
                Next Day <ChevronRight size={14} />
              </span>
              <span className="font-serif text-base text-ink-800 group-hover:text-sage-dark line-clamp-1 mt-1">
                {nextDay.title}
              </span>
              <span className="font-sans text-xs text-ink-400">{nextDay.date}</span>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
        </nav>
      </div>
    </article>
  );
}
