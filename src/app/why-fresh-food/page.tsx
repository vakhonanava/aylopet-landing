import type { Metadata } from "next";
import { WhyFreshFoodContent } from "@/components/marketing/WhyFreshFoodContent";
import { WHY_FRESH } from "@/lib/content/why-fresh";

export const metadata: Metadata = {
  title: "რატომ ცოცხალი საკვები?",
  description: WHY_FRESH.philosophy,
};

export default function WhyFreshFoodPage() {
  return <WhyFreshFoodContent />;
}
