import type { Metadata } from "next";
import { LegalPageContent } from "@/components/marketing/LegalPageContent";

export const metadata: Metadata = {
  title: "Aylopet · გამოყენების პირობები",
  description: "The legal terms governing your use of Aylopet's services.",
};

export default function TermsPage() {
  return <LegalPageContent page="terms" />;
}
