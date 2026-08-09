"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { formatDate } from "@/lib/dashboard";
import type { WeightLogEntry, WeightTargetRange } from "@/lib/pet-history/types";

const WIDTH = 640;
const HEIGHT = 220;
const PADDING = { top: 16, right: 16, bottom: 28, left: 40 };

interface WeightTrendChartProps {
  entries: WeightLogEntry[];
  target: WeightTargetRange | null;
}

/**
 * Dependency-free SVG line chart. The viewBox scales with the container, so
 * every coordinate below is in chart units, not pixels.
 */
export function WeightTrendChart({ entries, target }: WeightTrendChartProps) {
  const reduceMotion = useReducedMotion();

  const chart = useMemo(() => {
    if (entries.length === 0) return null;

    const values = entries.map((entry) => entry.weightKg);
    const candidates = [...values];
    if (target) candidates.push(target.minKg, target.maxKg);

    const rawMin = Math.min(...candidates);
    const rawMax = Math.max(...candidates);
    // Guard the degenerate single-point case, where min === max.
    const spread = rawMax - rawMin || Math.max(1, rawMax * 0.1);
    const min = rawMin - spread * 0.15;
    const max = rawMax + spread * 0.15;

    const innerWidth = WIDTH - PADDING.left - PADDING.right;
    const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;

    const x = (index: number) =>
      PADDING.left +
      (entries.length === 1
        ? innerWidth / 2
        : (index / (entries.length - 1)) * innerWidth);
    const y = (value: number) =>
      PADDING.top + (1 - (value - min) / (max - min)) * innerHeight;

    const points = entries.map((entry, index) => ({
      x: x(index),
      y: y(entry.weightKg),
      entry,
    }));

    const line = points
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
      .join(" ");

    const area = `${line} L${points.at(-1)!.x} ${HEIGHT - PADDING.bottom} L${points[0].x} ${HEIGHT - PADDING.bottom} Z`;

    const band = target
      ? {
          y: y(target.maxKg),
          height: Math.max(2, y(target.minKg) - y(target.maxKg)),
        }
      : null;

    const ticks = [min, (min + max) / 2, max];

    return { points, line, area, band, ticks, y };
  }, [entries, target]);

  if (!chart) return null;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full"
      role="img"
      aria-label="წონის დინამიკის გრაფიკი"
    >
      <defs>
        <linearGradient id="weight-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {chart.ticks.map((tick) => (
        <g key={tick}>
          <line
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={chart.y(tick)}
            y2={chart.y(tick)}
            stroke="#eceae5"
            strokeWidth="1"
          />
          <text
            x={PADDING.left - 8}
            y={chart.y(tick) + 4}
            textAnchor="end"
            className="fill-slate-400"
            fontSize="11"
          >
            {tick.toFixed(1)}
          </text>
        </g>
      ))}

      {chart.band ? (
        <>
          <rect
            x={PADDING.left}
            y={chart.band.y}
            width={WIDTH - PADDING.left - PADDING.right}
            height={chart.band.height}
            fill="var(--brand-accent)"
            opacity="0.12"
          />
          <text
            x={WIDTH - PADDING.right}
            y={chart.band.y - 5}
            textAnchor="end"
            className="fill-[var(--brand-accent)]"
            fontSize="10"
            fontWeight="600"
          >
            სამიზნე დიაპაზონი
          </text>
        </>
      ) : null}

      <path d={chart.area} fill="url(#weight-area)" />

      <motion.path
        d={chart.line}
        fill="none"
        stroke="var(--brand-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      {chart.points.map((point, index) => (
        <g key={point.entry.id}>
          <circle
            cx={point.x}
            cy={point.y}
            r={index === chart.points.length - 1 ? 5 : 3.5}
            fill="white"
            stroke="var(--brand-primary)"
            strokeWidth="2"
          />
          <title>
            {`${formatDate(point.entry.recordedAt)}, ${point.entry.weightKg} კგ`}
          </title>
        </g>
      ))}

      <text
        x={PADDING.left}
        y={HEIGHT - 8}
        className="fill-slate-400"
        fontSize="11"
      >
        {formatDate(chart.points[0].entry.recordedAt)}
      </text>
      {chart.points.length > 1 ? (
        <text
          x={WIDTH - PADDING.right}
          y={HEIGHT - 8}
          textAnchor="end"
          className="fill-slate-400"
          fontSize="11"
        >
          {formatDate(chart.points.at(-1)!.entry.recordedAt)}
        </text>
      ) : null}
    </svg>
  );
}
