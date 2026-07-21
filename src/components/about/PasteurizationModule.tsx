"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { motionEase } from "@/lib/motion";

type ProcessingMethod = "raw" | "kibble" | "aylopet";

interface ComparisonRow {
  label: string;
  raw: number;
  kibble: number;
  aylopet: number;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Pathogen safety", raw: 15, kibble: 95, aylopet: 100 },
  { label: "Amino acid retention", raw: 100, kibble: 35, aylopet: 92 },
  { label: "Collagen preservation", raw: 98, kibble: 20, aylopet: 88 },
  { label: "Bioactive vitamins", raw: 95, kibble: 40, aylopet: 90 },
  { label: "Mineral bioavailability", raw: 90, kibble: 55, aylopet: 85 },
];

const METHOD_LABELS: Record<ProcessingMethod, string> = {
  raw: "Raw Meat",
  kibble: "Hot-Batch Kibble",
  aylopet: "Aylopet Low-Temp",
};

const METHOD_DESCRIPTIONS: Record<ProcessingMethod, string> = {
  raw: "Maximum nutrients, significant pathogen risk without careful handling.",
  kibble: "High-heat extrusion destroys collagen and heat-sensitive vitamins.",
  aylopet: "60 to 80°C for 1 to 6 hours · eliminates pathogens while preserving structure.",
};

export function PasteurizationModule() {
  const [highlight, setHighlight] = useState<ProcessingMethod>("aylopet");
  const [sliderIndex, setSliderIndex] = useState(2);

  const methods: ProcessingMethod[] = ["raw", "kibble", "aylopet"];
  const activeMethod = methods[sliderIndex] ?? "aylopet";

  return (
    <section className="rounded-2xl border border-[var(--oat-soft)] bg-white p-6 sm:p-10">
      <h3 className="font-display text-2xl font-semibold text-[var(--forest-deep)]">
        Pasteurization transparency
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--forest-deep)]/65">
        Low-temperature thermal processing (60 to 80°C, 1 to 6 hours) delivers complete
        pathogen destruction without sacrificing structural nutrients.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {methods.map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => {
              setHighlight(method);
              setSliderIndex(methods.indexOf(method));
            }}
            className={`rounded-xl border p-4 text-left transition-all duration-300 ${
              highlight === method
                ? "border-[var(--terracotta)] bg-[var(--terracotta)]/8 shadow-[0_4px_20px_rgba(223,106,65,0.1)]"
                : "border-[var(--oat-soft)] bg-[var(--bone-alabaster)] hover:border-[var(--terracotta)]/25"
            }`}
          >
            <span className="text-sm font-semibold text-[var(--forest-deep)]">
              {METHOD_LABELS[method]}
            </span>
            <p className="mt-2 text-xs leading-relaxed text-[var(--forest-deep)]/55">
              {METHOD_DESCRIPTIONS[method]}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <label className="text-xs font-medium uppercase tracking-wider text-[var(--forest-deep)]/45">
          Compare processing methods
        </label>
        <input
          type="range"
          min={0}
          max={2}
          step={1}
          value={sliderIndex}
          onChange={(e) => {
            const idx = Number(e.target.value);
            setSliderIndex(idx);
            setHighlight(methods[idx] ?? "aylopet");
          }}
          className="mt-3 w-full accent-[var(--terracotta)]"
        />
        <p className="mt-2 text-center text-sm font-medium text-[var(--terracotta)]">
          Viewing: {METHOD_LABELS[activeMethod]}
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {COMPARISON_ROWS.map((row) => {
          const value = row[activeMethod];
          return (
            <div key={row.label}>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="font-medium text-[var(--forest-deep)]">
                  {row.label}
                </span>
                <span className="tabular-nums text-[var(--forest-deep)]/60">
                  {value}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--oat-soft)]">
                <motion.div
                  key={`${row.label}-${activeMethod}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.5, ease: motionEase }}
                  className={`h-full rounded-full ${
                    activeMethod === "aylopet"
                      ? "bg-[var(--sage-herbaceous)]"
                      : activeMethod === "kibble"
                        ? "bg-amber-500/70"
                        : "bg-[var(--forest-deep)]/40"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <HighlightCard
          title="Pathogen destruction"
          body="Complete elimination of Salmonella, Listeria, and E. coli through validated low-temperature thermal curves."
        />
        <HighlightCard
          title="Structural nutrient retention"
          body="Complete preservation of vital amino acids, collagen, minerals, and bioactive vitamins · not denatured by extrusion."
        />
      </div>
    </section>
  );
}

function HighlightCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-[var(--sage-herbaceous)]/30 bg-[var(--sage-herbaceous)]/8 p-5">
      <p className="text-sm font-semibold text-[var(--forest-deep)]">{title}</p>
      <p className="mt-2 text-xs leading-relaxed text-[var(--forest-deep)]/70">
        {body}
      </p>
    </div>
  );
}
