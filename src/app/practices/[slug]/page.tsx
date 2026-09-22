import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPracticeBySlug, getAllPractices, getSlugString } from "@/lib/sanity/client";
import { ChevronLeft, MapPin, Calendar, Sparkles, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const practices = await getAllPractices();
  return practices.map((p) => ({
    slug: getSlugString(p.slug),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPracticeBySlug(slug);
  if (!data) return { title: "Practice Not Found — The Journey" };

  return {
    title: `${data.practice.title} — The 8 Practices`,
    description: `Moments and diary entries reflecting '${data.practice.title}' throughout the journey.`,
  };
}

export default async function PracticeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPracticeBySlug(slug);

  if (!data) {
    notFound();
  }

  const { practice, days } = data;
  const orderStr = practice.order < 10 ? `0${practice.order}` : `${practice.order}`;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Back navigation */}
        <div>
          <Link
            href="/practices"
            className="inline-flex items-center gap-1 font-sans text-xs tracking-widest uppercase text-ink-500 hover:text-sage-dark transition-colors"
          >
            <ChevronLeft size={14} /> Back to All Practices
          </Link>
        </div>

        {/* Practice Header */}
        <header className="space-y-6 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans tracking-[0.2em] uppercase bg-sage-light text-sage-dark font-medium">
            <Sparkles size={12} /> Practice {orderStr}
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-ink-900">
            {practice.title}
          </h1>

          <p className="font-serif italic text-lg text-ink-600">
            {practice.description}
          </p>
        </header>

        {/* Practice Photo */}
        {practice.imageUrl && (
          <div className="relative aspect-[16/9] max-h-[480px] w-full rounded-sm overflow-hidden bg-paper-200 border border-border-subtle shadow-sm">
            <Image
              src={practice.imageUrl}
              alt={practice.title}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )}

        {/* Related Days Section */}
        <section className="space-y-8 pt-8 border-t border-border-subtle">
          <div className="flex items-center justify-between pb-4">
            <h2 className="font-display tracking-[0.2em] text-xs uppercase text-ink-500">
              Related Moments & Diary Entries ({days.length})
            </h2>
          </div>

          {days.length === 0 ? (
            <p className="font-serif italic text-ink-500 py-8 text-center">
              No specific entries tagged to this practice yet.
            </p>
          ) : (
            <div className="space-y-4">
              {days.map((day) => {
                const daySlug = getSlugString(day.slug);
                const dayNumberStr = day.dayNumber < 10 ? `0${day.dayNumber}` : `${day.dayNumber}`;

                return (
                  <Link
                    key={day._id}
                    href={`/story/${daySlug}`}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-sm bg-paper-50 hover:bg-paper-200/80 border border-border-subtle hover:border-border-medium transition-all shadow-sm"
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
          )}
        </section>
      </div>
    </div>
  );
}
