"use client";

/**
 * DnaSection · scroll-driven DNA Journey visual (helix + data stream).
 * Animation logic lives in DnaHelix3D / DnaDataStream; this wraps layout.
 */

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { DnaHelixScrollCanvas } from "@/components/visual/DnaHelixScrollCanvas";

export interface DnaSectionProps {
  /** Controlled progress 0 to 1. If omitted, drives from own scroll container. */
  progress?: number | MotionValue<number>;
  badge?: string;
  className?: string;
  interactive?: boolean;
  /** When true, section is tall and sticky for self-contained scroll storytelling */
  selfScroll?: boolean;
  children?: React.ReactNode;
}

export function DnaSection({
  progress: progressProp,
  badge,
  className = "",
  interactive = true,
  selfScroll = false,
  children,
}: DnaSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const internalProgress = useTransform(
    scrollYProgress,
    [0, 0.1, 0.5, 0.9, 1],
    [0.05, 0.2, 0.55, 0.9, 1],
    { clamp: true },
  );

  const progress = progressProp ?? internalProgress;

  if (selfScroll) {
    return (
      <section
        ref={ref}
        className={`relative bg-[#030b12] ${className}`}
        style={{ height: "280vh" }}
      >
        <div className="sticky top-0 flex h-screen items-center justify-center px-6">
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem] border border-cyan-500/20 shadow-[0_0_60px_rgba(34,211,238,0.12)]">
              <DnaHelixScrollCanvas progress={progress} interactive={interactive} />
              {badge && (
                <div className="absolute bottom-4 left-4 z-10 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-xs font-medium text-cyan-50 backdrop-blur-md">
                  {badge}
                </div>
              )}
            </div>
            <div className="text-cyan-50">{children}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[2rem] border border-cyan-500/20 bg-[#030b12] shadow-[0_0_50px_rgba(34,211,238,0.1)] ${className}`}
    >
      <DnaHelixScrollCanvas progress={progress} interactive={interactive} />
      {badge && (
        <div className="absolute bottom-4 left-4 z-10 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-xs font-medium text-cyan-50 backdrop-blur-md">
          {badge}
        </div>
      )}
      {children}
    </div>
  );
}
