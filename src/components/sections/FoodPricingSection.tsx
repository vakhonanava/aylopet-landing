"use client";

import { motion } from "framer-motion";
import { ArrowRight, Dog } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { scrollToWaitlist } from "@/lib/navigation";
import { FRESH_FOOD_DAILY_BY_SIZE, type DogSize } from "@/lib/pricing/food";

/** Icon size grows with the dog, so the row reads small → giant at a glance. */
const ICON_PX: Record<DogSize, number> = {
  small: 22,
  medium: 30,
  large: 38,
  giant: 46,
};

const DAYS_PER_MONTH = 30;

export function FoodPricingSection() {
  const { dict, locale } = useLocale();
  const p = dict.foodPricing;
  const gel = (amount: number) => (locale === "ka" ? `${amount} ₾` : `₾${amount}`);

  return (
    <section
      id="pricing"
      className="relative scroll-mt-28 overflow-hidden bg-[var(--background-main)] py-16 sm:py-20"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        <motion.div variants={fadeUp} className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={p.eyebrow}
            title={p.title}
            description={p.description}
            align="center"
          />
        </motion.div>

        <motion.ul
          variants={fadeUp}
          className="mx-auto mt-10 flex max-w-6xl snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:scroll-px-6 sm:px-6 lg:gap-5 lg:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {FRESH_FOOD_DAILY_BY_SIZE.map((example) => (
            <li
              key={example.size}
              className="flex w-[78%] shrink-0 snap-start flex-col rounded-[var(--radius-organic-lg)] border border-[var(--border-light)] bg-white p-6 shadow-soft sm:w-[46%] lg:w-auto lg:flex-1"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-[var(--brand-primary)]/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
                  {p.sizes[example.size]}
                </span>
                <span className="flex h-12 w-12 items-end justify-end text-[var(--brand-primary)]">
                  <Dog
                    aria-hidden
                    width={ICON_PX[example.size]}
                    height={ICON_PX[example.size]}
                    strokeWidth={1.75}
                  />
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl font-semibold text-[var(--forest-deep)]">
                {example.breed[locale]}
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {p.weight
                  .replace("{min}", String(example.weightKg.min))
                  .replace("{max}", String(example.weightKg.max))}
              </p>

              {/* Pinned to the bottom so prices line up when a breed name wraps. */}
              <div className="mt-auto pt-6">
                <div className="flex items-baseline gap-2 border-t border-[var(--border-light)] pt-5">
                  <span className="font-display text-4xl font-bold tracking-tight text-[var(--forest-deep)]">
                    {gel(example.dailyGel)}
                  </span>
                  <span className="text-sm font-medium text-[var(--text-secondary)]">
                    {p.perDay}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {p.perMonth.replace("{price}", gel(example.dailyGel * DAYS_PER_MONTH))}
                </p>
              </div>
            </li>
          ))}
        </motion.ul>

        <motion.div variants={fadeUp} className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="mt-3 text-xs font-medium text-[var(--text-secondary)] lg:hidden">
            {p.swipeHint}
          </p>
          <p className="mt-6 text-sm leading-relaxed text-[var(--text-secondary)]">{p.note}</p>
          <button
            type="button"
            onClick={scrollToWaitlist}
            className="mt-6 inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full bg-[var(--terracotta)] px-8 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(198,123,92,0.3)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            {p.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
