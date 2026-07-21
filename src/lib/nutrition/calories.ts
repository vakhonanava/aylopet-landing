import {
  BODY_CONDITION_OPTIONS,
  GOAL_OPTIONS,
  TREATS_OPTIONS,
  type ActivityLevel,
  type BodyCondition,
  type CaloricBlueprint,
  type MealsPerDay,
  type OnboardingQuizState,
  type PrimaryGoal,
  type TreatsLevel,
  type WeightUnit,
} from "@/lib/nutrition/types";

const KCAL_PER_GRAM_GENTLY_COOKED = 4;

export function getGoalMultiplier(goal: PrimaryGoal): number {
  return GOAL_OPTIONS.find((g) => g.value === goal)?.multiplier ?? 1.0;
}

export function getBodyConditionMultiplier(condition: BodyCondition): number {
  return (
    BODY_CONDITION_OPTIONS.find((b) => b.value === condition)?.multiplier ?? 1.0
  );
}

export function getTreatsPercent(level: TreatsLevel): number {
  return TREATS_OPTIONS.find((t) => t.value === level)?.percent ?? 0;
}

export function lbsToKg(lbs: number): number {
  return lbs / 2.20462;
}

export function toWeightKg(weight: number, unit: WeightUnit): number {
  return unit === "kg" ? weight : lbsToKg(weight);
}

export function calculateRER(weightKg: number): number {
  if (weightKg <= 0) return 0;
  return 70 * Math.pow(weightKg, 0.75);
}

export function getActivityMultiplier(params: {
  ageMonths: number;
  activity: ActivityLevel;
  neutered: boolean;
}): number {
  const { ageMonths, activity, neutered } = params;

  if (ageMonths < 4) return 3.0;
  if (ageMonths < 12) return 2.0;

  switch (activity) {
    case "sedentary":
      return 1.2;
    case "moderate":
      return neutered ? 1.6 : 1.8;
    case "active":
      return 2.0;
    case "working":
      return 3.0;
  }
}

export function calculateMER(rer: number, multiplier: number): number {
  return rer * multiplier;
}

export function calculateMealPortions(
  merKcal: number,
  mealsPerDay: MealsPerDay = 2,
  treatsPercent = 0,
): Pick<
  CaloricBlueprint,
  | "dailyKcal"
  | "perMealKcal"
  | "perMealGrams"
  | "treatsAdjustmentKcal"
  | "mealsPerDay"
> {
  const treatsAdjustmentKcal = Math.round(merKcal * treatsPercent);
  const foodKcal = Math.max(0, merKcal - treatsAdjustmentKcal);
  const dailyKcal = Math.round(foodKcal);
  const perMealKcal = Math.round(foodKcal / mealsPerDay);
  const perMealGrams = Math.round(perMealKcal / KCAL_PER_GRAM_GENTLY_COOKED);
  return {
    dailyKcal,
    perMealKcal,
    perMealGrams,
    treatsAdjustmentKcal,
    mealsPerDay,
  };
}

export function buildCaloricBlueprint(
  state: Pick<
    OnboardingQuizState,
    | "weight"
    | "weightUnit"
    | "ageMonths"
    | "activity"
    | "neutered"
    | "primaryGoal"
    | "bodyCondition"
    | "mealsPerDay"
    | "treatsPerDay"
  >,
): CaloricBlueprint {
  const weightKg = toWeightKg(state.weight, state.weightUnit);
  const rer = calculateRER(weightKg);
  const activityMultiplier = getActivityMultiplier({
    ageMonths: state.ageMonths,
    activity: state.activity,
    neutered: state.neutered,
  });
  const bodyConditionMultiplier = getBodyConditionMultiplier(state.bodyCondition);
  const mer = calculateMER(
    rer,
    activityMultiplier * bodyConditionMultiplier,
  );
  const goalMultiplier = getGoalMultiplier(state.primaryGoal);
  const goalAdjustedMer = mer * goalMultiplier;
  const treatsPercent = getTreatsPercent(state.treatsPerDay);
  const portions = calculateMealPortions(
    goalAdjustedMer,
    state.mealsPerDay,
    treatsPercent,
  );

  return {
    weightKg,
    rer: Math.round(rer),
    activityMultiplier,
    bodyConditionMultiplier,
    mer: Math.round(mer),
    goalMultiplier,
    ...portions,
  };
}

export function getMultiplierLabel(
  ageMonths: number,
  activity: ActivityLevel,
  neutered: boolean,
): string {
  if (ageMonths < 4) return "Puppy (< 4 months)";
  if (ageMonths < 12) return "Puppy (4 to 12 months)";
  if (activity === "sedentary") return "Obesity prone / Sedentary";
  if (activity === "moderate") return neutered ? "Neutered adult" : "Intact adult";
  if (activity === "active") return "Active";
  return "Working";
}
