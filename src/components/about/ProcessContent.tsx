"use client";

import { PasteurizationCard, ProcessTimeline } from "@/components/japandi/ProcessAndAi";
import { ProductionVideo } from "@/components/about/ProductionVideo";
import { PageHero } from "@/components/marketing/PageHero";
import { ProseSection } from "@/components/marketing/ProseSection";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAbout } from "@/lib/content/about";

export function ProcessContent() {
  const { locale } = useLocale();
  const { process, backLabel } = getAbout(locale);
  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <PageHero title={process.title} backHref="/about/what-is-aylopet" backLabel={backLabel} />
        <ProseSection>
          <p className="whitespace-pre-line">{process.subInfo}</p>
        </ProseSection>

        <RevealOnScroll className="mx-auto max-w-4xl px-6 pb-12 lg:px-8">
          <ProductionVideo locale={locale} />
        </RevealOnScroll>

        <ProcessTimeline locale={locale} />
        <PasteurizationCard text={process.pasteurizationNote} locale={locale} />
      </main>
      <SiteFooter />
    </>
  );
}
