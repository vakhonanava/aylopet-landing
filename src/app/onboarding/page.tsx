import type { Metadata } from "next";
import { OnboardingPageContent } from "@/components/onboarding/OnboardingPageContent";

export const metadata: Metadata = {
  title: "Aylopet · AylopetAI Onboarding Quiz",
  description:
    "A 17-step interactive quiz where AylopetAI learns about your dog to build a personalized nutrition profile.",
};

export default function OnboardingPage() {
  return <OnboardingPageContent />;
}
