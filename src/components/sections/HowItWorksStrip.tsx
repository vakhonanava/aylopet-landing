"use client";

import { motion } from "framer-motion";
import { ArrowRight, ClipboardList, Rocket, Sparkles } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { scrollToWaitlist } from "@/lib/navigation";

const STEP_ICONS = [ClipboardList, Rocket, Sparkles] as const;

export function HowItWorksStrip() {
  const { dict } = useLocale();
  const h = dict.howItWorks;

  return (
    <section className="bg-[var(--forest-deep)] py-14 sm:py-18">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.div variants={fadeUp}>
            <SectionHeader
              eyebrow={h.eyebrow}
              title={h.title}
              align="center"
              className="[&_h2]:text-white [&_p]:text-white/70 [&_span]:text-[var(--terracotta)]"
            />
          </motion.div>

          <motion.ol
            variants={fadeUp}
            className="mt-10 grid gap-6 sm:grid-cols-3"
          >
            {h.steps.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? Sparkles;
              return (
                <li
                  key={step.title}
                  className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--terracotta)]/20 text-[var(--terracotta)]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </motion.ol>

          <motion.div variants={fadeUp} className="mt-10 text-center">
            <button
              type="button"
              onClick={scrollToWaitlist}
              className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-[var(--forest-deep)] transition-transform hover:-translate-y-0.5"
            >
              {h.cta}
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
