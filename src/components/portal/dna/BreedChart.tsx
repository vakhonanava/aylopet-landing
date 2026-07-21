"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { BreedSegment } from "@/lib/dna/types";
import { motionEase } from "@/lib/motion";

interface BreedChartProps {
  segments: BreedSegment[];
}

const CHART_COLORS = ["#DF6A41", "#6B8E23", "#0D2E27", "#C4A882"] as const;

export function BreedChart({ segments }: BreedChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = segments.reduce((sum, s) => sum + s.percentage, 0);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const arcs = useMemo(() => {
    const dashes = segments.map((seg) => (seg.percentage / total) * circumference);
    const cumulative = dashes.map((_, i) =>
      dashes.slice(0, i).reduce((sum, dash) => sum + dash, 0),
    );

    return segments.map((seg, i) => ({
      seg,
      i,
      dash: dashes[i],
      dashOffset: -cumulative[i],
    }));
  }, [segments, total, circumference]);

  return (
    <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
          {arcs.map(({ seg, i, dash, dashOffset }) => {
            const isActive = activeIndex === i;

            return (
              <motion.circle
                key={seg.breed}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth={isActive ? 28 : 24}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: motionEase }}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              />
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-semibold text-[var(--forest-deep)]">
            {total.toFixed(1)}%
          </span>
          <span className="text-xs text-[var(--forest-deep)]/50">Ancestry</span>
        </div>
      </div>

      <ul className="w-full max-w-xs space-y-3">
        {segments.map((seg, i) => (
          <li
            key={seg.breed}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all duration-300 ${
              activeIndex === i
                ? "border-[var(--terracotta)]/40 bg-[var(--terracotta)]/5"
                : "border-[var(--oat-soft)] bg-white"
            }`}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="text-sm font-medium text-[var(--forest-deep)]">
                {seg.breed}
              </span>
            </div>
            <span className="font-display text-sm font-semibold tabular-nums text-[var(--forest-deep)]">
              {seg.percentage.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
