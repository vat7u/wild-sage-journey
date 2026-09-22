import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — The Journey",
  description:
    "A personal journey pursuing certification as a wellness coach through five months of travel across three continents.",
};

export default function AboutPage() {
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

        {/* Verbatim narrative text from About.md */}
        <div className="font-serif text-ink-800 text-lg md:text-xl leading-[1.9] space-y-8 pt-6 border-t border-border-subtle">
          <p className="first-letter:font-display first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:text-sage-dark first-letter:leading-none first-letter:pt-1">
            I was born in Pennsylvania and lived there until I was 8 years old. I lived near my grandparents and lots of cousins. My fondest memories are times with family. At age 8 my family moved to New York. Every year we would go back to PA for Christmas and the whole family would gather in my grandparents tiny house. The rest of the week we would travel around to other Aunt and Uncles celebrating all week. To this day Christmas is my favorite time of year.
          </p>

          <p>
            I have had many careers from working in medical manufacturing, school aide and librarian to health and wellness retail. I am a lifelong learner which inspired me to go back to school and graduate with a B.S. in Alternative Medicine. During that time I decided I wanted to pursue wellness coaching.
          </p>

          <p>
            While working on that career change I am taking a journey and pursuing certification as a wellness coach. This site will follow that journey.
          </p>
        </div>

        {/* Subtle Call to Journey */}
        <div className="pt-12 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-display tracking-[0.18em] text-xs uppercase text-ink-900 font-semibold">
              Explore the Travel Memoir
            </h3>
            <p className="font-serif italic text-sm text-ink-500">
              Read seventy days of original diary entries and photography.
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
