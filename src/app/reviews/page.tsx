import type { Metadata } from "next";
import { ReviewsPageContent } from "@/components/reviews/ReviewsPageContent";

export const metadata: Metadata = {
  title: "შეფასებები",
  description: "მომხმარებელთა შეფასებები და გამოცდილებები.",
};

export default function ReviewsPage() {
  return <ReviewsPageContent />;
}
