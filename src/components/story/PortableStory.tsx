import Image from "next/image";
import { StoryBlock } from "@/lib/types";

interface PortableStoryProps {
  blocks: StoryBlock[];
}

export function PortableStory({ blocks }: PortableStoryProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-8 font-serif text-ink-800 text-lg md:text-xl leading-[1.85] tracking-[0.01em]">
      {blocks.map((block, idx) => {
        if (block._type === "image" && block.url) {
          const isFull = block.layout === "full";
          return (
            <figure
              key={block._key || `img-${idx}`}
              className={`my-12 transition-all ${
                isFull
                  ? "-mx-4 sm:-mx-8 md:-mx-16 lg:-mx-24"
                  : "max-w-2xl mx-auto"
              }`}
            >
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
        }

        if (block._type === "block") {
          const text = block.children?.map((c) => c.text).join("") || "";
          if (!text.trim()) return null;

          // Check if first paragraph to add an elegant subtle drop cap or emphasis
          const isFirstPara = idx === 0;

          return (
            <p
              key={block._key || `p-${idx}`}
              className={`max-w-2xl mx-auto font-serif ${
                isFirstPara
                  ? "first-letter:font-display first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:text-sage-dark first-letter:leading-none first-letter:pt-1"
                  : ""
              }`}
            >
              {text}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}
