import type { Metadata } from "next";
import { Newsreader, Cinzel, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAllChapters, getSiteSettings, getSlugString } from "@/lib/sanity/client";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wild-sage-journey.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = `${settings.siteTitle} — A Digital Travel Memoir`;
  const description = settings.subtitle || undefined;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      title,
      description,
      images: settings.heroImageUrl ? [settings.heroImageUrl] : [],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, chapters] = await Promise.all([getSiteSettings(), getAllChapters()]);
  const footerChapters = chapters.map((c) => ({
    title: c.title,
    slug: getSlugString(c.slug),
    order: c.order,
    isInterlude: c.type === "interlude",
  }));

  return (
    <html lang="en" className={`${newsreader.variable} ${cinzel.variable} ${outfit.variable}`}>
      <body className="min-h-screen flex flex-col bg-paper-100 text-ink-900 antialiased selection:bg-sage-light">
        <Navbar siteTitle={settings.siteTitle} />
        <main className="flex-1">{children}</main>
        <Footer
          siteTitle={settings.siteTitle}
          footerText={settings.footerText}
          dateRange={settings.dateRange}
          footerQuote={settings.footerQuote}
          chapters={footerChapters}
        />
      </body>
    </html>
  );
}
