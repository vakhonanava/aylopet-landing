import type { Metadata } from "next";
import { LegalPageContent } from "@/components/marketing/LegalPageContent";

export const metadata: Metadata = {
  title: "Aylopet · ხელმისაწვდომობის განცხადება",
  description: "Aylopet's commitment to making its website accessible to everyone.",
};

export default function AccessibilityPage() {
  return <LegalPageContent page="accessibility" />;
}
