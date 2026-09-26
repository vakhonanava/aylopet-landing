/** Fresh food price range per kilogram, in GEL. */
export const FRESH_FOOD_PRICE_PER_KG_GEL = { min: 55, max: 60 } as const;

/** „55–60 ₾ / 1 კგ“ or „₾55–60 per 1 kg“. */
export function freshFoodPriceLabel(locale: "ka" | "en"): string {
  const { min, max } = FRESH_FOOD_PRICE_PER_KG_GEL;
  return locale === "ka" ? `${min}–${max} ₾ / 1 კგ` : `₾${min}–${max} per 1 kg`;
}

export type DogSize = "small" | "medium" | "large" | "giant";

/** Breeds with an illustrated portrait (`BreedPortrait`). */
export type ExampleBreed =
  | "yorkshire-terrier"
  | "french-bulldog"
  | "labrador"
  | "caucasian-shepherd";

export interface FreshFoodSizeClass {
  size: DogSize;
  /** Upper bound omitted for the open-ended top class („45+ კგ“). */
  weightKg: { min: number; max?: number };
  /** Starting daily fresh-food price, in GEL (for a dog at `weightKg.min`). */
  fromDailyGel: number;
  /** `photo` (under /public) replaces the illustrated `BreedPortrait` when set. */
  example: { id: ExampleBreed; ka: string; en: string; photo?: string };
}

/**
 * Daily fresh-food price by size class for the landing page. Each class starts
 * at 1.2 ₾ per kg of body weight per day, taken at the class's lower bound
 * (≈ 2.2% of body weight in food at the per-kg price above).
 */
export const FRESH_FOOD_SIZE_CLASSES: FreshFoodSizeClass[] = [
  {
    size: "small",
    weightKg: { min: 1, max: 10 },
    fromDailyGel: 1.2,
    example: {
      id: "yorkshire-terrier",
      ka: "იორკშირის ტერიერი",
      en: "Yorkshire Terrier",
      photo: "/images/breeds/yorkshire-terrier.webp",
    },
  },
  {
    size: "medium",
    weightKg: { min: 10, max: 25 },
    fromDailyGel: 12,
    example: {
      id: "french-bulldog",
      ka: "ფრანგული ბულდოგი",
      en: "French Bulldog",
      photo: "/images/breeds/french-bulldog.webp",
    },
  },
  {
    size: "large",
    weightKg: { min: 25, max: 45 },
    fromDailyGel: 30,
    example: {
      id: "labrador",
      ka: "ლაბრადორი",
      en: "Labrador Retriever",
      photo: "/images/breeds/labrador.webp",
    },
  },
  {
    size: "giant",
    weightKg: { min: 45 },
    fromDailyGel: 54,
    example: {
      id: "caucasian-shepherd",
      ka: "კავკასიური ნაგაზი",
      en: "Caucasian Shepherd",
      photo: "/images/breeds/caucasian-shepherd.webp",
    },
  },
];
