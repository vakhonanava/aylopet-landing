import type {
  AppetiteLevel,
  BehaviourSignal,
  CollarConnectionStatus,
  ConsultationStatus,
  DietType,
  DnaSampleStatus,
  GeneticRiskCategory,
  GeneticRiskLevel,
  InsightPriority,
  InsightSource,
  MicrochipRegistryStatus,
  NeuterStatus,
  SafeZoneState,
  Sex,
} from "@/lib/pet-history/types";

/** Tailwind class trio shared by every status pill in the module. */
export interface ToneClasses {
  label: string;
  className: string;
  dotClass: string;
}

export const SEX_LABELS: Record<Sex, string> = {
  male: "მამრი",
  female: "მდედრი",
};

export const NEUTER_LABELS: Record<NeuterStatus, string> = {
  intact: "არაკასტრირებული",
  neutered: "კასტრირებული / სტერილიზებული",
};

export const MICROCHIP_STATUS: Record<MicrochipRegistryStatus, ToneClasses> = {
  registered: {
    label: "რეგისტრირებული",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClass: "bg-emerald-500",
  },
  pending: {
    label: "მუშავდება",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    dotClass: "bg-amber-500",
  },
  not_found: {
    label: "ბაზაში ვერ მოიძებნა",
    className: "border-red-200 bg-red-50 text-red-700",
    dotClass: "bg-red-500",
  },
  unchecked: {
    label: "შეუმოწმებელი",
    className: "border-slate-200 bg-slate-50 text-slate-600",
    dotClass: "bg-slate-400",
  },
};

export const DIET_LABELS: Record<DietType, string> = {
  aylopet_fresh: "Aylopet Fresh Food",
  dry: "მშრალი საკვები",
  wet: "სველი / კონსერვი",
  raw: "ნედლი (BARF)",
  prescription: "სამკურნალო დიეტა",
  mixed: "შერეული",
};

export const APPETITE_LABELS: Record<AppetiteLevel, string> = {
  refused: "უარი თქვა",
  poor: "სუსტი",
  normal: "ნორმალური",
  eager: "მადიანი",
};

export const DNA_STATUS: Record<DnaSampleStatus, ToneClasses> = {
  not_ordered: {
    label: "შეკვეთილი არ არის",
    className: "border-slate-200 bg-slate-50 text-slate-600",
    dotClass: "bg-slate-400",
  },
  kit_sent: {
    label: "ნაკრები გზაშია",
    className: "border-sky-200 bg-sky-50 text-sky-700",
    dotClass: "bg-sky-500",
  },
  sample_received: {
    label: "ნიმუში მიღებულია",
    className: "border-sky-200 bg-sky-50 text-sky-700",
    dotClass: "bg-sky-500",
  },
  sequencing: {
    label: "მიმდინარეობს ანალიზი",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    dotClass: "bg-amber-500",
  },
  complete: {
    label: "დასრულებული",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClass: "bg-emerald-500",
  },
};

export const GENETIC_CATEGORY_LABELS: Record<GeneticRiskCategory, string> = {
  cardiac: "გულ-სისხლძარღვთა",
  ocular: "მხედველობა",
  neurological: "ნევროლოგიური",
  musculoskeletal: "საყრდენ-მამოძრავებელი",
  metabolic: "მეტაბოლური",
  dermatological: "კანი და ბეწვი",
  drug_sensitivity: "წამლისადმი მგრძნობელობა",
};

export const GENETIC_LEVEL: Record<GeneticRiskLevel, ToneClasses> = {
  clear: {
    label: "სუფთა",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClass: "bg-emerald-500",
  },
  carrier: {
    label: "მატარებელი",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    dotClass: "bg-amber-500",
  },
  at_risk: {
    label: "რისკის ქვეშ",
    className: "border-red-200 bg-red-50 text-red-700",
    dotClass: "bg-red-500",
  },
};

