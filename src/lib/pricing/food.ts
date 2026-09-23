/** Fresh food price range per kilogram, in GEL. */
export const FRESH_FOOD_PRICE_PER_KG_GEL = { min: 55, max: 60 } as const;

/** „55–60 ₾ / 1 კგ“ or „₾55–60 per 1 kg“. */
export function freshFoodPriceLabel(locale: "ka" | "en"): string {
  const { min, max } = FRESH_FOOD_PRICE_PER_KG_GEL;
  return locale === "ka" ? `${min}–${max} ₾ / 1 კგ` : `₾${min}–${max} per 1 kg`;
}
