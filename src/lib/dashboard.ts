export type ActivityLevel = "low" | "moderate" | "high";

export interface ActivityOption {
  value: ActivityLevel;
  label: string;
  description: string;
}

export const ACTIVITY_OPTIONS: ActivityOption[] = [
  {
    value: "low",
    label: "დაბალი",
    description: "ძირითადად სახლში, მცირე მოძრაობა",
  },
  {
    value: "moderate",
    label: "ზომიერი",
    description: "ყოველდღიური სეირნობა",
  },
  {
    value: "high",
    label: "მაღალი / ათლეტი",
    description: "ინტენსიური ყოველდღიური ვარჯიში",
  },
];

export const TEMPERAMENT_OPTIONS = [
  "ენერგიული",
  "მორცხვი",
  "აგრესიული კვებისას",
  "მშვიდი",
  "სოციალური",
  "ჯიუტი",
  "მგრძნობიარე",
  "მოთამაშე",
] as const;

export type Temperament = (typeof TEMPERAMENT_OPTIONS)[number];

export {
  BREED_LABELS as BREEDS,
  DOG_BREEDS,
  MIXED_BREED_KA,
  searchDogBreeds,
  type DogBreed,
} from "@/lib/content/dog-breeds";

export interface VaccineEntry {
  id: string;
  name: string;
  administered: string; // ISO date
  nextDue: string; // ISO date
}

export interface SupplementEntry {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  givenToday: boolean;
}

export type MealType = "morning" | "evening";

export interface FoodEntry {
  id: string;
  date: string;
  mealType: MealType;
  brand: string;
  isAylopet: boolean;
  portionGrams: number;
  digestiveResponse?: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1..5
  energy: number; // 0..100
  notes?: string;
}

export type LabReportStatus = "uploaded";

export interface LabReportEntry {
  id: string;
  name: string;
  size: number;
  mimeType: "application/pdf" | "image/jpeg" | "image/png";
  pathname: string;
  url: string;
  uploadedAt: string;
  status: LabReportStatus;
}

/** Saved profile state archived on each explicit save. */
export interface PetProfileSnapshot {
  id: string;
  savedAt: string;
  name: string;
  breed: string;
  weightKg: number;
  activity: ActivityLevel;
  temperament: Temperament[];
  avatarUrl?: string;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  weightKg: number;
  activity: ActivityLevel;
  temperament: Temperament[];
  avatarUrl?: string;
  vaccines: VaccineEntry[];
  supplements: SupplementEntry[];
  food: FoodEntry[];
  moods: MoodEntry[];
  labReports: LabReportEntry[];
  profileHistory: PetProfileSnapshot[];
}

export interface Account {
  name: string;
  email: string;
}

export const MOOD_SCALE = [
  { value: 1, label: "ცუდად", emoji: "😣" },
  { value: 2, label: "დაბალი", emoji: "🙁" },
  { value: 3, label: "ნორმალური", emoji: "😐" },
  { value: 4, label: "კარგად", emoji: "🙂" },
  { value: 5, label: "შესანიშნავად", emoji: "😄" },
] as const;

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function createSeedPet(): Pet {
  return {
    id: "rex",
    name: "რექსი",
    breed: "ვაიმარანერი",
    weightKg: 28,
    activity: "high",
    temperament: ["ენერგიული", "სოციალური", "მოთამაშე"],
    vaccines: [
      {
        id: "v1",
        name: "ცოფის ვაქცინა",
        administered: daysFromNow(-340),
        nextDue: daysFromNow(20), // due soon → amber
      },
      {
        id: "v2",
        name: "კომბინირებული (DHPP)",
        administered: daysFromNow(-400),
        nextDue: daysFromNow(-15), // overdue → red
      },
      {
        id: "v3",
        name: "ლეპტოსპიროზი",
        administered: daysFromNow(-120),
        nextDue: daysFromNow(245),
      },
    ],
    supplements: [
      {
        id: "s1",
        name: "ომეგა-3 ზეთი",
        dosage: "5ml",
        frequency: "დღეში 1-ჯერ",
        givenToday: true,
      },
      {
        id: "s2",
        name: "სახსრების დანამატი",
        dosage: "1 აბი",
        frequency: "დღეში 2-ჯერ",
        givenToday: false,
      },
      {
        id: "s3",
        name: "პრობიოტიკი",
        dosage: "1 აბი",
        frequency: "დღეში 1-ჯერ",
        givenToday: false,
      },
    ],
    food: [
      {
        id: "f1",
        date: daysFromNow(0),
        mealType: "morning",
        brand: "Aylopet",
        isAylopet: true,
        portionGrams: 220,
        digestiveResponse: "ნორმალური",
      },
      {
        id: "f2",
        date: daysFromNow(-1),
        mealType: "evening",
        brand: "Aylopet",
        isAylopet: true,
        portionGrams: 240,
        digestiveResponse: "ნორმალური",
      },
    ],
    moods: [
      {
        id: "m1",
        date: daysFromNow(0),
        mood: 4,
        energy: 75,
        notes: "აქტიური და ხალისიანი დღე.",
      },
      {
        id: "m2",
        date: daysFromNow(-1),
        mood: 2,
        energy: 30,
        notes: "დღეს უჩვეულოდ ლეთარგიული იყო.",
      },
    ],
    labReports: [],
    profileHistory: [],
  };
}

/** Days until a date; negative if past. */
export function daysUntil(iso: string): number {
  const target = new Date(iso);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86_400_000);
}

export function formatDate(iso: string): string {
  if (!iso) return "·";
  return new Date(iso).toLocaleDateString("ka-GE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
