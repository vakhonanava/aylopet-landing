"use client";

import Image from "next/image";
import { PageHero } from "@/components/marketing/PageHero";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { AboutUsSection } from "@/components/about/AboutUsSection";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAbout } from "@/lib/content/about";
import { IMAGES } from "@/lib/images";

const PEPI_ALT: Record<"ka" | "en", string> = {
  ka: "ფრანგული ბულდოგი პეპი",
  en: "French Bulldog Pepi",
};

const DANTE_ALT: Record<"ka" | "en", string> = {
  ka: "კანე კორსო დანტე",
  en: "Cane Corso Dante",
};

const PEPI_NAME: Record<"ka" | "en", string> = { ka: "პეპი", en: "Pepi" };
const DANTE_NAME: Record<"ka" | "en", string> = { ka: "დანტე", en: "Dante" };
const DANTE_BREED: Record<"ka" | "en", string> = {
  ka: "კანე კორსო",
  en: "Cane Corso",
};

export function StoryContent() {
  const { locale } = useLocale();
  const { story } = getAbout(locale);
  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <PageHero title={story.title} />
        <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <RevealOnScroll className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                {/* Dante leads · his diagnosis is why the ecosystem exists. */}
                {/* Dante is a transparent cutout · contain + a soft backdrop,
                    so he is not cropped the way a photo would be. */}
                <figure className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-organic-xl)] bg-gradient-to-b from-[var(--bone-alabaster)] to-[var(--brand-accent-soft)] shadow-organic">
                  <Image
                    src={IMAGES.storyCaneCorso}
                    alt={DANTE_ALT[locale]}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-contain p-6"
                    priority
                  />
                  <figcaption className="absolute bottom-4 left-4 rounded-2xl bg-white/90 px-4 py-2 backdrop-blur-sm">
                    <span className="block font-display text-lg font-semibold text-[var(--forest-deep)]">
                      {DANTE_NAME[locale]}
                    </span>
                    <span className="block text-xs text-[var(--text-secondary)]">
                      {DANTE_BREED[locale]}
                    </span>
                  </figcaption>
                </figure>

                <figure className="relative mt-4 aspect-[4/3] overflow-hidden rounded-[var(--radius-organic-lg)] shadow-soft">
                  <Image
                    src={IMAGES.storyFrenchBulldog}
                    alt={PEPI_ALT[locale]}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[var(--text-primary)]">
                    {PEPI_NAME[locale]}
                  </figcaption>
                </figure>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.15} className="lg:col-span-7">
              <div className="max-w-prose space-y-6">
                {story.body
                  .split("\n")
                  .map((paragraph) => paragraph.trim())
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className={
                        index === 0
                          ? "text-lg leading-[1.8] text-[var(--forest-deep)] sm:text-xl"
                          : "text-base leading-[1.85] text-[var(--text-body)] sm:text-[1.0625rem]"
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </RevealOnScroll>
          </div>
        </section>
        <AboutUsSection />
      </main>
      <SiteFooter />
    </>
  );
}
