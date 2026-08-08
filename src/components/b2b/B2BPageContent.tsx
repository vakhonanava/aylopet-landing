"use client";

import { B2BInquiryForm } from "@/components/b2b/B2BInquiryForm";
import { PawDecor } from "@/components/decor/PawDecor";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PageHero } from "@/components/marketing/PageHero";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export function B2BPageContent() {
  const { dict } = useLocale();
  const t = dict.b2b;

  return (
    <>
      <main className="relative flex-1 overflow-hidden bg-[var(--background-main)]">
        <PawDecor density="light" />
        <PageHero
          title={t.title}
          subtitle={t.subtitle}
          eyebrow={t.eyebrow}
        />
        <section className="relative z-[1] mx-auto max-w-2xl px-4 pb-24 sm:px-6 lg:px-8">
          <B2BInquiryForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
