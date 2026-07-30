"use client";

import { DnaLeafFusion, GeometricPattern } from "@/components/japandi/LineArtIcons";
import { ValueCardsInteractive } from "@/components/japandi/ValueCardsInteractive";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAbout } from "@/lib/content/about";

const VALUES_HEADING: Record<"ka" | "en", string> = {
  ka: "ჩვენი ძირითადი ღირებულებები",
  en: "Our core values",
};

export function VisionContent() {
  const { locale } = useLocale();
  const { vision, values } = getAbout(locale);
  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <section className="relative overflow-hidden bg-[var(--background-secondary)] pt-24 pb-16 lg:pt-28">
          <GeometricPattern className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
          <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
            <RevealOnScroll className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
                  {vision.title}
                </h1>
                <p className="mt-6 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-[var(--text-body)]">
                  {vision.body}
                </p>
              </div>
              <DnaLeafFusion className="mx-auto h-48 w-48 lg:h-56 lg:w-56" />
            </RevealOnScroll>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {VALUES_HEADING[locale]}
          </h2>
        </section>
        <ValueCardsInteractive items={values} />
      </main>
      <SiteFooter />
    </>
  );
}
