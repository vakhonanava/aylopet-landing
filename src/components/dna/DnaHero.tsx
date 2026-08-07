"use client";

import { motion } from "framer-motion";
import { Dna, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DnaHelix3D } from "@/components/visual/DnaHelix3D";
import { DNA } from "@/lib/constants";

const markers = [
  { label: "Breed", value: "Weimaraner 98.2%" },
  { label: "Metabolism", value: "Fast oxidizer" },
  { label: "Allergens", value: "0 detected" },
];

export function DnaHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--forest-deep)] pt-16 pb-24 lg:pt-24 lg:pb-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-[520px] w-[520px] rounded-full bg-[var(--brand-accent)]/15 blur-3xl" />
        <div className="absolute bottom-0 -left-32 h-[420px] w-[420px] rounded-full bg-[var(--terracotta)]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8">
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand-accent)] backdrop-blur-sm">
              <Dna className="h-3.5 w-3.5" aria-hidden />
              {DNA.hero.eyebrow}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[2.75rem] font-semibold leading-[1.02] tracking-tight text-[var(--bone-alabaster)] sm:text-6xl lg:text-[4rem]"
          >
            {DNA.hero.headline.split("\n").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-w-lg flex-col gap-4 text-lg leading-[1.75] text-white/60"
          >
            {DNA.hero.subheadline.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button href="#start">{DNA.hero.cta}</Button>
            <Button href="#journey" variant="secondary" showArrow={false}>
              {DNA.hero.secondaryCta}
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none"
        >
          <div className="relative h-full w-full overflow-hidden rounded-[var(--radius-organic-xl)] border border-cyan-400/20 bg-[#030b12] shadow-[0_32px_80px_rgba(0,0,0,0.45)]">
            <DnaHelix3D
              autoRotate
              progress={0.45}
              highlightRatio={0.55}
              variant="dark"
              interactive
              flowSpeed={0.08}
              config={{ rungs: 68, radius: 86, spacing: 10 }}
            />
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-4 w-[72%] rounded-3xl border border-white/10 bg-[var(--forest-deep)]/90 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.4)] backdrop-blur-md sm:-left-8"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium text-white/50">
                <Sparkles className="h-3.5 w-3.5 text-[var(--status-emerald)]" aria-hidden />
                {DNA.hero.parsingLabel}
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--status-emerald)]" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--status-emerald)]">
                  live
                </span>
              </span>
            </div>

            <div className="space-y-2">
              {markers.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.25, duration: 0.5 }}
                  className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs"
                >
                  <span className="text-white/40">{m.label}</span>
                  <span className="font-semibold text-white/90">{m.value}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--brand-accent)] to-[var(--status-emerald)]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.2, delay: 0.6, ease: "easeInOut" }}
                />
              </div>
              <span className="text-[10px] font-medium text-white/40">{DNA.hero.markers}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
