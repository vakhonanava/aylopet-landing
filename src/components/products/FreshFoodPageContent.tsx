"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { GeometricPattern } from "@/components/japandi/LineArtIcons";
import { FreshFoodHeroVisual } from "@/components/products/FreshFoodHeroVisual";
import { FreshFruitScene } from "@/components/visual/FreshFruitScene";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { FOOD_LAYERS } from "@/lib/content/food-layers";
import { ProseSection } from "@/components/marketing/ProseSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { getProducts } from "@/lib/content/products";

const INGREDIENTS = FOOD_LAYERS.filter((layer) => layer.id !== "base");

const COPY = {
  ka: {
    badge: "Gently Cooked",
    ingredientsEyebrow: "ნედლი ინგრედიენტები",
    ingredientsTitle: "მთლიანი ინგრედიენტები",
    ingredientsDescription:
      "ჩვენი რაციონის საფუძველი მაღალი ხარისხის, მთლიანი ინგრედიენტებია და არა ჩამნაცვლებელი მცენარეული და ცხოველური ფხვნილები.",
    innovationTitle: "ინოვაცია, რომელიც ინარჩუნებს სიცოცხლეს",
    whyTitle: "რატომ Aylopet?",
  },
  en: {
    badge: "Gently Cooked",
    ingredientsEyebrow: "Raw ingredients",
    ingredientsTitle: "Real fruit and vegetables, not powders",
    ingredientsDescription:
      "Every drop and fiber in our ration starts with fresh, seasonal ingredients. No synthetic additive replaces natural nutritional value.",
    innovationTitle: "Innovation that preserves life",
    whyTitle: "Why Aylopet?",
  },
} as const;

export function FreshFoodPageContent() {
  const { locale } = useLocale();
  const f = getProducts(locale).freshFood;
  const c = COPY[locale];

  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <section className="relative overflow-hidden bg-[var(--brand-primary)] py-20 text-white lg:py-28">
          <GeometricPattern className="pointer-events-none absolute inset-0 opacity-30 invert" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
            <RevealOnScroll y={20}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
                <Leaf className="h-4 w-4" />
                {c.badge}
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                {f.title}
              </h1>
              <p className="mt-4 text-lg text-white/85">{f.subheading}</p>
            </RevealOnScroll>
            <RevealOnScroll y={20} delay={0.1}>
              <FreshFoodHeroVisual locale={locale} />
            </RevealOnScroll>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[var(--bone-alabaster)] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <RevealOnScroll y={20} className="order-2 flex justify-center lg:order-1">
              <FreshFruitScene locale={locale} />
            </RevealOnScroll>
            <RevealOnScroll y={20} delay={0.1} className="order-1 lg:order-2">
              <SectionHeader
                eyebrow={c.ingredientsEyebrow}
                title={c.ingredientsTitle}
                description={c.ingredientsDescription}
                align="left"
              />
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {INGREDIENTS.map((layer) => (
                  <li
                    key={layer.id}
                    className="flex items-center gap-3 rounded-xl border border-[var(--border-light)] bg-white px-4 py-3 shadow-soft"
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{ background: `${layer.color}1a`, color: layer.color }}
                    >
                      <Sparkles className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="text-sm font-medium text-[var(--forest-deep)]">
                      {locale === "ka" ? layer.labelKa : layer.labelEn}
                    </span>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>
        </section>

        <ProseSection className="pt-16">
          <p>{f.paragraph1}</p>
          <h2>{c.innovationTitle}</h2>
          <p>{f.paragraph2}</p>
          <h2>{c.whyTitle}</h2>
          <p>{f.whyAylopet}</p>
        </ProseSection>

        <section className="mx-auto max-w-3xl px-6 pb-24 lg:px-8">
          <Link
            href={f.ctaHref}
            className="group inline-flex items-center gap-2 rounded-full border-2 border-[var(--brand-primary)] bg-transparent px-8 py-4 text-base font-medium text-[var(--brand-primary)] transition-all duration-300 hover:bg-[var(--brand-primary)] hover:text-white"
          >
            {f.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
