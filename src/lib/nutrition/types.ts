export type WeightUnit = "kg" | "lbs";

export type PetSex = "male" | "female";

export type BodyCondition = "underweight" | "ideal" | "overweight" | "obese";

export type CurrentDiet = "dry" | "wet" | "fresh" | "mixed" | "unknown";

export type TreatsLevel = "none" | "few" | "moderate" | "many";

export type MealsPerDay = 1 | 2 | 3;

export type ActivityLevel = "sedentary" | "moderate" | "active" | "working";

export type DietaryPreference =
  | "grain-free"
  | "single-protein"
  | "low-fat"
  | "sensitive-stomach"
  | "novel-protein";

export type AllergyOption =
  | "chicken"
  | "beef"
  | "dairy"
  | "wheat"
  | "soy"
  | "fish"
  | "lamb"
  | "eggs";

export type PrimaryGoal =
  | "weight-loss"
  | "maintenance"
  | "weight-gain"
  | "pickiness";

export interface OnboardingQuizState {
  petName: string;
  breed: string;
  sex: PetSex;
  ageMonths: number;
  weight: number;
  weightUnit: WeightUnit;
  targetWeight: number | null;
  neutered: boolean;
  bodyCondition: BodyCondition;
  mealsPerDay: MealsPerDay;
  currentDiet: CurrentDiet;
  treatsPerDay: TreatsLevel;
  activity: ActivityLevel;
  allergies: AllergyOption[];
  dietaryPreferences: DietaryPreference[];
  healthNotes: string;
  primaryGoal: PrimaryGoal;
}

export interface CaloricBlueprint {
  weightKg: number;
  rer: number;
  activityMultiplier: number;
  bodyConditionMultiplier: number;
  treatsAdjustmentKcal: number;
  mer: number;
  goalMultiplier: number;
  dailyKcal: number;
  perMealKcal: number;
  perMealGrams: number;
  mealsPerDay: MealsPerDay;
}

export const ALLERGY_OPTIONS: readonly { value: AllergyOption; label: string }[] = [
  { value: "chicken", label: "Chicken" },
  { value: "beef", label: "Beef" },
  { value: "dairy", label: "Dairy" },
  { value: "wheat", label: "Wheat" },
  { value: "soy", label: "Soy" },
  { value: "fish", label: "Fish" },
  { value: "lamb", label: "Lamb" },
  { value: "eggs", label: "Eggs" },
] as const;

export const DIETARY_PREFERENCES: readonly {
  value: DietaryPreference;
  label: string;
}[] = [
  { value: "grain-free", label: "Grain-free" },
  { value: "single-protein", label: "Single-protein" },
  { value: "low-fat", label: "Low-fat" },
  { value: "sensitive-stomach", label: "Sensitive stomach" },
  { value: "novel-protein", label: "Novel protein" },
] as const;

export const ACTIVITY_OPTIONS: readonly {
  value: ActivityLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "sedentary",
    label: "Sedentary",
    description: "Mostly indoors, short walks",
  },
  {
    value: "moderate",
    label: "Moderately Active",
    description: "Daily walks, regular play",
  },
  {
    value: "active",
    label: "Active",
    description: "Running, hiking, agility",
  },
  {
    value: "working",
    label: "Working",
    description: "Sport, herding, service work",
  },
] as const;

export const GOAL_OPTIONS: readonly {
  value: PrimaryGoal;
  label: string;
  description: string;
  multiplier: number;
}[] = [
  {
    value: "weight-loss",
    label: "Weight loss",
    description: "Gentle caloric deficit",
    multiplier: 0.8,
  },
  {
    value: "maintenance",
    label: "Maintenance",
    description: "Hold current healthy weight",
    multiplier: 1.0,
  },
  {
    value: "weight-gain",
    label: "Weight gain",
    description: "Controlled caloric surplus",
    multiplier: 1.15,
  },
  {
    value: "pickiness",
    label: "Fix pickiness",
    description: "Maintenance with palatable portions",
    multiplier: 1.0,
  },
] as const;

export const BODY_CONDITION_OPTIONS: readonly {
  value: BodyCondition;
  label: string;
  multiplier: number;
}[] = [
  { value: "underweight", label: "Underweight", multiplier: 1.08 },
  { value: "ideal", label: "Ideal", multiplier: 1.0 },
  { value: "overweight", label: "Overweight", multiplier: 0.92 },
  { value: "obese", label: "Obese", multiplier: 0.85 },
] as const;

export const CURRENT_DIET_OPTIONS: readonly {
  value: CurrentDiet;
  label: string;
}[] = [
  { value: "dry", label: "Dry kibble" },
  { value: "wet", label: "Wet / canned" },
  { value: "fresh", label: "Fresh / gently cooked" },
  { value: "mixed", label: "Mixed" },
  { value: "unknown", label: "Not sure" },
] as const;

export const TREATS_OPTIONS: readonly {
  value: TreatsLevel;
  label: string;
  percent: number;
}[] = [
  { value: "none", label: "None", percent: 0 },
  { value: "few", label: "A few", percent: 0.05 },
  { value: "moderate", label: "Moderate", percent: 0.1 },
  { value: "many", label: "Many", percent: 0.15 },
] as const;

export const MEALS_PER_DAY_OPTIONS: readonly MealsPerDay[] = [1, 2, 3] as const;

export { POPULAR_BREED_SUGGESTIONS as BREED_SUGGESTIONS } from "@/lib/content/dog-breeds";
