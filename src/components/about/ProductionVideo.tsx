"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";
import { IMAGES } from "@/lib/images";

/**
 * Production process video · Natural Selection, Israel.
 *
 * Set NEXT_PUBLIC_PRODUCTION_VIDEO_URL to an embeddable player URL
 * (e.g. https://www.youtube.com/embed/<id>) to activate playback. Without it
 * the poster renders without a play affordance rather than a dead button.
 */
const VIDEO_EMBED_URL = process.env.NEXT_PUBLIC_PRODUCTION_VIDEO_URL ?? "";

const COPY = {
  ka: {
    alt: "Natural Selection, წარმოების პროცესი ისრაელში",
    play: "წარმოების ვიდეოს ჩართვა",
    soon: "ვიდეო მალე დაემატება",
    caption: "Natural Selection, ისრაელი",
  },
  en: {
    alt: "Natural Selection production process in Israel",
    play: "Play the production video",
    soon: "Video coming soon",
    caption: "Natural Selection, Israel",
  },
} as const;

export function ProductionVideo({
  locale = "ka",
  className = "",
}: {
  locale?: "ka" | "en";
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const c = COPY[locale];
  const hasVideo = VIDEO_EMBED_URL.length > 0;

  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-[var(--radius-bento)] border border-[var(--border-light)] shadow-[var(--shadow-diffuse)] ${className}`}
    >
      {playing && hasVideo ? (
        <iframe
          title={c.alt}
          src={`${VIDEO_EMBED_URL}${VIDEO_EMBED_URL.includes("?") ? "&" : "?"}autoplay=1&rel=0`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <Image
            src={IMAGES.production}
            alt={c.alt}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--brand-primary)]/30 backdrop-blur-[2px]">
            {hasVideo ? (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={c.play}
                className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[var(--brand-primary)] shadow-soft transition-transform hover:scale-105 active:scale-95"
              >
                <Play className="ml-1 h-7 w-7" fill="currentColor" />
              </button>
            ) : (
              <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand-primary)] backdrop-blur-sm">
                {c.soon}
              </span>
            )}
          </div>
          <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-4 py-2 text-xs font-medium text-[var(--text-primary)] backdrop-blur-sm">
            {c.caption}
          </div>
        </>
      )}
    </div>
  );
}
