import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getAllDays, getSiteSettings } from "@/lib/sanity/client";
import { RichText } from "@/components/story/PortableStory";

export const metadata: Metadata = {
  title: "About — The Journey",
  description:
    "A personal journey pursuing certification as a wellness coach through travel across three continents.",
};

export default async function AboutPage() {
  const [settings, days] = await Promise.all([getSiteSettings(), getAllDays()]);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <p className="font-display tracking-[0.25em] text-xs uppercase text-sage-dark font-medium">
            Personal Memoir
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-ink-900">
            About Me
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-ink-600 max-w-lg mx-auto">
            Lifelong learner, student of alternative medicine, and traveller on the path toward wellness coaching.
          </p>
        </header>

        {/* Narrative text from Site Settings → About Me */}
        <div className="font-serif text-ink-800 text-lg md:text-xl leading-[1.9] space-y-8 pt-6 border-t border-border-subtle">
          <RichText blocks={settings.aboutText} dropCap />
        </div>

        {/* Subtle Call to Journey */}
        <div className="pt-12 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-display tracking-[0.18em] text-xs uppercase text-ink-900 font-semibold">
              Explore the Travel Memoir
            </h3>
            <p className="font-serif italic text-sm text-ink-500">
              Read {days.length} original diary entries and photography.
            </p>
          </div>

          <Link
            href="/journey"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sage text-white font-sans text-xs tracking-widest uppercase hover:bg-sage-dark transition-all shadow-sm"
          >
            Enter the Journey <ArrowRight size={14} />
          </Link>
        </div>
      </article>
    </div>
  );
}
