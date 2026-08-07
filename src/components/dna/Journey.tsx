"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { FoodLayersVisual } from "@/components/visual/FoodLayersVisual";
import { useRef, useState } from "react";
import { Activity, Cpu, Dna, ShieldPlus, UtensilsCrossed } from "lucide-react";
import { DnaSection } from "@/components/dna/DnaSection";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { DNA } from "@/lib/constants";

const icons = [Dna, Cpu, ShieldPlus, UtensilsCrossed, Activity];

/** Steps 0-2 read the genome; 3-4 are downstream of it and show the ration. */
const HELIX_STEPS = 3;

/** Overlay badge pinned to the visual for each journey step. */
const STEP_BADGES = [
  "60s · cheek swab",
  "230,000+ markers",
  "risk map · prevention",
  "tailored fresh ration",
  "24/7 AI monitoring",
] as const;

/** Helix travel per step · the strand is fully read by the risk-mapping step. */
const HELIX_STOPS = [0.28, 0.62, 0.95, 1, 1] as const;

export function Journey() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // The helix is fully read across the first three steps; the last two steps
  // hand off to the ration visual, so progress saturates before they arrive.
  const helixProgress = useTransform(
    scrollYProgress,
    [0, 0.1, 0.3, 0.5, 1],
    [0.05, 0.22, 0.6, 0.95, 1],
    { clamp: true },
  );

  return (
    <section ref={sectionRef} id="journey" className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <RevealOnScroll className="mb-16 max-w-2xl">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
            {DNA.journey.eyebrow}
          </span>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--forest-deep)] sm:text-5xl">
            {DNA.journey.heading}
          </h2>
        </RevealOnScroll>

        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="sticky top-28 flex h-[28rem] items-center">
              <div className="relative h-full w-full">
                <AnimatePresence mode="wait">
                  {active < HELIX_STEPS ? (
                    <motion.div
                      key="helix"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <DnaSection
                        progress={helixProgress}
                        interactive
                        badge={STEP_BADGES[active]}
                        className="h-full"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="food"
                      initial={{ opacity: 0, scale: 0.96, y: 16 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -16 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <div className="relative h-full overflow-hidden rounded-[2rem] shadow-diffuse">
                        <FoodLayersVisual
                          compact
                          showLabels={false}
                          tilt={false}
                          className="h-full"
                        />
                      </div>
                      <div className="glass absolute right-4 top-4 rounded-2xl px-4 py-2.5 text-xs font-medium text-[var(--brand-accent)] shadow-soft">
                        {STEP_BADGES[active]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute -left-8 top-1/2 flex -translate-y-1/2 flex-col gap-3">
                  {DNA.journey.steps.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-500 ${
                        active === i
                          ? "h-10 bg-[var(--brand-primary)]"
                          : "h-4 bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            {DNA.journey.steps.map((step, i) => {
              const Icon = icons[i];
              return (
                <motion.div
                  key={step.index}
                  onViewportEnter={() => setActive(i)}
                  viewport={{ margin: "-45% 0px -45% 0px" }}
                  className="flex min-h-[28rem] flex-col justify-center py-10"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="mb-6 flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
                        <Icon className="h-6 w-6" aria-hidden />
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-300">
                          {step.index}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                          {step.tag}
                        </span>
                      </div>
                    </div>
                    <h3 className="mb-4 font-display text-3xl font-semibold tracking-tight text-[var(--forest-deep)]">
                      {step.title}
                    </h3>
                    <p className="max-w-md text-lg leading-relaxed text-[var(--text-secondary)]">
                      {step.text}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-12 lg:hidden">
          {DNA.journey.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <RevealOnScroll key={step.index} delay={0.05 * i}>
                <div className="h-64 overflow-hidden rounded-[2rem]">
                  {i < HELIX_STEPS ? (
                    <DnaSection
                      progress={HELIX_STOPS[i]}
                      interactive={false}
                      badge={STEP_BADGES[i]}
                      className="h-full"
                    />
                  ) : (
                    <FoodLayersVisual
                      compact
                      showLabels={false}
                      tilt={false}
                      className="h-full"
                    />
                  )}
                </div>
                <div className="mt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                      {step.index} · {step.tag}
                    </span>
                  </div>
                  <h3 className="mb-3 font-display text-2xl font-semibold tracking-tight text-[var(--forest-deep)]">
                    {step.title}
                  </h3>
                  <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                    {step.text}
                  </p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
