import type { Pet } from "@/lib/dashboard";
import {
  emptyPetTelemetry,
  type PetTelemetry,
} from "@/lib/pet-history/types";

/**
 * Read-only feeds for the history dashboard.
 *
 * This module is the single seam where the machine-written data sources plug
 * in — replace the body of `getPetTelemetry` with the real fetches and every
 * consuming section keeps working unchanged.
 *
 * Current state of each feed:
 *
 * - `dna` — the Aylopet DNA lab has not launched. Always null. Owners who
 *   already hold a third-party test enter it themselves; that lives in
 *   `pet.history.dna` (owner-authored), not here.
 * - `collar` — the Smart Collar has not shipped. Always null, so the section
 *   renders its "მალე" state.
 * - `consultations` / `insights` — AylopetAI ships, but has no persisted thread
 *   store yet. Sample threads are returned ONLY for the local demo pet seeded
 *   by `createSeedPet()` (guest mode, id "rex"), never for a real user's pet.
 *
 * Sample data is deliberately never returned for a real pet: fabricated health
 * readings on someone's actual dog would be worse than an empty state.
 */

const DEMO_PET_ID = "rex";

function isoDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function demoAssistantHistory(): Pick<
  PetTelemetry,
  "consultations" | "insights"
> {
  return {
    consultations: [
      {
        id: "c1",
        startedAt: isoDaysAgo(9),
        topic: "კუჭის აშლილობა რაციონის შეცვლის შემდეგ",
        messageCount: 14,
        status: "resolved",
        summary:
          "სიმპტომები დაიწყო ახალ საკვებზე სწრაფი გადასვლის შემდეგ. რეკომენდებული იყო 7-დღიანი თანდათანობითი გადასვლა.",
        recommendations: [
          "ახალი საკვები შეურიე ძველს 7 დღის განმავლობაში.",
          "დაამატე პრობიოტიკი დღეში ერთხელ, 2 კვირა.",
          "თუ 48 საათში არ გაუმჯობესდა, მიმართე ვეტერინარს.",
        ],
      },
      {
        id: "c2",
        startedAt: isoDaysAgo(24),
        topic: "წონის კონტროლი და სახსრების მხარდაჭერა",
        messageCount: 8,
        status: "monitoring",
        summary:
          "მიმდინარე წონისა და აქტივობის გათვალისწინებით შედგა პრევენციული გეგმა.",
        recommendations: [
          "შეინარჩუნე წონა სამიზნე დიაპაზონში.",
          "თავი აარიდე კიბეზე ხშირ ასვლა-ჩამოსვლას ლეკვობისას.",
        ],
      },
    ],
    insights: [
      {
        id: "i1",
        generatedAt: isoDaysAgo(1),
        title: "წონა სამიზნე დიაპაზონს ცდება",
        body: "ბოლო აწონვა სასურველ დიაპაზონზე მაღალია. პორციის მცირე კორექცია და ყოველდღიური აქტივობის მატება საკმარისი უნდა იყოს.",
        priority: "attention",
        sources: ["weight", "nutrition"],
      },
      {
        id: "i2",
        generatedAt: isoDaysAgo(3),
        title: "ვაქცინაციის ვადა უახლოვდება",
        body: "ერთი ვაქცინა ვადაგადაცილებულია და ერთს ვადა თვის განმავლობაში ეწურება. დაგეგმე ვიზიტი ვეტერინართან.",
        priority: "info",
        sources: ["medical"],
      },
    ],
  };
}

export function getPetTelemetry(pet: Pet): PetTelemetry {
  const base = emptyPetTelemetry();

  // DNA lab and Smart Collar have not launched — both stay null for everyone.
  if (pet.id !== DEMO_PET_ID) return base;

  return { ...base, ...demoAssistantHistory() };
}
