import Image from "next/image";
import Link from "next/link";
import { getSiteSettings, getAllDays, getSlugString } from "@/lib/sanity/client";
import { RichText } from "@/components/story/PortableStory";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Before the Journey (Preparation) — The Journey",
  description:
    "Preparing for a long journey across the Netherlands, Morocco, and Argentina. Packing, fears, museum passes, and anticipation.",
};

export default async function PreparationPage() {
  const [settings, allDays] = await Promise.all([getSiteSettings(), getAllDays()]);
  const firstDay = allDays[0];
  const [lead, ...rest] = settings.preparationText ?? [];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <p className="font-display tracking-[0.25em] text-xs uppercase text-sage-dark font-medium">
            Prologue · Before the Journey
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-ink-900">
            Preparation for This Trip!
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-ink-600 max-w-lg mx-auto">
            Thinking through packing for five months, anticipating what might happen, and finding ways to make the path easier.
          </p>
        </header>

        {/* Preparation photograph from Site Settings */}
        {settings.preparationImageUrl && (
          <figure className="relative aspect-[16/10] w-full max-h-[500px] rounded-sm overflow-hidden bg-paper-200 border border-border-subtle shadow-sm">
            <Image
              src={settings.preparationImageUrl}
              alt={settings.preparationImageAlt || "Preparation for this trip"}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 800px) 100vw, 800px"
            />
          </figure>
        )}

        {/* Text from Site Settings: first paragraph as the opening, the rest indented */}
        <div className="font-serif text-ink-800 text-lg md:text-xl leading-[1.85] space-y-6 pt-4 border-t border-border-subtle">
          {lead && <RichText blocks={[lead]} dropCap />}

          {rest.length > 0 && (
            <div className="my-8 pl-6 border-l-2 border-sage space-y-5 font-serif text-ink-800">
              <RichText blocks={rest} />
            </div>
          )}
        </div>

        {/* Begin Journey Action */}
        {firstDay && (
          <div className="pt-12 text-center border-t border-border-subtle">
            <Link
              href={`/story/${getSlugString(firstDay.slug)}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sage text-white font-sans text-xs tracking-widest uppercase hover:bg-sage-dark transition-all shadow-sm hover:shadow"
            >
              Begin the Journey · Day 01 <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </article>
    </div>
  );
}
