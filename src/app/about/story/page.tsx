import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/marketing/PageHero";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { AboutUsSection } from "@/components/about/AboutUsSection";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ABOUT } from "@/lib/content/about";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Aylopet · ჩვენი ისტორია",
  description: ABOUT.story.body.slice(0, 160),
};

export default function StoryPage() {
  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <PageHero
          title={ABOUT.story.title}
          backHref="/about/what-is-aylopet"
          backLabel="ჩვენს შესახებ"
        />
        <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <RevealOnScroll className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-soft">
                  <Image
                    src={IMAGES.storyPekingese}
                    alt="პეკინესი · კოკო, Aylopet-ის შთაგონება"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[var(--text-primary)]">
                    კოკო
                  </span>
                </div>
                <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-2xl shadow-soft">
                  <Image
                    src={IMAGES.storyCaneCorso}
                    alt="კანე კორსო · დანტე"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[var(--text-primary)]">
                    დანტე
                  </span>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.15} className="lg:col-span-7">
              <p className="text-base leading-[1.75] text-[var(--text-body)]">
                {ABOUT.story.body}
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
