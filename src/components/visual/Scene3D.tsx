"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTilt } from "@/hooks/useTilt";
import { resolveImage } from "@/lib/images";
import { FloatingOrb, ScenePedestal } from "@/components/visual/FloatingOrb";

interface Scene3DProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  aspect?: "square" | "portrait" | "landscape" | "hero" | "fill";
  tilt?: boolean;
  float?: boolean;
  decorative?: boolean;
  overlay?: React.ReactNode;
  glow?: "sage" | "terracotta" | "forest";
  /** "contain" for transparent cutouts that must not be cropped. */
  fit?: "cover" | "contain";
}

const aspectClasses = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  hero: "aspect-[5/4] sm:aspect-[4/3]",
  fill: "aspect-[4/5] h-full min-h-[320px] w-full max-h-full",
} as const;

const glowColors = {
  sage: "var(--brand-accent)",
  terracotta: "var(--terracotta)",
  forest: "var(--forest-deep)",
} as const;

export function Scene3D({
  src,
  alt,
  priority,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  className = "",
  aspect = "landscape",
  tilt = true,
  float = true,
  decorative = true,
  overlay,
  glow = "sage",
  fit = "cover",
}: Scene3DProps) {
  const imageSrc = resolveImage(src);
  const { ref, style, onMouseMove, onMouseLeave } = useTilt(10);

  return (
    <div
      className={`scene-3d-root relative h-full min-h-[280px] w-full ${className}`}
      style={{ perspective: "1400px" }}
    >
      {decorative && (
        <>
          <FloatingOrb
            className="-left-6 top-8 opacity-60"
            color={glowColors[glow]}
            size="140px"
            delay={0}
          />
          <FloatingOrb
            className="-right-4 bottom-12 opacity-50"
            color="var(--terracotta)"
            size="100px"
            delay={1.2}
          />
        </>
      )}

      <motion.div
        ref={tilt ? ref : undefined}
        style={tilt ? style : undefined}
        onMouseMove={tilt ? onMouseMove : undefined}
        onMouseLeave={tilt ? onMouseLeave : undefined}
        animate={float ? { y: [0, -10, 0] } : undefined}
        transition={
          float
            ? { duration: 6, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }
            : undefined
        }
        className={`relative ${aspect === "fill" ? "flex h-full min-h-[320px] w-full flex-col" : ""}`}
      >
        <div
          className={`scene-3d-card relative overflow-hidden rounded-[var(--radius-bento)] border border-white/60 bg-white shadow-[0_24px_64px_rgba(13,46,39,0.14),0_8px_24px_rgba(13,46,39,0.08)] ${aspectClasses[aspect]} ${aspect === "fill" ? "flex-1" : ""}`}
          style={{ transform: "translateZ(24px)" }}
        >
          <Image
            src={imageSrc}
            alt={alt}
            fill
            sizes={sizes}
            className={fit === "contain" ? "object-contain p-5" : "object-cover"}
            priority={priority}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[var(--forest-deep)]/25 via-transparent to-white/20" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/30" />
          {overlay}
        </div>

        <ScenePedestal className={`bottom-[-8%] w-full ${decorative ? "" : "hidden"}`} />

        {decorative && (
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] opacity-60"
            style={{
              background:
                "linear-gradient(145deg, rgba(107,143,113,0.15), rgba(223,106,65,0.08))",
              filter: "blur(24px)",
              transform: "translateZ(-20px)",
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
