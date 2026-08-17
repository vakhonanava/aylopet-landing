import type { LabMetricEntry, LabMetricKey } from "@/lib/pet-history/types";

export type LabMetricCategory = "cbc" | "chemistry" | "urinalysis";

export interface LabMetricDef {
  key: LabMetricKey;
  label: string;
  unit: string;
  category: LabMetricCategory;
  /**
   * General adult-dog reference interval, for a rough high/low flag only.
   * Individual labs calibrate their own ranges per analyzer — the panel a
   * user uploads should always be read against the range printed on it.
   */
  normalMin: number;
  normalMax: number;
  /** Decimal places used for display and input rounding. */
  decimals: number;
}

export const LAB_METRIC_CATEGORY_LABELS: Record<LabMetricCategory, string> = {
  cbc: "სისხლის საერთო ანალიზი (CBC)",
  chemistry: "ბიოქიმიური პანელი",
  urinalysis: "შარდის ანალიზი",
};

export const LAB_METRIC_DEFS: LabMetricDef[] = [
  // CBC
  { key: "wbc", label: "თეთრი უჯრედები (WBC)", unit: "×10⁹/L", category: "cbc", normalMin: 6, normalMax: 17, decimals: 1 },
  { key: "rbc", label: "წითელი უჯრედები (RBC)", unit: "×10¹²/L", category: "cbc", normalMin: 5.5, normalMax: 8.5, decimals: 2 },
  { key: "hemoglobin", label: "ჰემოგლობინი", unit: "გ/დლ", category: "cbc", normalMin: 12, normalMax: 18, decimals: 1 },
  { key: "hematocrit", label: "ჰემატოკრიტი (PCV)", unit: "%", category: "cbc", normalMin: 37, normalMax: 55, decimals: 0 },
  { key: "platelets", label: "თრომბოციტები", unit: "×10⁹/L", category: "cbc", normalMin: 200, normalMax: 500, decimals: 0 },

  // Chemistry
  { key: "bun", label: "შარდოვანა (BUN)", unit: "მგ/დლ", category: "chemistry", normalMin: 7, normalMax: 27, decimals: 0 },
  { key: "creatinine", label: "კრეატინინი", unit: "მგ/დლ", category: "chemistry", normalMin: 0.5, normalMax: 1.5, decimals: 2 },
  { key: "alt", label: "ALT", unit: "U/L", category: "chemistry", normalMin: 10, normalMax: 100, decimals: 0 },
  { key: "ast", label: "AST", unit: "U/L", category: "chemistry", normalMin: 0, normalMax: 50, decimals: 0 },
  { key: "alp", label: "ტუტე ფოსფატაზა (ALP)", unit: "U/L", category: "chemistry", normalMin: 20, normalMax: 150, decimals: 0 },
  { key: "totalBilirubin", label: "საერთო ბილირუბინი", unit: "მგ/დლ", category: "chemistry", normalMin: 0, normalMax: 0.5, decimals: 2 },
  { key: "glucose", label: "გლუკოზა", unit: "მგ/დლ", category: "chemistry", normalMin: 70, normalMax: 120, decimals: 0 },
  { key: "totalProtein", label: "საერთო ცილა", unit: "გ/დლ", category: "chemistry", normalMin: 5.4, normalMax: 7.5, decimals: 1 },
  { key: "albumin", label: "ალბუმინი", unit: "გ/დლ", category: "chemistry", normalMin: 2.6, normalMax: 4, decimals: 1 },
  { key: "calcium", label: "კალციუმი", unit: "მგ/დლ", category: "chemistry", normalMin: 9, normalMax: 11.5, decimals: 1 },
  { key: "phosphorus", label: "ფოსფორი", unit: "მგ/დლ", category: "chemistry", normalMin: 2.5, normalMax: 6, decimals: 1 },
  { key: "cholesterol", label: "ქოლესტერინი", unit: "მგ/დლ", category: "chemistry", normalMin: 110, normalMax: 320, decimals: 0 },

  // Urinalysis
  { key: "urineSpecificGravity", label: "შარდის სიმკვრივე", unit: "", category: "urinalysis", normalMin: 1.015, normalMax: 1.045, decimals: 3 },
  { key: "urineProtein", label: "ცილა შარდში", unit: "მგ/დლ", category: "urinalysis", normalMin: 0, normalMax: 30, decimals: 0 },
];

export function labMetricDef(key: LabMetricKey): LabMetricDef | undefined {
  return LAB_METRIC_DEFS.find((def) => def.key === key);
}

export type LabFlagStatus = "low" | "normal" | "high";

export function labFlagStatus(key: LabMetricKey, value: number): LabFlagStatus {
  const def = labMetricDef(key);
  if (!def) return "normal";
  if (value < def.normalMin) return "low";
  if (value > def.normalMax) return "high";
  return "normal";
}

export function sortLabMetricEntries(entries: LabMetricEntry[]): LabMetricEntry[] {
  return [...entries].sort(
    (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
  );
}

export function latestLabMetricEntry(
  entries: LabMetricEntry[],
): LabMetricEntry | null {
  const sorted = sortLabMetricEntries(entries);
  return sorted.at(-1) ?? null;
}

export interface FlaggedLabValue {
  key: LabMetricKey;
  def: LabMetricDef;
  value: number;
  status: LabFlagStatus;
}

/** Out-of-range values from the most recent panel — the "needs attention" list. */
export function flaggedLabValues(entries: LabMetricEntry[]): FlaggedLabValue[] {
  const latest = latestLabMetricEntry(entries);
  if (!latest) return [];

  const flagged: FlaggedLabValue[] = [];
  for (const key of Object.keys(latest.values) as LabMetricKey[]) {
    const value = latest.values[key];
    if (value === undefined) continue;
    const status = labFlagStatus(key, value);
    if (status === "normal") continue;
    const def = labMetricDef(key);
    if (!def) continue;
    flagged.push({ key, def, value, status });
  }
  return flagged;
}
