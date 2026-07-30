"use client";

import Image from "next/image";
import { PageHero } from "@/components/marketing/PageHero";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { AboutUsSection } from "@/components/about/AboutUsSection";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAbout } from "@/lib/content/about";
import { IMAGES } from "@/lib/images";

const KOKO_ALT: Record<"ka" | "en", string> = {
  ka: "პეკინესი · კოკო, Aylopet-ის შთაგონება",
  en: "Pekingese · Koko, Aylopet's inspiration",
};

const DANTE_ALT: Record<"ka" | "en", string> = {
  ka: "კანე კორსო · დანტე",
  en: "Cane Corso · Dante",
};

const KOKO_NAME: Record<"ka" | "en", string> = { ka: "კოკო", en: "Koko" };
const DANTE_NAME: Record<"ka" | "en", string> = { ka: "დანტე", en: "Dante" };

export function StoryContent() {
  const { locale } = useLocale();
  const { story, backLabel } = getAbout(locale);
  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <PageHero title={story.title} backHref="/about/what-is-aylopet" backLabel={backLabel} />
        <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <RevealOnScroll className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-soft">
                  <Image
                    src={IMAGES.storyPekingese}
                    alt={KOKO_ALT[locale]}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[var(--text-primary)]">
                    {KOKO_NAME[locale]}
                  </span>
                </div>
                <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-2xl shadow-soft">
                  <Image
                    src={IMAGES.storyCaneCorso}
                    alt={DANTE_ALT[locale]}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[var(--text-primary)]">
                    {DANTE_NAME[locale]}
                  </span>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.15} className="lg:col-span-7">
              <p className="whitespace-pre-line text-base leading-[1.75] text-[var(--text-body)]">
                {story.body}
              </p>
            </RevealOnScroll>
          </div>
        </section>
        <AboutUsSection />
      </main>
      <SiteFooter />
    </>
  );
}
