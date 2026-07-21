import type { Metadata } from "next";
import { SplitHero } from "@/components/japandi/SplitHero";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { ABOUT } from "@/lib/content/about";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Aylopet · რა არის Aylopet",
  description: ABOUT.whatIs.body,
};

export default function WhatIsAylopetPage() {
  const { whatIs } = ABOUT;
  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <SplitHero
          title={whatIs.title}
          imageSrc={IMAGES.heroDogJapandi}
          imageAlt="ბედნიერი ძაღლი Japandi ინტერიერში · Aylopet"
          priority
        >
          <p>{whatIs.body}</p>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {whatIs.missionTitle}
            </h2>
            <p className="mt-3">{whatIs.missionBody}</p>
          </div>
        </SplitHero>
      </main>
      <SiteFooter />
    </>
  );
}
