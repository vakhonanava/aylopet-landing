export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  interactive?: ChatInteractivePanel;
}

export interface ChatInteractivePanel {
  type: "feeding_schedule";
  morningPercent: number;
  eveningPercent: number;
  dailyKcal: number;
}

export interface QuickAction {
  id: string;
  label: string;
  prompt: string;
}

export const QUICK_ACTIONS: readonly QuickAction[] = [
  {
    id: "digestion",
    label: "Assess Koko's digestion",
    prompt: "How is Koko's digestion on her current turkey formula?",
  },
  {
    id: "recipe",
    label: "Update Dante's active recipe",
    prompt: "I'd like to update Dante's active recipe based on his weight.",
  },
  {
    id: "allergies",
    label: "Review allergy filters",
    prompt: "Can you review Koko's allergy filters and protein sources?",
  },
] as const;

export interface ActiveDogProfile {
  name: string;
  ageYears: number;
  breed: string;
  healthNotes: string;
  activeFormula: string;
  dailyKcal: number;
}

export const ACTIVE_DOG_PROFILE: ActiveDogProfile = {
  name: "Koko",
  ageYears: 13,
  breed: "French Bulldog",
  healthNotes: "active health notes of cancer and a sensitive stomach",
  activeFormula: "active fresh-food turkey formula",
  dailyKcal: 1840,
};

export function buildGreeting(profile: ActiveDogProfile): string {
  return `Hi! I see ${profile.name} is a ${profile.ageYears}-year-old ${profile.breed} with ${profile.healthNotes}. Let's adapt her ${profile.activeFormula} · I've prepared a gentle split below. Slide to rebalance morning and evening portions and I'll recalculate grams instantly.`;
}

export const INITIAL_ASSISTANT_STREAM = buildGreeting(ACTIVE_DOG_PROFILE);

export const MOCK_RESPONSES: Record<string, string> = {
  digestion:
    "Koko's recent logbook shows softer stools after beef-based treats. I recommend staying on turkey & venison, avoiding wheat, and keeping portions at 52% morning / 48% evening for steadier digestion.",
  recipe:
    "Dante's Cane Corso metabolism benefits from structured transitions. At 42 kg and working activity, his MER is ~2,840 kcal/day. Use the sliders below to fine-tune meal timing before we lock the recipe.",
  allergies:
    "Koko's profile flags chicken and wheat sensitivities. MDR1 carrier status means we exclude chemical preservatives. Current safe proteins: turkey, venison, and novel duck.",
};
