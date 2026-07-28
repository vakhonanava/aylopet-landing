"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Equal, Heart, X } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IMAGES } from "@/lib/images";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { scrollToWaitlist } from "@/lib/navigation";

const PRICE = "10 ₾";

export function ValueComparisonSection() {
  const { dict } = useLocale();
  const v = dict.valueComparison;

  return (
    <section
      id="value"
      className="relative overflow-hidden border-y border-[var(--border-light)] bg-[var(--bone-alabaster)] py-16 sm:py-20"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.div variants={fadeUp}>
            <SectionHeader
              eyebrow={v.eyebrow}
              title={v.title}
              description={v.description}
              align="center"
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="relative mt-10 grid gap-5 sm:gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch lg:gap-6"
          >
            {/* Coffee */}
            <article className="group flex flex-col overflow-hidden rounded-[var(--radius-organic-lg)] border border-[var(--border-light)] bg-white shadow-soft">
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--background-secondary)]">
                <Image
                  src={IMAGES.coffeeCup}
                  alt={v.coffee.imageAlt}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 420px"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <h3 className="font-display text-2xl font-semibold text-white">
                    {v.coffee.label}
                  </h3>
                  <div className="rounded-2xl bg-white/95 px-4 py-2 text-right shadow-lg backdrop-blur-sm">
                    <p className="font-display text-2xl font-bold text-[var(--text-tertiary)]">
                      {PRICE}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                      {v.perDay}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="text-sm leading-relaxed text-[var(--text-tertiary)]">
                  {v.coffee.detail}
                </p>
                {v.coffee.duration ? (
                  <span className="mt-4 inline-flex w-fit rounded-full bg-[var(--background-secondary)] px-3 py-1 text-xs font-medium text-[var(--text-tertiary)]">
                    {v.coffee.duration}
                  </span>
                ) : null}
              </div>
            </article>

            {/* VS */}
            <div className="flex items-center justify-center py-2 lg:flex-col lg:py-10">
              <span
                aria-hidden
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--border-light)] bg-white text-[var(--forest-deep)] shadow-[0_8px_24px_rgba(13,46,39,0.08)]"
              >
                <Equal className="h-6 w-6" strokeWidth={2.5} />
              </span>
            </div>

            {/* AylopetAI · winner */}
            <article className="group relative flex flex-col overflow-hidden rounded-[var(--radius-organic-lg)] border-2 border-[var(--brand-primary)] bg-white shadow-[0_20px_50px_rgba(58,90,64,0.15)]">
              <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-[var(--brand-primary)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                <Heart className="h-3 w-3 fill-current" aria-hidden />
                {v.product.badge}
              </span>

              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={IMAGES.aylopetAi}
                  alt={v.product.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 420px"
                  priority
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)]/70 via-[var(--brand-primary)]/20 to-transparent"
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <h3 className="font-display text-2xl font-semibold text-white">
                    {v.product.label}
                  </h3>
                  <div className="shrink-0 rounded-2xl bg-white px-4 py-2 text-right shadow-lg">
                    <p className="font-display text-2xl font-bold text-[var(--forest-deep)]">
                      {PRICE}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
                      {v.perMonth}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col bg-gradient-to-b from-[var(--brand-accent-soft)]/50 to-white p-5 sm:p-6">
                <p className="text-sm leading-relaxed text-[var(--text-body)]">
                  {v.product.detail}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[var(--text-body)]">
                  {v.product.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--status-emerald)]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 rounded-[var(--radius-organic-lg)] border border-[var(--terracotta)]/25 bg-[var(--terracotta)]/5 p-5 sm:p-6"
          >
            <p className="text-center font-display text-lg font-semibold text-[var(--forest-deep)]">
              {v.lossTitle}
            </p>
            <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2">
              {v.lossItems.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center justify-center gap-2 text-sm text-[var(--text-body)]"
                >
                  <X className="h-4 w-4 shrink-0 text-[var(--terracotta)]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 text-center">
            <p className="text-sm font-medium text-[var(--text-secondary)]">{v.vetAnchor}</p>
            {v.priceNote ? (
              <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">
                {v.priceNote}
              </p>
            ) : null}
            {v.vetAnchorSecondary ? (
              <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">
                {v.vetAnchorSecondary}
              </p>
            ) : null}
            <p className="mt-4 font-display text-xl font-semibold text-[var(--forest-deep)] sm:text-2xl">
              {v.punchline}
            </p>
            <button
              type="button"
              onClick={scrollToWaitlist}
              className="mt-6 inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full bg-[var(--terracotta)] px-8 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(198,123,92,0.3)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              {v.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
