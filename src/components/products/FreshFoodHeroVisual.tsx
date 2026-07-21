"use client";

import { FoodLayersVisual } from "@/components/visual/FoodLayersVisual";

export function FreshFoodHeroVisual({ locale = "ka" }: { locale?: "ka" | "en" }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-bento)] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <FoodLayersVisual locale={locale} showLabels tilt className="h-full" />
    </div>
  );
}
