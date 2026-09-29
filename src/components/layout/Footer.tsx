"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
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
              The Journey
            </h3>
            <p className="font-serif italic text-sm text-ink-600 max-w-sm leading-relaxed">
              A personal travel memoir recorded chronologically across seventy days through original writing, photographs, and mindful contemplation.
            </p>
            <p className="font-sans text-xs tracking-wider text-ink-400">
              March 21 – August 18, 2026
            </p>
          </div>

          {/* Column 2: Chapters */}
          <div className="space-y-3">
            <h4 className="font-display tracking-[0.18em] text-xs uppercase text-ink-900 font-semibold">
              Chapters & Stages
            </h4>
            <ul className="space-y-2 font-serif text-sm">
              <li>
                <Link
                  href="/journey/netherlands-belgium"
                  className="hover:text-sage-dark transition-colors"
                >
                  01 — The Netherlands & Belgium
                </Link>
              </li>
              <li>
                <Link
                  href="/journey/morocco"
                  className="hover:text-sage-dark transition-colors"
                >
                  02 — Morocco
                </Link>
              </li>
              <li>
                <Link
                  href="/journey/orlando-interlude"
                  className="hover:text-sage-dark transition-colors"
                >
                  Interlude — Orlando, Florida
                </Link>
              </li>
              <li>
                <Link
                  href="/journey/argentina"
                  className="hover:text-sage-dark transition-colors"
                >
                  03 — Argentina
                </Link>
              </li>
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
          <p>© 2026 The Journey. All authentic diary writings and photographs preserved.</p>
          <p className="italic font-serif">"Every cup has a story."</p>
        </div>
      </div>
    </footer>
  );
}
