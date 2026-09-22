import Image from "next/image";
import Link from "next/link";
import { getSiteSettings, getAllDays, getSlugString } from "@/lib/sanity/client";
import { ArrowRight, Luggage, MapPin, Compass } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Before the Journey (Preparation) — The Journey",
  description:
    "Preparing for a five-month journey across the Netherlands, Morocco, and Argentina. Packing, fears, museum passes, and anticipation.",
};

export default async function PreparationPage() {
  const settings = await getSiteSettings();
  const allDays = await getAllDays();
  const firstDay = allDays[0];
  const firstDaySlug = firstDay ? getSlugString(firstDay.slug) : "arrived-in-amsterdam";

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

        {/* Preparation photograph */}
        <figure className="relative aspect-[16/10] w-full max-h-[500px] rounded-sm overflow-hidden bg-paper-200 border border-border-subtle shadow-sm">
          <Image
            src="/images/Preparation%20for%20this%20trip!.jpg"
            alt="Preparation for this trip - packing and travel gear"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 800px) 100vw, 800px"
          />
        </figure>

        {/* Verbatim text formatted as a memoir prologue */}
        <div className="font-serif text-ink-800 text-lg md:text-xl leading-[1.85] space-y-6 pt-4 border-t border-border-subtle">
          <p className="first-letter:font-display first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:text-sage-dark first-letter:leading-none first-letter:pt-1">
            To go on this trip I tried to think of all the things that I needed, what I was most afraid could happen and how to make things easier.
          </p>

          <div className="my-8 pl-6 border-l-2 border-sage space-y-5 font-serif text-ink-800">
            <p>
              Luggage (suitcase, carry on that is also a backpack), crossbody bag and RFid pouch around my neck to hold credit cards and passport, clothes for the right weather, journal, shoes that were weather appropriate.
            </p>

            <p>
              Places to stay, plane tickets making sure that when I landed the time was in enough daylight to find the place I&apos;m staying, directions to the airbnb so I don&apos;t look like a tourist.
            </p>

            <p>
              Packing clothes for 5 months with layers since it will be 50&apos;s in the Netherlands, 90&apos;s in Morocco and back to 50&apos;s in Argentina. Started looking for ways to save money. In the Netherlands you can purchase a pass that is good for a year and for one price you can get into over 500 museums. You can also purchase a month long pass to ride all trains, metro and buses in Amsterdam for one price. For a short time period you can get a City Card for 7 days of attractions and transportation.
            </p>
          </div>
        </div>

        {/* Begin Journey Action */}
        <div className="pt-12 text-center border-t border-border-subtle">
          <Link
            href={`/story/${firstDaySlug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sage text-white font-sans text-xs tracking-widest uppercase hover:bg-sage-dark transition-all shadow-sm hover:shadow"
          >
            Begin the Journey · Day 01 <ArrowRight size={14} />
          </Link>
        </div>
      </article>
    </div>
  );
}
