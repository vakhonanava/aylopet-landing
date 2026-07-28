"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Check,
  LineChart,
  Sparkles,
} from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { TechDashboardPreview } from "@/components/sections/TechDashboardPreview";
import { HeroEcosystemMedia } from "@/components/visual/HeroEcosystemMedia";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { IMAGES } from "@/lib/images";
import { scrollToWaitlist } from "@/lib/navigation";

const linkClass =
  "group inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)] sm:text-base";

const METRIC_ICONS = [Brain, LineChart] as const;

export function Hero3D({ media = "ecosystem" }: { media?: "current" | "ecosystem" }) {
  const { dict } = useLocale();
  const t = dict.common;
  const h = dict.landing.hero;
  const visibleMetrics = h.metrics.filter((_, index) => index === 1 || index === 3);

  return (
    <section className="relative isolate overflow-hidden bg-[var(--background-main)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_38%,rgba(107,143,113,0.16),transparent_32%),radial-gradient(circle_at_18%_18%,rgba(232,190,169,0.15),transparent_26%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-white/70 to-transparent"
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-7.5rem)] max-w-7xl items-center gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-10 lg:py-12 xl:gap-16">
        <motion.div
          variants={staggerContainer}
          initial={false}
          animate="visible"
          className="relative z-10 mx-auto max-w-xl text-center lg:mx-0 lg:text-left"
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center lg:justify-start"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-primary)]/15 bg-white/75 px-4 py-2 text-xs font-semibold text-[var(--forest-deep)] shadow-[0_8px_24px_rgba(13,46,39,0.06)] backdrop-blur-md">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-accent-soft)]">
                <Sparkles className="h-3 w-3 text-[var(--brand-primary)]" aria-hidden />
              </span>
              {t.earlyAdopterBadge}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-7 text-balance font-display text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--forest-deep)] sm:text-6xl lg:text-[4rem] xl:text-[4.6rem]"
          >
            {h.titleLine1}
            <br />
            <span className="inline-block whitespace-nowrap bg-gradient-to-r from-[var(--brand-primary)] to-[var(--sage-herbaceous)] bg-clip-text text-transparent">
              {h.titleHighlight}
            </span>
            {h.titleLine2 ? (
              <>
                <br />
                {h.titleLine2}
              </>
            ) : null}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-[34rem] text-balance text-base font-medium leading-[1.65] text-[var(--text-body)] sm:text-xl lg:mx-0"
          >
            {h.emotionalLine}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mx-auto mt-8 flex max-w-md flex-wrap justify-center gap-2.5 lg:mx-0 lg:justify-start"
          >
            {visibleMetrics.map(({ value, label }, i) => {
              const Icon = METRIC_ICONS[i] ?? LineChart;
              return (
              <div
                key={label}
                className="flex min-w-[9.75rem] items-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-left shadow-[0_12px_30px_rgba(13,46,39,0.07)] backdrop-blur-lg"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-lg font-bold text-[var(--forest-deep)]">{value}</span>
                  <span className="block text-[10px] font-medium leading-tight text-[var(--text-secondary)]">
                    {label}
                  </span>
                </span>
              </div>
            );
            })}
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
          >
            <button
              type="button"
              onClick={scrollToWaitlist}
              className={`${linkClass} w-full bg-[var(--brand-primary)] text-white shadow-[0_16px_42px_rgba(58,90,64,0.25)] hover:bg-[var(--brand-primary-hover)] hover:shadow-[0_20px_48px_rgba(58,90,64,0.3)] sm:w-auto`}
            >
              {t.joinWaitlistPromo}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </button>
            <Link
              href="/products/aylopet-ai"
              className={`${linkClass} w-full border border-[var(--brand-primary)]/15 bg-white/75 text-[var(--text-primary)] backdrop-blur-sm hover:border-[var(--brand-primary)]/30 hover:bg-white hover:shadow-soft sm:w-auto`}
            >
              {h.techPlatform}
            </Link>
          </motion.div>
          {h.ctaNote ? (
            <motion.p
              variants={fadeUp}
              className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-[var(--text-secondary)] lg:justify-start lg:text-left"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
                <Check className="h-3 w-3" aria-hidden />
              </span>
              {h.ctaNote}
            </motion.p>
          ) : null}
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[36rem] lg:max-w-none"
        >
          {media === "ecosystem" ? (
            <HeroEcosystemMedia />
          ) : (
            <div className="relative">
              <div className="absolute -left-4 -top-4 z-10 hidden h-28 w-28 overflow-hidden rounded-2xl border-4 border-white shadow-organic sm:block lg:-left-6 lg:-top-6 lg:h-36 lg:w-36">
                <Image
                  src={IMAGES.heroDog3D}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="144px"
                  priority
                />
              </div>
              <TechDashboardPreview />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
