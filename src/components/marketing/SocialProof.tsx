"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LandingReviewSection } from "@/components/reviews/LandingReviewForm";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PawDecor } from "@/components/decor/PawDecor";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function SocialProof() {
  const { dict } = useLocale();
  const sp = dict.socialProof;

  return (
    <section className="grain-texture relative overflow-hidden bg-[var(--background-secondary)] py-16 sm:py-20 lg:py-24">
      <PawDecor density="light" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[var(--brand-accent)]/8 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.div variants={fadeUp}>
            <SectionHeader
              eyebrow={sp.eyebrow}
              title={sp.title}
              description={sp.description}
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 grid gap-4 sm:grid-cols-3"
          >
            {sp.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[var(--radius-organic-lg)] border border-[var(--border-light)] bg-white px-6 py-5 text-center shadow-soft"
              >
                <p className="font-display text-3xl font-semibold text-[var(--brand-primary)]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp}>
            <LandingReviewSection />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
