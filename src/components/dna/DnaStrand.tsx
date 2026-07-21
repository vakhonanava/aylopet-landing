"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface DnaStrandProps {
  className?: string;
  /** Number of base-pair rungs to render along the helix. */
  rungs?: number;
  /** Accent color for the digital data points. */
  accent?: string;
  /** Base color for the genetic backbone. */
  base?: string;
}

const WIDTH = 200;
const HEIGHT = 560;
const AMPLITUDE = 54;
const CENTER = WIDTH / 2;
const FREQ = (Math.PI * 2) / 220;
const BASES = ["A", "T", "G", "C"] as const;

/**
 * Abstract double-helix where the genetic backbone gradually dissolves into
 * digital data points · the visual thesis of "science meets nature".
 */
export function DnaStrand({
  className,
  rungs = 22,
  accent = "var(--brand-primary)",
  base = "#94A3B8",
}: DnaStrandProps) {
  const { pathA, pathB, nodes } = useMemo(() => {
    const step = HEIGHT / rungs;
    let a = "";
    let b = "";
    const nodeList: {
      x1: number;
      y: number;
      x2: number;
      letter: string;
      digital: boolean;
    }[] = [];

    for (let i = 0; i <= rungs; i++) {
      const y = i * step;
      const x1 = CENTER + Math.sin(y * FREQ) * AMPLITUDE;
      const x2 = CENTER - Math.sin(y * FREQ) * AMPLITUDE;
      a += `${i === 0 ? "M" : "L"} ${x1.toFixed(1)} ${y.toFixed(1)} `;
      b += `${i === 0 ? "M" : "L"} ${x2.toFixed(1)} ${y.toFixed(1)} `;
      nodeList.push({
        x1,
        x2,
        y,
        letter: BASES[i % BASES.length],
        // lower half of the strand "digitizes" into data points
        digital: i > rungs * 0.5,
      });
    }
    return { pathA: a, pathB: b, nodes: nodeList };
  }, [rungs]);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dna-backbone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={base} stopOpacity="0.9" />
          <stop offset="60%" stopColor={accent} stopOpacity="0.8" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Backbone strands with a flowing dash animation */}
      <motion.path
        d={pathA}
        stroke="url(#dna-backbone)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="6 10"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -160 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      <motion.path
        d={pathB}
        stroke="url(#dna-backbone)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="6 10"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: 160 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      {nodes.map((node, i) => (
        <g key={i}>
          {/* Connecting rung */}
          <line
            x1={node.x1}
            y1={node.y}
            x2={node.x2}
            y2={node.y}
            stroke={node.digital ? accent : base}
            strokeOpacity={node.digital ? 0.35 : 0.18}
            strokeWidth="1.5"
            strokeDasharray={node.digital ? "2 3" : undefined}
          />

          {/* Left node: organic base pair */}
          <motion.circle
            cx={node.x1}
            cy={node.y}
            r={node.digital ? 2.5 : 4}
            fill={node.digital ? accent : base}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: i * 0.08,
              ease: "easeInOut",
            }}
          />

          {/* Right node: digitizes into a square data point on the lower half */}
          {node.digital ? (
            <motion.rect
              x={node.x2 - 2.5}
              y={node.y - 2.5}
              width={5}
              height={5}
              fill={accent}
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          ) : (
            <circle cx={node.x2} cy={node.y} r={4} fill={base} fillOpacity={0.8} />
          )}
        </g>
      ))}
    </svg>
  );
}
