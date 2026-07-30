"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { PasteurizationCard, ProcessTimeline } from "@/components/japandi/ProcessAndAi";
import { PageHero } from "@/components/marketing/PageHero";
import { ProseSection } from "@/components/marketing/ProseSection";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAbout } from "@/lib/content/about";
import { IMAGES } from "@/lib/images";

const VIDEO_ALT: Record<"ka" | "en", string> = {
  ka: "Natural Selection · წარმოების პროცესი ისრაელში",
  en: "Natural Selection · production process in Israel",
};

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
          <div className="relative aspect-video overflow-hidden rounded-[var(--radius-bento)] border border-[var(--border-light)] shadow-[var(--shadow-diffuse)]">
            <Image
              src={IMAGES.production}
              alt={VIDEO_ALT[locale]}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--brand-primary)]/30 backdrop-blur-[2px]">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-[var(--brand-primary)] shadow-soft">
                <Play className="ml-1 h-7 w-7" fill="currentColor" />
              </span>
            </div>
            <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-4 py-2 text-xs font-medium text-[var(--text-primary)] backdrop-blur-sm">
              Natural Selection · Israel
            </div>
          </div>
        </RevealOnScroll>

        <ProcessTimeline locale={locale} />
        <PasteurizationCard text={process.pasteurizationNote} locale={locale} />
      </main>
      <SiteFooter />
    </>
  );
}
