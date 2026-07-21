import type { Metadata } from "next";
import { LegalPageContent } from "@/components/marketing/LegalPageContent";

export const metadata: Metadata = {
  title: "Aylopet · კონფიდენციალურობის პოლიტიკა",
  description:
    "How Aylopet accesses, collects, stores, uses, and shares your personal information.",
};

export default function PrivacyPage() {
  return <LegalPageContent page="privacy" />;
}
