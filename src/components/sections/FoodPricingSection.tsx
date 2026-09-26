"use client";

import { motion } from "framer-motion";
import { BreedPortrait } from "@/components/decor/BreedPortrait";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { FRESH_FOOD_SIZE_CLASSES } from "@/lib/pricing/food";

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
          {FRESH_FOOD_SIZE_CLASSES.map(({ size, weightKg, fromDailyGel, example }) => (
            <li
              key={size}
              className="flex w-[78%] shrink-0 snap-start flex-col rounded-[var(--radius-organic-lg)] border border-[var(--border-light)] bg-white p-6 shadow-soft sm:w-[46%] lg:w-auto lg:flex-1"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-[var(--brand-primary)]/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
                  {p.sizes[size]}
                </span>
                <BreedPortrait breed={example.id} size={72} className="shrink-0" />
              </div>

              <h3 className="mt-3 font-display text-2xl font-semibold text-[var(--forest-deep)]">
                {(weightKg.max === undefined ? p.weightFrom : p.weight)
                  .replace("{min}", String(weightKg.min))
                  .replace("{max}", String(weightKg.max))}
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {p.example.replace("{breed}", example[locale])}
              </p>

              {/* Pinned to the bottom so prices line up across cards. */}
              <div className="mt-auto pt-6">
                <div className="border-t border-[var(--border-light)] pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    {p.from}
                  </p>
                  <p className="mt-1 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold tracking-tight text-[var(--forest-deep)]">
                      {gel(fromDailyGel)}
                    </span>
                    <span className="text-sm font-medium text-[var(--text-secondary)]">
                      {p.perDay}
                    </span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </motion.ul>

        <motion.div variants={fadeUp} className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="mt-3 text-xs font-medium text-[var(--text-secondary)] lg:hidden">
            {p.swipeHint}
          </p>
          <p className="mt-6 text-sm leading-relaxed text-[var(--text-secondary)]">{p.note}</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
