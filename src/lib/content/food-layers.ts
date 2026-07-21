import { IMAGES } from "@/lib/images";

export interface FoodLayer {
  id: string;
  labelKa: string;
  labelEn: string;
  color: string;
  highlight: string;
  image: string;
}

/** Tossable ingredient slices · base ration is the settled bowl, not tossed */
export const FOOD_LAYERS: FoodLayer[] = [
  {
    id: "greens",
    labelKa: "ბროკოლი & შვიკი",
    labelEn: "Broccoli & greens",
    color: "#4a7c59",
    highlight: "#6b9b6e",
    image: IMAGES.foodGreens,
  },
  {
    id: "berry",
    labelKa: "მოცვი",
    labelEn: "Blueberries",
    color: "#6b4a5c",
    highlight: "#9a6b7d",
    image: IMAGES.foodBerry,
  },
  {
    id: "squash",
    labelKa: "გოგრა",
    labelEn: "Squash",
    color: "#c67b5c",
    highlight: "#e8a07a",
    image: IMAGES.foodSquash,
  },
  {
    id: "chicken",
    labelKa: "ქათამი",
    labelEn: "Chicken",
    color: "#e8dcc8",
    highlight: "#f5efe3",
    image: IMAGES.foodChicken,
  },
  {
    id: "base",
    labelKa: "Aylopet რაციონი",
    labelEn: "Aylopet ration",
    color: "#3a5a40",
    highlight: "#6b8f71",
    image: IMAGES.foodRation,
  },
];
