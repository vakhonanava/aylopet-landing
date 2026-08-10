"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { AncestrySegment } from "@/lib/pet-history/types";

/** Brand-palette sequence; wraps if a profile has more segments than colours. */
const SEGMENT_COLORS = [
  "#3a5a40",
  "#6b8f71",
  "#c67b5c",
  "#a8c0ad",
  "#0d2e27",
  "#d4c4a8",
  "#8a9a8d",
];

export function AncestryChart({ segments }: { segments: AncestrySegment[] }) {
  const reduceMotion = useReducedMotion();
  const sorted = [...segments].sort((a, b) => b.percentage - a.percentage);
  const total = sorted.reduce((sum, segment) => sum + segment.percentage, 0);
  if (total <= 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-100">
        {sorted.map((segment, index) => (
          <motion.div
            key={segment.breed}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{ backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length] }}
            initial={reduceMotion ? false : { width: 0 }}
            animate={{ width: `${(segment.percentage / total) * 100}%` }}
            transition={{
              duration: 0.6,
              delay: index * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {sorted.map((segment, index) => (
          <li
            key={segment.breed}
            className="flex items-center justify-between gap-3 rounded-2xl bg-[#FAFAF8] px-4 py-2.5"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    SEGMENT_COLORS[index % SEGMENT_COLORS.length],
                }}
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-[var(--brand-primary)]">
                  {segment.breed}
                </span>
                {segment.group ? (
                  <span className="block truncate text-xs text-slate-400">
                    {segment.group}
                  </span>
                ) : null}
              </span>
            </span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--brand-primary)]">
              {segment.percentage.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
