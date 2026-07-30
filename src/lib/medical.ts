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
  "აპეტიტის დაკარგვა",
] as const;

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
