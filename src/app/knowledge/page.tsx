import type { Metadata } from "next";
import { KnowledgeHubContent } from "@/components/marketing/KnowledgeHubContent";

export const metadata: Metadata = {
  title: "ცოდნის ცენტრი",
  description:
    "ცხოველთა ჯანმრთელობისა და კეთილდღეობის გზამკვლევი: კვების მეცნიერება და პრაქტიკული რჩევები ძაღლის მფლობელებისთვის.",
};

export default function KnowledgeHubPage() {
  return <KnowledgeHubContent />;
}
