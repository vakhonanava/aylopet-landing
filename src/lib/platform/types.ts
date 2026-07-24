export const WAITLIST_EXPECTATIONS = [
  "ai_nutrition_plan",
  "genetic_health_screening",
  "smart_collar_sync",
  "vet_ai_assistant",
] as const;

export type WaitlistExpectation = (typeof WAITLIST_EXPECTATIONS)[number];

export const WAITLIST_EXPECTATION_LABELS: Record<WaitlistExpectation, string> = {
  ai_nutrition_plan: "AI ნუტრიციის გეგმა",
  genetic_health_screening: "გენეტიკური სკრინინგი",
  smart_collar_sync: "Smart Collar სინქრონიზაცია",
  vet_ai_assistant: "Vet AI ასისტენტი",
};

export const PET_FILE_CATEGORIES = [
  "vet_medical",
  "dna_genetic",
  "allergy_bloodwork",
  "general",
] as const;

export type PetFileCategory = (typeof PET_FILE_CATEGORIES)[number];

export const PET_FILE_CATEGORY_LABELS: Record<PetFileCategory, string> = {
  vet_medical: "სამედიცინო ისტორია / ანალიზები",
  dna_genetic: "DNA ტესტის პასუხები",
  allergy_bloodwork: "ალერგია / სისხლის ტესტი",
  general: "სხვა დოკუმენტები",
};

export const PET_PRIMARY_GOALS = [
  "weight_management",
  "allergy_prevention",
  "longevity_dna",
  "performance",
] as const;

export type PetPrimaryGoal = (typeof PET_PRIMARY_GOALS)[number];

export const PET_PRIMARY_GOAL_LABELS: Record<PetPrimaryGoal, string> = {
  weight_management: "წონის მართვა",
  allergy_prevention: "ალერგიის პრევენცია",
  longevity_dna: "გრძელვადიანი ჯანმრთელობა & DNA",
  performance: "აქტიურობა & ფორმა",
};

export interface WaitlistEntry {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  expectations: WaitlistExpectation[];
}

export interface OwnerProfile {
  fullName: string;
  email: string;
  phone: string;
}

export interface PetProfile {
  petName: string;
  breed: string;
  ageDob: string;
  gender: "male" | "female";
  isNeutered: boolean;
  weight: number | null;
  weightUnit: "kg" | "lbs";
  healthHistory: string[];
  medicalNotes: string;
  primaryGoal: PetPrimaryGoal | "";
}

export interface UploadedFileMetadata {
  id: string;
  petId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  category: PetFileCategory;
  status: string;
  createdAt: string;
}

export const PET_DOCUMENTS_BUCKET = "pet-documents";

export const ACCEPTED_PET_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

export const MAX_PET_FILE_BYTES = 10 * 1024 * 1024;
