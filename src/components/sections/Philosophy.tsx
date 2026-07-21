"use client";

import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { FoodLayersVisual } from "@/components/visual/FoodLayersVisual";
import { PawDecor } from "@/components/decor/PawDecor";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { CONTENT } from "@/lib/constants";

export function Philosophy() {
  const { locale } = useLocale();

  return (
    <section
      id="philosophy"
      className="relative overflow-hidden bg-[var(--background-secondary)] py-24 lg:py-32"
    >
      <PawDecor density="medium" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full bg-[var(--brand-accent)]/10 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
              {locale === "ka" ? "ჩვენი ფილოსოფია" : "Our philosophy"}
            </span>
            <p className="text-xl leading-[1.8] text-[var(--text-body)] sm:text-2xl sm:leading-[1.75]">
              {CONTENT.philosophy.text}
            </p>
            <div className="mx-auto mt-12 h-px w-24 bg-gradient-to-r from-transparent via-[var(--brand-accent)] to-transparent lg:mx-0" />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <FoodLayersVisual locale={locale} showLabels tilt />
        </RevealOnScroll>
      </div>
    </section>
  );
}
