"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Dna, Sparkles } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { DnaHelixScrollCanvas } from "@/components/visual/DnaHelixScrollCanvas";

function phaseFromProgress(p: number): number {
  if (p < 0.34) return 0;
  if (p < 0.67) return 1;
  return 2;
}

export function DnaScrollExperience() {
  const { dict } = useLocale();
  const copy = dict.dnaScroll;
  const containerRef = useRef<HTMLElement>(null);
  const [activePhase, setActivePhase] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Ease scroll progress so helix travel feels fluid, not linear/stiff
  const helixRotation = useTransform(
    scrollYProgress,
    [0, 0.08, 0.35, 0.7, 1],
    [0, 0.08, 0.42, 0.78, 1],
    { clamp: true },
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActivePhase(phaseFromProgress(v));
  });

  const phase = copy.phases[activePhase];

  return (
    <section
      ref={containerRef}
      id="genome"
      className="relative bg-[var(--forest-deep)]"
      style={{ height: "380vh" }}
      aria-label={copy.ariaLabel}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(107,143,113,0.2),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_80%,rgba(223,106,65,0.12),transparent_60%)]" />
        </div>

        <div className="relative mx-auto flex h-full w-full max-w-6xl flex-1 flex-col px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8">
          <div className="relative flex min-h-[42vh] flex-1 items-center justify-center pt-4 lg:min-h-0 lg:pt-0">
            <div className="relative aspect-square w-full max-w-[min(100%,500px)]">
              <DnaHelixScrollCanvas progress={helixRotation} />
            </div>
          </div>

          <div className="relative flex min-h-[280px] flex-col justify-center pb-10 pt-2 lg:min-h-[420px] lg:py-0">
            <div className="mb-5 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-1 flex-1 rounded-full bg-white/15"
                  animate={{
                    backgroundColor:
                      activePhase === i
                        ? "rgba(16, 185, 129, 0.95)"
                        : "rgba(255, 255, 255, 0.15)",
                    scaleY: activePhase === i ? 1.4 : 1,
                  }}
                  transition={{ duration: 0.35 }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-5"
              >
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent)] backdrop-blur-sm">
                  {activePhase === 0 ? (
                    <Dna className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  )}
                  {phase.eyebrow}
                </span>

                <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--bone-alabaster)] sm:text-4xl lg:text-[2.65rem]">
                  {phase.title}
                </h2>

                <p className="max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
                  {phase.body}
                </p>

                <div className="flex items-end gap-3">
                  <span className="font-display text-4xl font-semibold text-[var(--status-emerald)]">
                    {phase.stat}
                  </span>
                  <span className="pb-1.5 text-sm text-white/50">{phase.statLabel}</span>
                </div>

                {activePhase === 2 && (
                  <Link
                    href="/dna-journey#platform"
                    className="group mt-1 inline-flex min-h-[44px] w-fit cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:border-white/35 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {copy.portalCta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
