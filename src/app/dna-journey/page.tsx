import type { Metadata } from "next";
import { DnaBento } from "@/components/dna/DnaBento";
import { DnaCTA } from "@/components/dna/DnaCTA";
import { DnaHero } from "@/components/dna/DnaHero";
import { DnaUnifiedPlatform } from "@/components/dna/DnaUnifiedPlatform";
import { Journey } from "@/components/dna/Journey";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export const metadata: Metadata = {
  title: "Aylopet DNA · გენეტიკა, AI და პერსონალური კვება",
  description:
    "DNA ტესტირება, AI ანალიზი და პერსონალიზებული რაციონი · შექმნილი ზუსტად შენი ძაღლის გენეტიკური პროფილისთვის.",
};

export default function DnaJourneyPage() {
  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <DnaHero />
        <div id="platform">
          <DnaUnifiedPlatform />
        </div>
        <Journey />
        <DnaBento />
        <DnaCTA />
      </main>
      <SiteFooter />
    </>
  );
}
