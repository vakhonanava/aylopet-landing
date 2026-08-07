"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { motionEase } from "@/lib/motion";

type ProcessingMethod = "raw" | "kibble" | "aylopet";
type Locale = "ka" | "en";

interface ComparisonRow {
  label: string;
  raw: number;
  kibble: number;
  aylopet: number;
}

const COMPARISON_ROWS: Record<Locale, ComparisonRow[]> = {
  ka: [
    { label: "პათოგენებისგან უსაფრთხოება", raw: 15, kibble: 95, aylopet: 100 },
    { label: "ამინომჟავების შენარჩუნება", raw: 100, kibble: 35, aylopet: 92 },
    { label: "კოლაგენის შენარჩუნება", raw: 98, kibble: 20, aylopet: 88 },
    { label: "ბიოაქტიური ვიტამინები", raw: 95, kibble: 40, aylopet: 90 },
    { label: "მინერალების ბიოშეღწევადობა", raw: 90, kibble: 55, aylopet: 85 },
  ],
  en: [
    { label: "Pathogen safety", raw: 15, kibble: 95, aylopet: 100 },
    { label: "Amino acid retention", raw: 100, kibble: 35, aylopet: 92 },
    { label: "Collagen preservation", raw: 98, kibble: 20, aylopet: 88 },
    { label: "Bioactive vitamins", raw: 95, kibble: 40, aylopet: 90 },
    { label: "Mineral bioavailability", raw: 90, kibble: 55, aylopet: 85 },
  ],
};

const METHOD_LABELS: Record<Locale, Record<ProcessingMethod, string>> = {
  ka: {
    raw: "ნედლი ხორცი",
    kibble: "მაღალტემპერატურული მშრალი საკვები",
    aylopet: "Aylopet დაბალტემპერატურული",
  },
  en: {
    raw: "Raw Meat",
    kibble: "Hot-Batch Kibble",
    aylopet: "Aylopet Low-Temp",
  },
};

const METHOD_DESCRIPTIONS: Record<Locale, Record<ProcessingMethod, string>> = {
  ka: {
    raw: "მაქსიმალური ნუტრიენტები, თუმცა პათოგენების მაღალი რისკი გულდასმითი დამუშავების გარეშე.",
    kibble: "მაღალტემპერატურული ექსტრუზია ანადგურებს კოლაგენს და სითბოსადმი მგრძნობიარე ვიტამინებს.",
    aylopet: "75-80°C, 1-6 საათი · პათოგენების განადგურება სტრუქტურის შენარჩუნებით.",
  },
  en: {
    raw: "Maximum nutrients, significant pathogen risk without careful handling.",
    kibble: "High-heat extrusion destroys collagen and heat-sensitive vitamins.",
    aylopet: "75 to 80°C for 1 to 6 hours · eliminates pathogens while preserving structure.",
  },
};

const COPY = {
  ka: {
    heading: "პასტერიზაციის გამჭვირვალობა",
    intro:
      "დაბალტემპერატურული თერმული დამუშავება (75-80°C, 1-6 საათი) სრულად ანადგურებს პათოგენებს სტრუქტურული ნუტრიენტების დაკარგვის გარეშე.",
    compareLabel: "შეადარეთ დამუშავების მეთოდები",
    viewing: "ნახულობთ",
    highlight1Title: "პათოგენების განადგურება",
    highlight1Body:
      "სალმონელას, ლისტერიისა და ე. კოლის სრული განადგურება დადასტურებული დაბალტემპერატურული თერმული მრუდებით.",
    highlight2Title: "სტრუქტურული ნუტრიენტების შენარჩუნება",
    highlight2Body:
      "სასიცოცხლო ამინომჟავების, კოლაგენის, მინერალებისა და ბიოაქტიური ვიტამინების სრული შენარჩუნება · არ ინადგურება ექსტრუზიით.",
  },
  en: {
    heading: "Pasteurization transparency",
    intro:
      "Low-temperature thermal processing (75 to 80°C, 1 to 6 hours) delivers complete pathogen destruction without sacrificing structural nutrients.",
    compareLabel: "Compare processing methods",
    viewing: "Viewing",
    highlight1Title: "Pathogen destruction",
    highlight1Body:
      "Complete elimination of Salmonella, Listeria, and E. coli through validated low-temperature thermal curves.",
    highlight2Title: "Structural nutrient retention",
    highlight2Body:
      "Complete preservation of vital amino acids, collagen, minerals, and bioactive vitamins · not denatured by extrusion.",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export function PasteurizationModule({ locale = "ka" }: { locale?: Locale }) {
  const [highlight, setHighlight] = useState<ProcessingMethod>("aylopet");
  const [sliderIndex, setSliderIndex] = useState(2);
  const c = COPY[locale];
  const methodLabels = METHOD_LABELS[locale];
  const methodDescriptions = METHOD_DESCRIPTIONS[locale];
  const comparisonRows = COMPARISON_ROWS[locale];

  const methods: ProcessingMethod[] = ["raw", "kibble", "aylopet"];
  const activeMethod = methods[sliderIndex] ?? "aylopet";

  return (
    <section className="rounded-2xl border border-[var(--oat-soft)] bg-white p-6 sm:p-10">
      <h3 className="font-display text-2xl font-semibold text-[var(--forest-deep)]">
        {c.heading}
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--forest-deep)]/65">
        {c.intro}
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
              {methodLabels[method]}
            </span>
            <p className="mt-2 text-xs leading-relaxed text-[var(--forest-deep)]/55">
              {methodDescriptions[method]}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <label className="text-xs font-medium uppercase tracking-wider text-[var(--forest-deep)]/45">
          {c.compareLabel}
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
          {c.viewing}: {methodLabels[activeMethod]}
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {comparisonRows.map((row) => {
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
        <HighlightCard title={c.highlight1Title} body={c.highlight1Body} />
        <HighlightCard title={c.highlight2Title} body={c.highlight2Body} />
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
