"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Compass } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Primary navigation as specified by user
  const navItems = [
    { label: "Story", href: "/journey" },
    { label: "Places", href: "/places" },
    { label: "Photographs", href: "/photographs" },
    { label: "Practices", href: "/practices" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-paper-100/90 backdrop-blur-md border-b border-border-subtle transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Book Title / Logo */}
        <Link
          href="/"
          className="group flex flex-col items-start focus:outline-none"
        >
          <span className="font-display tracking-[0.25em] text-sm sm:text-base font-semibold text-ink-900 group-hover:text-sage-dark transition-colors uppercase">
            The Journey
          </span>
          <span className="font-serif italic text-xs text-ink-500 tracking-wider">
            A Digital Memoir
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative font-sans text-xs tracking-[0.15em] uppercase transition-colors py-1 ${
                  isActive
                    ? "text-sage-dark font-medium"
                    : "text-ink-600 hover:text-ink-900"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-sage rounded-full" />
                )}
              </Link>
            );
          })}

          <Link
            href="/preparation"
            className="hidden lg:inline-flex items-center text-xs font-sans tracking-[0.12em] uppercase text-ink-500 hover:text-ink-800 transition-colors pl-4 border-l border-border-medium"
            title="Before the journey"
          >
            Preparation
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-ink-700 hover:text-ink-900 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border-subtle bg-paper-50 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-sans text-sm tracking-[0.15em] uppercase py-2 transition-colors ${
                    isActive
                      ? "text-sage-dark font-medium"
                      : "text-ink-600 hover:text-ink-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/preparation"
              onClick={() => setMobileMenuOpen(false)}
              className="font-sans text-sm tracking-[0.15em] uppercase py-2 text-ink-500 hover:text-ink-900 transition-colors border-t border-border-subtle pt-3"
            >
              Preparation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
