import type { Metadata } from "next";
import { FreshFoodPageContent } from "@/components/products/FreshFoodPageContent";
import { PRODUCTS } from "@/lib/content/products";

export const metadata: Metadata = {
  title: "Aylopet · ძაღლის ცოცხალი საკვები",
  description: PRODUCTS.freshFood.subheading,
};

export default function FreshFoodPage() {
  return <FreshFoodPageContent />;
}
