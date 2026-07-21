import type { Metadata } from "next";
import Image from "next/image";
import { Play } from "lucide-react";
import {
  PasteurizationCard,
  ProcessTimeline,
} from "@/components/japandi/ProcessAndAi";
import { PageHero } from "@/components/marketing/PageHero";
import { ProseSection } from "@/components/marketing/ProseSection";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ABOUT } from "@/lib/content/about";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Aylopet · წარმოების პროცესი და ხარისხი",
  description: ABOUT.process.subInfo.slice(0, 160),
};

export default function ProcessPage() {
  const { process } = ABOUT;
  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <PageHero
          title={process.title}
          backHref="/about/what-is-aylopet"
          backLabel="ჩვენს შესახებ"
        />
        <ProseSection>
          <p>{process.subInfo}</p>
        </ProseSection>

        <RevealOnScroll className="mx-auto max-w-4xl px-6 pb-12 lg:px-8">
          <div className="relative aspect-video overflow-hidden rounded-[var(--radius-bento)] border border-[var(--border-light)] shadow-[var(--shadow-diffuse)]">
            <Image
              src={IMAGES.production}
              alt="Natural Selection · წარმოების პროცესი ისრაელში"
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

        <ProcessTimeline />
        <PasteurizationCard text={process.pasteurizationNote} />
      </main>
      <SiteFooter />
    </>
  );
}
