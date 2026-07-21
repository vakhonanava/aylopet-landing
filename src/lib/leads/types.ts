import { z } from "zod";

export const referralSources = [
  "social-media",
  "friend",
  "google",
  "instagram",
  "facebook",
  "other",
] as const;

export const primaryGoals = [
  "weight-loss",
  "maintenance",
  "weight-gain",
  "pickiness",
  "allergies",
  "not-sure",
] as const;

/** What users are most excited about from the platform */
export const productExpectations = [
  "ai-nutrition",
  "dna-insights",
  "fresh-food",
  "vet-copilot",
  "pet-dashboard",
  "b2b-partnership",
] as const;

/** Products a waitlist member wants to hear about (multi-select). */
export const productInterests = [
  "food",
  "ai_nutritionist",
  "dna_test",
  "smart_collar",
] as const;

export type ProductInterest = (typeof productInterests)[number];

/** Feature wishlist for product development */
export const featureExpectations = [
  "personalized-portions",
  "health-tracking",
  "breed-specific-diet",
  "allergy-management",
  "delivery-zones",
  "mobile-app",
  "multi-pet",
  "data-export",
] as const;

export const earlyAdopterSchema = z.object({
  ownerName: z.string().min(2, "მიუთითე სახელი"),
  email: z.string().email("არასწორი ელ. ფოსტა"),
  phone: z
    .string()
    .min(9, "მიუთითე ტელეფონის ნომერი")
    .regex(/^[\d\s+()-]+$/, "არასწორი ტელეფონის ფორმატი"),
  city: z.string().min(2, "მიუთითე ქალაქი"),
  dogName: z.string().min(1, "მიუთითე ძაღლის სახელი"),
  breed: z.string().min(1, "მიუთითე ჯიში"),
  ageMonths: z.number().int().positive("მიუთითე ასაკი"),
  weightKg: z.number().positive("მიუთითე წონა"),
  neutered: z.boolean(),
  allergies: z.array(z.string()),
  primaryGoal: z.enum(primaryGoals),
  productExpectation: z.enum(productExpectations),
  productInterests: z
    .array(z.enum(productInterests))
    .min(1, "აირჩიე მინიმუმ ერთი პროდუქტი"),
  featureExpectations: z
    .array(z.enum(featureExpectations))
    .min(1, "აირჩიე მინიმუმ ერთი მოლოდინი"),
  featureWishlist: z
    .string()
    .min(10, "მიუთითე რა ფუნქციებს ან პროდუქტებს გელით"),
  referralSource: z.enum(referralSources),
  notes: z.string().optional(),
  wantsDnaKit: z.boolean(),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "თანხმობა სავალდებულოა" }),
});

export type EarlyAdopterInput = z.infer<typeof earlyAdopterSchema>;

export interface StoredLead extends EarlyAdopterInput {
  id: string;
  position: number;
  status: "pending" | "contacted" | "approved";
  createdAt: string;
}

export const REFERRAL_LABELS: Record<
  (typeof referralSources)[number],
  string
> = {
  "social-media": "სოციალური მედია",
  friend: "მეგობრის რეკომენდაცია",
  google: "Google ძებნა",
  instagram: "Instagram",
  facebook: "Facebook",
  other: "სხვა",
};

export const GOAL_LABELS: Record<(typeof primaryGoals)[number], string> = {
  "weight-loss": "წონის დაკლება",
  maintenance: "წონის შენარჩუნება",
  "weight-gain": "წონის მომატება",
  pickiness: "გულუადობის გამოსწორება",
  allergies: "ალერგიების მართვა",
  "not-sure": "ჯერ არ ვიცი",
};

export const PRODUCT_EXPECTATION_LABELS: Record<
  (typeof productExpectations)[number],
  string
> = {
  "ai-nutrition": "AI ნუტრიცია და კალორიული გეგმა",
  "dna-insights": "DNA გენომური ინსაითები",
  "fresh-food": "ცოცხალი Gently Cooked საკვები",
  "vet-copilot": "AylopetAI",
  "pet-dashboard": "ციფრული პეტ პროფილი",
  "b2b-partnership": "B2B პარტნიორობა",
};

export const PRODUCT_INTEREST_LABELS: Record<ProductInterest, string> = {
  food: "🥩 საკვები",
  ai_nutritionist: "🧠 AI ნუტრიციოლოგი",
  dna_test: "🧬 DNA ტესტი",
  smart_collar: "🔌 ეილოფეთ სმართ ქოლარი",
};

export const PRODUCT_INTEREST_LABELS_EN: Record<ProductInterest, string> = {
  food: "🥩 Fresh Food",
  ai_nutritionist: "🧠 AI Nutritionist",
  dna_test: "🧬 DNA Test",
  smart_collar: "🔌 Aylopet Smart Collar",
};

export function primaryExpectationFromInterests(
  interests: ProductInterest[],
): EarlyAdopterInput["productExpectation"] {
  const first = interests[0];
  if (first === "food") return "fresh-food";
  if (first === "dna_test") return "dna-insights";
  if (first === "smart_collar") return "pet-dashboard";
  return "ai-nutrition";
}

export const FEATURE_EXPECTATION_LABELS: Record<
  (typeof featureExpectations)[number],
  string
> = {
  "personalized-portions": "პერსონალური პორციები",
  "health-tracking": "ჯანმრთელობის ტრეკინგი",
  "breed-specific-diet": "ჯიშზე მორგებული დიეტა",
  "allergy-management": "ალერგიის მართვა",
  "delivery-zones": "მიწოდების ზონები",
  "mobile-app": "მობილური აპლიკაცია",
  "multi-pet": "რამდენიმე ცხოველის პროფილი",
  "data-export": "მონაცემების ექსპორტი",
};
