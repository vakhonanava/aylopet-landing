import type { SupabaseClient } from "@supabase/supabase-js";
import {
  emptyPetHistory,
  type PetHistory,
} from "@/lib/pet-history/types";

/**
 * The owner-authored history rides in a single `pets.history` JSONB column
 * rather than a dozen scalar columns and a weight-log table. The shape is
 * semi-structured, read whole, and written whole by one screen, so a document
 * fits it better than a relational spread. Revisit if weight logs ever need
 * cross-pet aggregate queries.
 */
export async function savePetHistoryInSupabase(
  supabase: SupabaseClient,
  userId: string,
  petId: string,
  history: PetHistory,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("pets")
    .update({ history, updated_at: new Date().toISOString() })
    .eq("id", petId)
    .eq("owner_id", userId);

  return { error: error?.message ?? null };
}

/**
 * Normalises whatever is in the JSONB column into a complete `PetHistory`.
 * Rows written before migration 008 return null, and a partially written blob
 * shouldn't crash the dashboard, so every field falls back to its empty value.
 */
export function parsePetHistory(raw: unknown): PetHistory {
  const base = emptyPetHistory();
  if (!raw || typeof raw !== "object") return base;

  const value = raw as Partial<PetHistory>;
  return {
    reproductive: value.reproductive ?? base.reproductive,
    microchip: value.microchip ?? base.microchip,
    weightLogs: Array.isArray(value.weightLogs) ? value.weightLogs : [],
    weightTarget: value.weightTarget ?? base.weightTarget,
    labMetrics: Array.isArray(value.labMetrics) ? value.labMetrics : [],
    hydrationLogs: Array.isArray(value.hydrationLogs) ? value.hydrationLogs : [],
    supplements: Array.isArray(value.supplements) ? value.supplements : [],
    foodLogs: Array.isArray(value.foodLogs) ? value.foodLogs : [],
    moodLogs: Array.isArray(value.moodLogs) ? value.moodLogs : [],
    diet: value.diet ?? base.diet,
    vet: value.vet ?? base.vet,
    caretaker: value.caretaker ?? base.caretaker,
    dna: value.dna ?? base.dna,
  };
}
