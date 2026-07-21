"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export interface DnaDataStreamProps {
  progress: number;
  locale?: "ka" | "en";
  className?: string;
}

const RAW_LINES = [
  "SNP.rs2282679 · VIT_D_STATUS",
  "MARKER.MDR1 · DRUG_SENSITIVITY",
  "BREED.PANEL · 230,000 loci",
  "HEALTH.RISK · 270 panels",
  "SEQ.CHUNK_0x4F · GC=0.42",
] as const;

const RAW_LINES_KA = [
  "SNP.rs2282679 · ვიტამინი D",
  "MARKER.MDR1 · მედიკამენტი",
  "BREED.PANEL · 230,000 ლოკუსი",
  "HEALTH.RISK · 270 პანელი",
  "SEQ.CHUNK_0x4F · GC=0.42",
] as const;

export function DnaDataStream({
  progress,
  locale = "ka",
  className = "",
}: DnaDataStreamProps) {
  const [tick, setTick] = useState(0);
  const lines = locale === "ka" ? RAW_LINES_KA : RAW_LINES;
  const stage =
    progress < 0.33 ? "raw" : progress < 0.72 ? "scan" : "insight";

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1400);
    return () => window.clearInterval(id);
  }, []);

  const insightTitle =
    locale === "ka" ? "Pet Wellness AI" : "Pet Wellness AI";
  const insightBody =
    locale === "ka"
      ? "გენეტიკური მარკერები → პერსონალური ველნესი"
      : "Genetic markers → personalized wellness";
  const scanLabel =
    locale === "ka" ? "სკანირება…" : "Scanning markers…";

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[2] overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,transparent_40%,rgba(4,16,24,0.55)_100%)]" />

      <AnimatePresence mode="wait">
        {stage === "raw" && (
          <motion.div
            key="raw"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.35 }}
            className="absolute left-4 top-4 max-w-[58%] font-mono text-[10px] leading-relaxed text-cyan-200/70 sm:text-[11px]"
          >
            {lines.map((line, i) => (
              <p
                key={line}
                className="truncate opacity-80"
                style={{
                  opacity: ((tick + i) % lines.length) === i ? 1 : 0.45,
                }}
              >
                {`>`} {line}
              </p>
            ))}
          </motion.div>
        )}

        {stage === "scan" && (
          <motion.div
            key="scan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-4 top-4 rounded-xl border border-cyan-400/25 bg-slate-950/55 px-3 py-2 backdrop-blur-sm"
          >
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
              {scanLabel}
            </p>
            <div className="mt-2 h-1 w-28 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-400"
                animate={{ width: `${28 + progress * 70}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="mt-1.5 font-mono text-[10px] text-cyan-100/60">
              {(230000 * Math.min(1, progress / 0.72)).toFixed(0)} SNPs
            </p>
          </motion.div>
        )}

        {stage === "insight" && (
          <motion.div
            key="insight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-14 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-[220px]"
          >
            <div className="rounded-2xl border border-cyan-400/30 bg-slate-950/70 p-3 shadow-[0_0_30px_rgba(34,211,238,0.15)] backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                {insightTitle}
              </p>
              <p className="mt-1.5 text-xs leading-snug text-slate-100/90">
                {insightBody}
              </p>
              <div className="mt-2 flex gap-1.5">
                {["MDR1", "Breed", "Allergy"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-cyan-400/15 px-2 py-0.5 font-mono text-[9px] text-cyan-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
