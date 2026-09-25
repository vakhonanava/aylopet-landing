import type { Metadata } from "next";
import { AylopetAiPageContent } from "@/components/products/AylopetAiPageContent";
import { PRODUCTS } from "@/lib/content/products";

export const metadata: Metadata = {
  title: "AylopetAI",
  description: PRODUCTS.ai.body.slice(0, 160),
};

export default function AylopetAiPage() {
  return <AylopetAiPageContent />;
}
