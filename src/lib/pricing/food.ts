/** Fresh food price range per kilogram, in GEL. */
export const FRESH_FOOD_PRICE_PER_KG_GEL = { min: 55, max: 60 } as const;

/** „55–60 ₾ / 1 კგ“ or „₾55–60 per 1 kg“. */
export function freshFoodPriceLabel(locale: "ka" | "en"): string {
  const { min, max } = FRESH_FOOD_PRICE_PER_KG_GEL;
  return locale === "ka" ? `${min}–${max} ₾ / 1 კგ` : `₾${min}–${max} per 1 kg`;
}

export type DogSize = "small" | "medium" | "large" | "giant";

export interface FreshFoodSizeExample {
  size: DogSize;
  breed: { ka: string; en: string };
  weightKg: { min: number; max: number };
  /** Indicative fresh-food cost per day, in GEL. */
  dailyGel: number;
}

/**
 * Daily cost by dog size for the landing page. The French bulldog (3 ₾) is the
 * anchor; the other sizes scale with daily energy need, which grows with body
 * weight^0.75 (resting energy requirement), rounded to whole lari.
 */
export const FRESH_FOOD_DAILY_BY_SIZE: FreshFoodSizeExample[] = [
  {
    size: "small",
    breed: { ka: "იორკშირის ტერიერი", en: "Yorkshire Terrier" },
    weightKg: { min: 2, max: 4 },
    dailyGel: 1,
  },
  {
    size: "medium",
    breed: { ka: "ფრანგული ბულდოგი", en: "French Bulldog" },
    weightKg: { min: 9, max: 14 },
    dailyGel: 3,
  },
  {
    size: "large",
    breed: { ka: "ლაბრადორი", en: "Labrador Retriever" },
    weightKg: { min: 25, max: 36 },
    dailyGel: 6,
  },
  {
    size: "giant",
    breed: { ka: "კავკასიური ნაგაზი", en: "Caucasian Shepherd" },
    weightKg: { min: 45, max: 70 },
    dailyGel: 10,
  },
];
