import type { ActivityLevel } from "@/lib/dashboard";
import type {
  BcsScore,
  CalorieTarget,
  DietProfile,
  WeightLogEntry,
  WeightTargetRange,
} from "@/lib/pet-history/types";

// ---------------------------------------------------------------------------
// Age
// ---------------------------------------------------------------------------

export interface PetAge {
  years: number;
  months: number;
  totalMonths: number;
  label: string;
}

export function calculateAge(birthDate?: string): PetAge | null {
  if (!birthDate) return null;
  const born = new Date(birthDate);
  if (Number.isNaN(born.getTime())) return null;

  const now = new Date();
  let totalMonths =
    (now.getFullYear() - born.getFullYear()) * 12 +
    (now.getMonth() - born.getMonth());
  if (now.getDate() < born.getDate()) totalMonths -= 1;
  totalMonths = Math.max(0, totalMonths);

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const label =
    years === 0
      ? `${months} თვის`
      : months === 0
        ? `${years} წლის`
        : `${years} წლის ${months} თვის`;

  return { years, months, totalMonths, label };
}

// ---------------------------------------------------------------------------
// Energy requirement
// ---------------------------------------------------------------------------

/**
 * Resting energy requirement — the standard allometric formula used across
 * veterinary nutrition: RER = 70 × BW(kg)^0.75.
 */
export function restingEnergyRequirement(weightKg: number): number {
  if (weightKg <= 0) return 0;
  return 70 * Math.pow(weightKg, 0.75);
}

interface EnergyFactor {
  factor: number;
  label: string;
}

/**
 * Life-stage multiplier applied to RER. Growth outranks activity (a 3-month
 * puppy needs ~3× RER regardless of how much it walks), and neutering lowers
 * maintenance needs by roughly 10–20% in adults.
 */
function energyFactor(
  totalMonths: number | null,
  activity: ActivityLevel,
  neutered: boolean,
): EnergyFactor {
  if (totalMonths !== null && totalMonths < 4) {
    return { factor: 3, label: "ლეკვი · 4 თვემდე" };
  }
  if (totalMonths !== null && totalMonths < 12) {
    return { factor: 2, label: "ლეკვი · 4–12 თვე" };
  }

  const senior = totalMonths !== null && totalMonths >= 96;
  if (senior) {
    const factor = activity === "high" ? 1.8 : activity === "moderate" ? 1.6 : 1.4;
    return { factor, label: "ხანდაზმული · 8 წელი+" };
  }

  if (neutered) {
    const factor = activity === "high" ? 2 : activity === "moderate" ? 1.6 : 1.4;
    return { factor, label: "ზრდასრული · კასტრირებული" };
  }

  const factor = activity === "high" ? 2.2 : activity === "moderate" ? 1.8 : 1.6;
  return { factor, label: "ზრდასრული · არაკასტრირებული" };
}

export interface CalorieInput {
  weightKg: number;
  activity: ActivityLevel;
  ageMonths: number | null;
  neutered: boolean;
  diet: DietProfile | null;
}

export function calculateCalorieTarget({
  weightKg,
  activity,
  ageMonths,
  neutered,
  diet,
}: CalorieInput): CalorieTarget {
  const rerKcal = restingEnergyRequirement(weightKg);
  const { factor, label } = energyFactor(ageMonths, activity, neutered);
  const merKcal = rerKcal * factor;

  const kcalPer100g = diet?.kcalPer100g ?? null;
  const gramsPerDay =
    kcalPer100g && kcalPer100g > 0
      ? Math.round((merKcal / kcalPer100g) * 100)
      : null;

  const mealsPerDay = Math.max(1, diet?.mealsPerDay ?? 2);
  const gramsPerMeal =
    gramsPerDay === null ? null : Math.round(gramsPerDay / mealsPerDay);

  return {
    rerKcal: Math.round(rerKcal),
    merKcal: Math.round(merKcal),
    factor,
    factorLabel: label,
    gramsPerDay,
    gramsPerMeal,
  };
}

// ---------------------------------------------------------------------------
// Weight
// ---------------------------------------------------------------------------

export type WeightTrend = "up" | "down" | "stable" | "unknown";

export interface WeightSummary {
  latest: WeightLogEntry | null;
  previous: WeightLogEntry | null;
  deltaKg: number | null;
  deltaPercent: number | null;
  trend: WeightTrend;
  /** Ascending by date — safe to feed straight into a chart. */
  sorted: WeightLogEntry[];
  minKg: number;
  maxKg: number;
}

/** Below this, day-to-day scale noise shouldn't read as a real trend. */
const TREND_THRESHOLD_PERCENT = 1.5;

export function summariseWeight(logs: WeightLogEntry[]): WeightSummary {
  const sorted = [...logs].sort(
    (a, b) =>
      new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
  );

  const latest = sorted.at(-1) ?? null;
  const previous = sorted.length > 1 ? (sorted.at(-2) ?? null) : null;

  const deltaKg =
    latest && previous
      ? Number((latest.weightKg - previous.weightKg).toFixed(2))
      : null;
  const deltaPercent =
    deltaKg !== null && previous && previous.weightKg > 0
      ? (deltaKg / previous.weightKg) * 100
      : null;

  let trend: WeightTrend = "unknown";
  if (deltaPercent !== null) {
    if (Math.abs(deltaPercent) < TREND_THRESHOLD_PERCENT) trend = "stable";
    else trend = deltaPercent > 0 ? "up" : "down";
  }

  const values = sorted.map((entry) => entry.weightKg);
  return {
    latest,
    previous,
    deltaKg,
    deltaPercent,
    trend,
    sorted,
    minKg: values.length ? Math.min(...values) : 0,
    maxKg: values.length ? Math.max(...values) : 0,
  };
}

export type TargetPosition = "below" | "within" | "above" | "unknown";

export function weightAgainstTarget(
  weightKg: number | null,
  target: WeightTargetRange | null,
): TargetPosition {
  if (weightKg === null || !target) return "unknown";
  if (weightKg < target.minKg) return "below";
  if (weightKg > target.maxKg) return "above";
  return "within";
}

/**
 * Ideal-weight estimate from BCS: each point above the ideal 5/9 corresponds to
 * roughly 10% over ideal body weight, which is the rule of thumb used to set a
 * target range when no vet-assigned range exists yet.
 */
export function estimateTargetRange(
  weightKg: number,
  bcs: BcsScore | undefined,
): WeightTargetRange | null {
  if (!bcs || weightKg <= 0) return null;
  const idealWeight = weightKg / (1 + (bcs - 5) * 0.1);
  return {
    minKg: Number((idealWeight * 0.95).toFixed(1)),
    maxKg: Number((idealWeight * 1.05).toFixed(1)),
  };
}
