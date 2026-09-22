"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  DigestionCompareCard,
  LifespanCard,
} from "@/components/japandi/ScienceCards";
import { PageHero } from "@/components/marketing/PageHero";
import { ProseSection } from "@/components/marketing/ProseSection";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { getWhyFresh } from "@/lib/content/why-fresh";

export function WhyFreshFoodContent() {
  const { locale } = useLocale();
  const copy = getWhyFresh(locale);
  const [fact1, fact2] = copy.facts;

  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <PageHero title={copy.title} />
        <ProseSection>
          <p>{copy.philosophy}</p>
        </ProseSection>
        <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 lg:grid-cols-2 lg:px-8">
          <LifespanCard {...fact1} statLabel={copy.lifespanLabel} />
          <DigestionCompareCard {...fact2} moistureLabel={copy.moistureLabel} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
