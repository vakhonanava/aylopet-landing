import type { Metadata } from "next";
import { ScientificOverviewContent } from "@/components/marketing/ScientificOverviewContent";
import { KNOWLEDGE } from "@/lib/content/knowledge";

export const metadata: Metadata = {
  title: "Aylopet · მეცნიერული მიმოხილვა",
  description: KNOWLEDGE.article.introduction.slice(0, 160),
};

export default function ScientificOverviewPage() {
  return <ScientificOverviewContent />;
}
