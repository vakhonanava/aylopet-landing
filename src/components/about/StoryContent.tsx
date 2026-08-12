"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Quote } from "lucide-react";
import { PageHero } from "@/components/marketing/PageHero";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAbout } from "@/lib/content/about";
import { IMAGES } from "@/lib/images";
import { fadeUp, staggerContainer } from "@/lib/motion";

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

/**
 * Mid-story emphasis breaks, pulled verbatim from `story.body`.
 * `afterParagraph` is the index (after `.split("\n").filter(Boolean)`) of the
 * paragraph each quote follows.
 */
const PULL_QUOTES: { afterParagraph: number; text: Record<"ka" | "en", string> }[] = [
  {
    afterParagraph: 2,
    text: {
      ka: "მან გააცნობიერა, რომ მხოლოდ საკვების შეცვლა საკმარისი არ იყო, საჭირო გახდა სრულიად ახალი, ყოვლისმომცველი სისტემა.",
      en: "He realized that simply changing the food wasn't enough. What was needed was an entirely new, comprehensive system.",
    },
  },
  {
    afterParagraph: 5,
    text: {
      ka: "ვახომ პროექტს დაამატა ინოვაციური იდეა, ხელოვნური ინტელექტის გაწვრთნა მონაცემთა (Data) შესაგროვებლად, რაც შემდგომში დაავადებების ადრეული პრევენციისა და ახალი მედიკამენტებისა და ვაქცინების მიგნების საშუალებას მოგვცემდა.",
      en: "Vakho brought an innovative idea to the project: training AI on the data they gathered, to eventually help catch disease earlier and discover new medications and vaccines.",
    },
  },
];

export function StoryContent() {
  const { locale } = useLocale();
  const { story } = getAbout(locale);
  const paragraphs = story.body
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

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

                {/* A short connecting thread between the two photos · one story, two dogs. */}
                <div className="relative mx-auto h-8 w-px bg-gradient-to-b from-[var(--brand-primary)]/30 to-[var(--brand-primary)]/10">
                  <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-primary)]/40" />
                </div>

                <figure className="relative overflow-hidden rounded-[var(--radius-organic-lg)] shadow-soft">
                  <Image
                    src={IMAGES.storyFrenchBulldog}
                    alt={PEPI_ALT[locale]}
                    width={640}
                    height={480}
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[var(--text-primary)]">
                    {PEPI_NAME[locale]}
                  </figcaption>
                </figure>
              </div>
            </RevealOnScroll>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="lg:col-span-7"
            >
              <div className="max-w-prose space-y-6">
                {paragraphs.map((paragraph, index) => (
                  <motion.div key={paragraph.slice(0, 40)} variants={fadeUp}>
                    <p
                      className={
                        index === 0
                          ? "text-lg leading-[1.8] text-[var(--forest-deep)] first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-display first-letter:text-5xl first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-[var(--brand-primary)] sm:text-xl"
                          : "text-base leading-[1.85] text-[var(--text-body)] sm:text-[1.0625rem]"
                      }
                    >
                      {paragraph}
                    </p>

                    {PULL_QUOTES.filter((q) => q.afterParagraph === index).map(
                      (q) => (
                        <blockquote
                          key={q.afterParagraph}
                          className="relative mt-8 rounded-[var(--radius-organic-lg)] border-l-4 border-[var(--brand-primary)] bg-[var(--brand-accent-soft)]/40 py-5 pl-6 pr-5 sm:pl-8"
                        >
                          <Quote
                            className="absolute -top-3 left-4 h-6 w-6 rotate-180 text-[var(--brand-primary)]/30"
                            aria-hidden
                            strokeWidth={2.5}
                          />
                          <p className="font-display text-xl leading-[1.5] text-[var(--forest-deep)] italic sm:text-2xl">
                            {q.text[locale]}
                          </p>
                        </blockquote>
                      ),
                    )}
                  </motion.div>
                ))}
              </div>

              <RevealOnScroll className="mt-14 flex items-center gap-4 max-w-prose">
                <span className="h-px flex-1 bg-[var(--border-light)]" />
                <Heart
                  className="h-4 w-4 shrink-0 fill-[var(--terracotta)] text-[var(--terracotta)]"
                  aria-hidden
                />
                <span className="h-px flex-1 bg-[var(--border-light)]" />
              </RevealOnScroll>
            </motion.div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
