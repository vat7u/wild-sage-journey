import Image from "next/image";
import Link from "next/link";
import { getAllPractices, getSlugString } from "@/lib/sanity/client";
import { Sparkles, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The 8 Practices — The Journey",
  description:
    "An alternative lens through which to explore the journey, tracing eight intentional practices woven through seventy days of travel.",
};

export default async function PracticesPage() {
  const practices = await getAllPractices();

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        <header className="text-center space-y-4 max-w-2xl mx-auto">
          <p className="font-display tracking-[0.25em] text-xs uppercase text-sage-dark font-medium">
            A Secondary Lens
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-ink-900">
            The 8 Practices
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-ink-600">
            Eight mindful touchstones discovered and cultivated across the journey. Explore the diary entries connected to each theme.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {practices.map((practice) => {
            const slugStr = getSlugString(practice.slug);
            const orderStr = practice.order < 10 ? `0${practice.order}` : `${practice.order}`;

            return (
              <Link
                key={practice._id}
                href={`/practices/${slugStr}`}
                className="group flex flex-col rounded-sm bg-paper-50 hover:bg-paper-200/80 border border-border-subtle hover:border-border-medium transition-all duration-300 shadow-sm overflow-hidden"
              >
                {practice.imageUrl && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-200">
                    <Image
                      src={practice.imageUrl}
                      alt={practice.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-terracotta font-semibold">
                      Practice {orderStr}
                    </span>
                    <h2 className="font-serif text-xl text-ink-900 group-hover:text-sage-dark transition-colors font-medium">
                      {practice.title}
                    </h2>
                  </div>

                  <span className="inline-flex items-center gap-1 font-sans text-xs uppercase tracking-widest text-sage-dark font-medium group-hover:translate-x-0.5 transition-transform">
                    Explore Moments <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