export const COLLAR_STATUS: Record<CollarConnectionStatus, ToneClasses> = {
  not_paired: {
    label: "დაუკავშირებელი",
    className: "border-slate-200 bg-slate-50 text-slate-600",
    dotClass: "bg-slate-400",
  },
  online: {
    label: "ონლაინ",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClass: "bg-emerald-500",
  },
  offline: {
    label: "ოფლაინ",
    className: "border-slate-200 bg-slate-100 text-slate-600",
    dotClass: "bg-slate-400",
  },
  charging: {
    label: "იტენება",
    className: "border-sky-200 bg-sky-50 text-sky-700",
    dotClass: "bg-sky-500",
  },
};

export const SAFE_ZONE_STATE: Record<SafeZoneState, ToneClasses> = {
  inside: {
    label: "ზონის შიგნით",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClass: "bg-emerald-500",
  },
  outside: {
    label: "ზონის გარეთ",
    className: "border-red-200 bg-red-50 text-red-700",
    dotClass: "bg-red-500",
  },
  unknown: {
    label: "უცნობი",
    className: "border-slate-200 bg-slate-50 text-slate-600",
    dotClass: "bg-slate-400",
  },
};

export const BEHAVIOUR_LABELS: Record<BehaviourSignal, string> = {
  barking: "ყეფა",
  anxiety: "შფოთვა",
  scratching: "ქავილი / კაწვრა",
  restlessness: "მოუსვენრობა",
};

export const CONSULTATION_STATUS: Record<ConsultationStatus, ToneClasses> = {
  resolved: {
    label: "დახურული",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClass: "bg-emerald-500",
  },
  monitoring: {
    label: "მეთვალყურეობა",
    className: "border-sky-200 bg-sky-50 text-sky-700",
    dotClass: "bg-sky-500",
  },
  escalated: {
    label: "ვეტერინართან გადამისამართებული",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    dotClass: "bg-amber-500",
  },
};

export const INSIGHT_PRIORITY: Record<InsightPriority, ToneClasses> = {
  info: {
    label: "ინფორმაცია",
    className: "border-slate-200 bg-slate-50 text-slate-600",
    dotClass: "bg-slate-400",
  },
  attention: {
    label: "ყურადღება",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    dotClass: "bg-amber-500",
  },
  urgent: {
    label: "გადაუდებელი",
    className: "border-red-200 bg-red-50 text-red-700",
    dotClass: "bg-red-500",
  },
};

export const INSIGHT_SOURCE_LABELS: Record<InsightSource, string> = {
  dna: "დნმ",
  weight: "წონა",
  collar: "საყელო",
  nutrition: "კვება",
  medical: "სამედიცინო",
};

/** Used by modules whose hardware/lab pipeline has not shipped yet. */
export const COMING_SOON: ToneClasses = {
  label: "მალე",
  className: "border-[var(--brand-accent)]/40 bg-[var(--brand-accent)]/10 text-[var(--brand-primary)]",
  dotClass: "bg-[var(--brand-accent)]",
};

/** WSAVA 9-point body condition scale. */
export const BCS_SCALE: { score: number; label: string }[] = [
  { score: 1, label: "ძლიერ გამხდარი" },
  { score: 2, label: "გამხდარი" },
  { score: 3, label: "წონაკლებული" },
  { score: 4, label: "იდეალურთან ახლოს" },
  { score: 5, label: "იდეალური" },
  { score: 6, label: "ოდნავ ჭარბწონიანი" },
  { score: 7, label: "ჭარბწონიანი" },
  { score: 8, label: "სიმსუქნე" },
  { score: 9, label: "მძიმე სიმსუქნე" },
];

export const PRIVACY_NOTICE =
  "თქვენი მონაცემები დაცულია. ანალიზები გამოიყენება ექსკლუზიურად AylopetAI-ის მიერ დაავადებების პრევენციისა და ინდივიდუალური ველნეს გეგმის შესადგენად.";
