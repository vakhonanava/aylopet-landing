"use client";

import { SplitHero } from "@/components/japandi/SplitHero";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAbout } from "@/lib/content/about";
import { IMAGES } from "@/lib/images";

const HERO_ALT: Record<"ka" | "en", string> = {
  ka: "ბედნიერი ძაღლი Japandi ინტერიერში · Aylopet",
  en: "Happy dog in a Japandi interior · Aylopet",
};

export function WhatIsAylopetContent() {
  const { locale } = useLocale();
  const { whatIs } = getAbout(locale);
  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <SplitHero
          title={whatIs.title}
          imageSrc={IMAGES.heroDogJapandi}
          imageAlt={HERO_ALT[locale]}
          priority
        >
          <p className="whitespace-pre-line">{whatIs.body}</p>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {whatIs.missionTitle}
            </h2>
            <p className="mt-3">{whatIs.missionBody}</p>
          </div>
        </SplitHero>
      </main>
      <SiteFooter />
    </>
  );
}
