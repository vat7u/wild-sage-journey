import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

/** Minimal block shape accepted by <PortableText> (avoids importing the transitive @portabletext/types). */
type PortableTextBlock = Parameters<typeof PortableText>[0]["value"] extends infer V
  ? V extends readonly (infer B)[]
    ? B
    : V
  : never;
import { StoryBlock } from "@/lib/types";

const DROP_CAP =
  "first-letter:font-display first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:text-sage-dark first-letter:leading-none first-letter:pt-1";

/** Only allow ordinary web and mail links from the CMS. */
function safeHref(href: unknown): string | null {
  if (typeof href !== "string") return null;
  return /^(https?:|mailto:)/i.test(href.trim()) ? href.trim() : null;
}

const marks: PortableTextComponents["marks"] = {
  strong: ({ children }) => <strong className="font-semibold text-ink-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  link: ({ children, value }) => {
    const href = safeHref(value?.href);
    if (!href) return <>{children}</>;
    const external = /^https?:/i.test(href);
    return (
      <a
        href={href}
        className="text-sage-dark underline decoration-border-dark underline-offset-4 hover:text-ink-900"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
};

function isEmptyBlock(value: PortableTextBlock): boolean {
  const children = ((value as { children?: { text?: string }[] }).children || []) as { text?: string }[];
  return !children.some((c) => (c.text || "").trim());
}

interface PortableStoryProps {
  blocks: StoryBlock[];
}

/** Diary entry body: paragraphs (bold, italic, links) and inline photographs. */
export function PortableStory({ blocks }: PortableStoryProps) {
  if (!blocks || blocks.length === 0) return null;
  const firstBlockIsText = blocks[0]?._type === "block";

  const components: PortableTextComponents = {
    marks,
    block: {
      normal: ({ children, index, value }) => {
        if (isEmptyBlock(value)) return null;
        // Elegant drop cap on the opening paragraph only
        const isFirstPara = index === 0 && firstBlockIsText;
        return <p className={`max-w-2xl mx-auto font-serif ${isFirstPara ? DROP_CAP : ""}`}>{children}</p>;
      },
    },
    types: {
      image: ({ value }) => {
        const block = value as StoryBlock;
        if (!block.url) return null;
        const isFull = block.layout === "full";
        return (
          <figure className={`my-12 transition-all ${isFull ? "-mx-4 sm:-mx-8 md:-mx-16 lg:-mx-24" : "max-w-2xl mx-auto"}`}>
            <div
              className={`relative overflow-hidden rounded-sm bg-paper-200 border border-border-subtle shadow-sm ${
                isFull ? "aspect-[16/10] max-h-[640px]" : "aspect-[4/3] max-h-[500px]"
              }`}
            >
              <Image
                src={block.url}
                alt={block.alt || block.caption || "Travel photograph"}
                fill
                className="object-cover"
                sizes={isFull ? "(max-width: 1200px) 100vw, 1200px" : "(max-width: 768px) 100vw, 768px"}
              />
            </div>
            {block.caption && (
              <figcaption className="mt-3 text-center font-sans text-xs md:text-sm tracking-wide text-ink-500 italic max-w-md mx-auto">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      },
    },
  };

  return (
    <div className="space-y-8 font-serif text-ink-800 text-lg md:text-xl leading-[1.85] tracking-[0.01em]">
      <PortableText value={blocks as unknown as PortableTextBlock[]} components={components} />
    </div>
  );
}

interface RichTextProps {
  blocks: StoryBlock[] | undefined;
  /** Apply the decorative drop cap to the first paragraph */
  dropCap?: boolean;
}

/** Text-only rich text (paragraphs with bold, italic and links) for the About and Preparation pages. */
export function RichText({ blocks, dropCap = false }: RichTextProps) {
  if (!blocks || blocks.length === 0) return null;
  const components: PortableTextComponents = {
    marks,
    block: {
      normal: ({ children, index, value }) =>
        isEmptyBlock(value) ? null : <p className={dropCap && index === 0 ? DROP_CAP : undefined}>{children}</p>,
    },
    types: { image: () => null },
  };
  return <PortableText value={blocks as unknown as PortableTextBlock[]} components={components} />;
}
