import type { Metadata } from "next";
import { Newsreader, Cinzel, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "The Journey — A Digital Travel Memoir",
  description:
    "A personal journey told chronologically through original diary writing, photographs, places, and experiences across the Netherlands, Belgium, Morocco, and Argentina.",
  openGraph: {
    title: "The Journey — A Digital Travel Memoir",
    description:
      "A personal travel diary told chronologically through original writing, photographs, and places.",
    images: ["/images/Netherland.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${cinzel.variable} ${outfit.variable}`}>
      <body className="min-h-screen flex flex-col bg-paper-100 text-ink-900 antialiased selection:bg-sage-light">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
