"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface FooterChapter {
  title: string;
  slug: string;
  order: number;
  isInterlude: boolean;
}

interface FooterProps {
  siteTitle: string;
  footerText?: string;
  dateRange?: string;
  footerQuote?: string;
  chapters: FooterChapter[];
}

/** Chapter titles are stored as e.g. "Chapter 01 — Morocco"; the footer lists them as "01 — Morocco". */
function chapterLabel(c: FooterChapter): string {
  return c.title.replace(/^Chapter\s+/i, "");
}

export function Footer({ siteTitle, footerText, dateRange, footerQuote, chapters }: FooterProps) {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <footer className="border-t border-border-subtle bg-paper-50 mt-24 py-16 text-ink-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-border-subtle">
          {/* Column 1: Book identity */}
          <div className="space-y-3">
            <h3 className="font-display tracking-[0.2em] text-xs uppercase text-ink-900 font-semibold">
              {siteTitle}
            </h3>
            {footerText && (
              <p className="font-serif italic text-sm text-ink-600 max-w-sm leading-relaxed">{footerText}</p>
            )}
            {dateRange && <p className="font-sans text-xs tracking-wider text-ink-400">{dateRange}</p>}
          </div>

          {/* Column 2: Chapters */}
          <div className="space-y-3">
            <h4 className="font-display tracking-[0.18em] text-xs uppercase text-ink-900 font-semibold">
              Chapters & Stages
            </h4>
            <ul className="space-y-2 font-serif text-sm">
              {chapters.map((c) => (
                <li key={c.slug}>
                  <Link href={`/journey/${c.slug}`} className="hover:text-sage-dark transition-colors">
                    {chapterLabel(c)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Secondary Links */}
          <div className="space-y-3">
            <h4 className="font-display tracking-[0.18em] text-xs uppercase text-ink-900 font-semibold">
              Exploration
            </h4>
            <ul className="space-y-2 font-serif text-sm">
              <li>
                <Link href="/preparation" className="hover:text-sage-dark transition-colors">
                  Before the Journey (Preparation)
                </Link>
              </li>
              <li>
                <Link href="/practices" className="hover:text-sage-dark transition-colors">
                  The 8 Practices
                </Link>
              </li>
              <li>
                <Link href="/places" className="hover:text-sage-dark transition-colors">
                  Journey Map & Coordinates
                </Link>
              </li>
              <li>
                <Link href="/photographs" className="hover:text-sage-dark transition-colors">
                  Visual Archive
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sage-dark transition-colors">
                  About the Author
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/studio"
                  className="inline-flex items-center text-xs font-sans tracking-widest uppercase text-sage-dark hover:underline"
                >
                  Sanity Studio →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-ink-400 space-y-3 sm:space-y-0">
          <p>© {new Date().getFullYear()} {siteTitle}. All authentic diary writings and photographs preserved.</p>
          {footerQuote && <p className="italic font-serif">&ldquo;{footerQuote}&rdquo;</p>}
        </div>
      </div>
    </footer>
  );
}
