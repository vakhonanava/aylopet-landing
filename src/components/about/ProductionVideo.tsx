"use client";

import Image from "next/image";
import { IMAGES } from "@/lib/images";

/**
 * Production process video · Natural Selection, Israel (unlisted YouTube).
 *
 * Plays as a muted, looping ambient clip · browsers only allow autoplay when
 * muted. youtube-nocookie keeps tracking cookies off the page.
 * NEXT_PUBLIC_PRODUCTION_VIDEO_URL overrides the embed; an empty value falls
 * back to the poster with a "coming soon" badge.
 */
const VIDEO_EMBED_URL =
  process.env.NEXT_PUBLIC_PRODUCTION_VIDEO_URL?.trim() ??
  "https://www.youtube-nocookie.com/embed/XyoMlAgdP-4";

/** YouTube only loops a single video when it is also passed as its own playlist. */
function loopingEmbedUrl(embedUrl: string): string {
  const url = new URL(embedUrl);
  const videoId = url.pathname.split("/").pop() ?? "";
  url.searchParams.set("autoplay", "1");
  url.searchParams.set("mute", "1");
  url.searchParams.set("loop", "1");
  url.searchParams.set("playlist", videoId);
  // iOS Safari refuses inline autoplay without it.
  url.searchParams.set("playsinline", "1");
  url.searchParams.set("rel", "0");
  return url.toString();
}

const COPY = {
  ka: {
    alt: "Natural Selection, წარმოების პროცესი ისრაელში",
    soon: "ვიდეო მალე დაემატება",
    caption: "Natural Selection, ისრაელი",
  },
  en: {
    alt: "Natural Selection production process in Israel",
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
  const c = COPY[locale];

  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-[var(--radius-bento)] border border-[var(--border-light)] shadow-[var(--shadow-diffuse)] ${className}`}
    >
      {VIDEO_EMBED_URL ? (
        <iframe
          title={c.alt}
          src={loopingEmbedUrl(VIDEO_EMBED_URL)}
          loading="lazy"
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
            <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand-primary)] backdrop-blur-sm">
              {c.soon}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-4 py-2 text-xs font-medium text-[var(--text-primary)] backdrop-blur-sm">
            {c.caption}
          </div>
        </>
      )}
    </div>
  );
}
