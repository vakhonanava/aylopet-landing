/** Brand-safe imagery · dogs & people only; food layers use ingredient macros */
export const IMAGES = {
  heroDogJapandi:
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1400&q=90&auto=format&fit=crop",
  heroDog3D:
    "https://images.unsplash.com/photo-1552053831-71594a27632d?w=1400&q=90&auto=format&fit=crop",
  storyPekingese:
    "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=900&q=90&auto=format&fit=crop",
  /**
   * Dante · Cane Corso, the founder's dog shown in "Our story".
   * Transparent-background cutout · render it with object-contain over a
   * background, never object-cover, or the crop clips his head and legs.
   */
  storyCaneCorso: "/images/Dante.png",
  aiDog:
    "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=1200&q=90&auto=format&fit=crop",
  healthDog3D:
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1400&q=90&auto=format&fit=crop",
  production:
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1400&q=90&auto=format&fit=crop",
  earlyAccess3D:
    "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&q=90&auto=format&fit=crop",
  /** Ingredient macros for FoodLayersVisual · no retail packaging */
  foodGreens:
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=85&auto=format&fit=crop",
  foodBerry:
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=85&auto=format&fit=crop",
  foodSquash:
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=85&auto=format&fit=crop",
  foodBeef:
    "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=800&q=85&auto=format&fit=crop",
  foodChicken:
    "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&q=85&auto=format&fit=crop",
  foodRation:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=85&auto=format&fit=crop",
  coffeeCup: "/images/coffee-cup.jpg",
  aylopetAi:
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=900&q=90&auto=format&fit=crop",
} as const;

/** @deprecated Use FoodLayersVisual · kept for resolveImage aliases */
export const FOOD_VISUAL_PLACEHOLDER = "/brand/logo.svg";

export const IMAGE_ALIASES = {
  "/images/food-macro.png": FOOD_VISUAL_PLACEHOLDER,
  "/images/dog-portrait.png": IMAGES.healthDog3D,
  "/images/dna-kit.png": FOOD_VISUAL_PLACEHOLDER,
} as const;

export function resolveImage(src: string): string {
  if (src in IMAGE_ALIASES) {
    return IMAGE_ALIASES[src as keyof typeof IMAGE_ALIASES];
  }
  return src;
}
