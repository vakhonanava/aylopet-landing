import { B2BSolutions } from "@/components/sections/B2BSolutions";
import { Hero3D } from "@/components/sections/Hero3D";
import { HowItWorksStrip } from "@/components/sections/HowItWorksStrip";
import { LandingChatbot } from "@/components/sections/LandingChatbot";
import { PlatformHub } from "@/components/sections/PlatformHub";
import { ScarcityBar } from "@/components/sections/ScarcityBar";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ValueComparisonSection } from "@/components/sections/ValueComparisonSection";
import { HomeFaqSection } from "@/components/sections/HomeFaqSection";
import { WaitlistSection } from "@/components/sections/WaitlistSection";
import { SocialProof } from "@/components/marketing/SocialProof";
import { StickyMobileCta } from "@/components/layout/StickyMobileCta";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import type { Metadata } from "next";

// Title/description/OG are inherited from the root layout; only the canonical
// is page-specific (a canonical in the layout would apply "/" to every route).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <main className="flex-1 bg-[var(--background-main)] pb-20 lg:pb-0">
        <Hero3D />
        <ScarcityBar />
        <ValueComparisonSection />
        <HowItWorksStrip />
        <PlatformHub variant="home" />
        <LandingChatbot />
        <SocialProof />
        <HomeFaqSection />
        <B2BSolutions />
        <TrustStrip />
        <WaitlistSection />
      </main>
      <SiteFooter />
      <StickyMobileCta />
    </>
  );
}
