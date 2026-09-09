import type { Locale } from "@/lib/i18n/types";

export interface MedicalRecord {
  chronicConditions: string[];
  surgeriesAndTraumas: string;
  allergies: string[];
  geneticRisks: string[];
  updatedAt: string | null;
}

export type SeverityLevel = "low" | "medium" | "high" | "critical";

export interface SeverityOption {
  value: SeverityLevel;
  label: string;
  colorClass: string;
  dotClass: string;
}

export const SEVERITY_LEVELS: SeverityOption[] = [
  {
    value: "low",
    label: "მსუბუქი",
    colorClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClass: "bg-emerald-500",
  },
  {
    value: "medium",
    label: "საშუალო",
    colorClass: "border-amber-200 bg-amber-50 text-amber-700",
    dotClass: "bg-amber-500",
  },
  {
    value: "high",
    label: "მაღალი",
    colorClass: "border-orange-200 bg-orange-50 text-orange-700",
    dotClass: "bg-orange-500",
  },
  {
    value: "critical",
    label: "კრიტიკული",
    colorClass: "border-red-200 bg-red-50 text-red-700",
    dotClass: "bg-red-500",
  },
];

export const SEVERITY_LABELS: Record<SeverityLevel, string> = {
  low: "მსუბუქი",
  medium: "საშუალო",
  high: "მაღალი",
  critical: "კრიტიკული",
};

export const SYMPTOM_TYPE_PRESETS = [
  "ღებინება",
  "დიარეა",
  "ქავილი",
  "აპათია/უენერგეტიკობა",
  "კოჭლობა",
  "მადის დაქვეითება",
] as const;

/* -------------------------- Localized label maps -------------------------- */

const SEVERITY_LABELS_EN: Record<SeverityLevel, string> = {
  low: "Mild",
  medium: "Moderate",
  high: "High",
  critical: "Critical",
};

export function getSeverityLabels(locale: Locale): Record<SeverityLevel, string> {
  return locale === "ka" ? SEVERITY_LABELS : SEVERITY_LABELS_EN;
}

export function getSeverityLevels(locale: Locale): SeverityOption[] {
  const labels = getSeverityLabels(locale);
  return SEVERITY_LEVELS.map((level) => ({ ...level, label: labels[level.value] }));
}

const SYMPTOM_TYPE_PRESETS_EN = [
  "Vomiting",
  "Diarrhoea",
  "Itching",
  "Lethargy / low energy",
  "Limping",
  "Reduced appetite",
] as const;

/**
 * Symptom types are stored as free text, so a log written in one language keeps
 * its original wording. Only the preset chips follow the interface language.
 */
export function getSymptomPresets(locale: Locale): readonly string[] {
  return locale === "ka" ? SYMPTOM_TYPE_PRESETS : SYMPTOM_TYPE_PRESETS_EN;
}

export interface SymptomAttachment {
  path: string;
  url: string;
}

export interface SymptomLog {
  id: string;
  petId: string;
  loggedAt: string;
  symptomType: string;
  severity: SeverityLevel;
  notes: string;
  attachments: SymptomAttachment[];
}

export interface Medication {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  frequency: string;
  isActive: boolean;
}
