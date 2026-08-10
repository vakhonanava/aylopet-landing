import type { Metadata } from "next";
import { AyliopetOnboarding } from "@/components/onboarding/AyliopetOnboarding";
import { OnboardingRedirectGuard } from "@/components/onboarding/OnboardingRedirectGuard";

export const metadata: Metadata = {
  title: "Aylopet · Platform Onboarding",
  description:
    "Join the waitlist, create your private profile, add your pet, and upload medical documents securely.",
};

export default function PlatformOnboardingPage() {
  return (
    <OnboardingRedirectGuard>
      <AyliopetOnboarding />
    </OnboardingRedirectGuard>
  );
}
