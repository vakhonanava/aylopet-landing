import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { ProseSection } from "@/components/marketing/ProseSection";
import {
  DigestionCompareCard,
  LifespanCard,
} from "@/components/japandi/ScienceCards";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { WHY_FRESH } from "@/lib/content/why-fresh";

export const metadata: Metadata = {
  title: "Aylopet, რატომ ცოცხალი საკვები?",
  description: WHY_FRESH.philosophy,
};

export default function WhyFreshFoodPage() {
  const [fact1, fact2] = WHY_FRESH.facts;
  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <PageHero title={WHY_FRESH.title} />
        <ProseSection>
          <p>{WHY_FRESH.philosophy}</p>
        </ProseSection>
        <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 lg:grid-cols-2 lg:px-8">
          <LifespanCard {...fact1} />
          <DigestionCompareCard {...fact2} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
