import type { SupabaseClient } from "@supabase/supabase-js";
import type { Medication, MedicalRecord, SymptomLog } from "@/lib/medical";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface PetIdentityPayload {
  birthDate: string | null;
  bcsScore: number | null;
  microchipId: string | null;
}

export async function updatePetIdentityInSupabase(
  supabase: SupabaseClient,
  userId: string,
  petId: string,
  payload: PetIdentityPayload,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("pets")
    .update({
      birth_date: payload.birthDate,
      bcs_score: payload.bcsScore,
      microchip_id: payload.microchipId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", petId)
    .eq("owner_id", userId);

  return { error: error?.message ?? null };
}

export type MedicalRecordPayload = Omit<MedicalRecord, "updatedAt">;

export async function upsertMedicalRecordInSupabase(
  supabase: SupabaseClient,
  userId: string,
  petId: string,
  payload: MedicalRecordPayload,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("medical_records").upsert(
    {
      pet_id: petId,
      owner_id: userId,
      chronic_conditions: payload.chronicConditions,
      surgeries_and_traumas: payload.surgeriesAndTraumas || null,
      allergies: payload.allergies,
      genetic_risks: payload.geneticRisks,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "pet_id" },
  );

  return { error: error?.message ?? null };
}

export async function createSymptomLogInSupabase(
  supabase: SupabaseClient,
  userId: string,
  petId: string,
  entry: Omit<SymptomLog, "id" | "petId">,
): Promise<{ id: string | null; error: string | null }> {
  const { data, error } = await supabase
    .from("symptom_logs")
    .insert({
      pet_id: petId,
      owner_id: userId,
      logged_at: entry.loggedAt,
      symptom_type: entry.symptomType.trim(),
      severity: entry.severity,
      notes: entry.notes || null,
      attachments: entry.attachments.map((a) => a.path),
    })
    .select("id")
    .single();

  if (error) return { id: null, error: error.message };
  return { id: data.id as string, error: null };
}

export async function deleteSymptomLogInSupabase(
  supabase: SupabaseClient,
  userId: string,
  logId: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("symptom_logs")
    .delete()
    .eq("id", logId)
    .eq("owner_id", userId);

  return { error: error?.message ?? null };
}

export async function upsertMedicationInSupabase(
  supabase: SupabaseClient,
  userId: string,
  petId: string,
  entry: Medication,
): Promise<{ id: string | null; error: string | null }> {
  const isUuid = UUID_RE.test(entry.id);
  const row = {
    pet_id: petId,
    owner_id: userId,
    name: entry.name.trim(),
    dosage: entry.dosage || null,
    frequency: entry.frequency || null,
    is_active: entry.isActive,
    updated_at: new Date().toISOString(),
  };

  if (isUuid) {
    const { error } = await supabase
      .from("medications")
      .update(row)
      .eq("id", entry.id)
      .eq("owner_id", userId);
    return { id: entry.id, error: error?.message ?? null };
  }

  const { data, error } = await supabase
    .from("medications")
    .insert(row)
    .select("id")
    .single();

  if (error) return { id: null, error: error.message };
  return { id: data.id as string, error: null };
}

export async function deleteMedicationInSupabase(
  supabase: SupabaseClient,
  userId: string,
  medicationId: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("medications")
    .delete()
    .eq("id", medicationId)
    .eq("owner_id", userId);

  return { error: error?.message ?? null };
}

export async function createVetReportShareInSupabase(
  supabase: SupabaseClient,
  userId: string,
  petId: string,
  options?: { expiresInDays?: number },
): Promise<{ token: string | null; error: string | null }> {
  const expiresInDays = options?.expiresInDays ?? 14;
  const expiresAt = new Date(Date.now() + expiresInDays * 86_400_000).toISOString();

  const { data, error } = await supabase
    .from("vet_report_shares")
    .insert({ pet_id: petId, owner_id: userId, expires_at: expiresAt })
    .select("token")
    .single();

  if (error) return { token: null, error: error.message };
  return { token: data.token as string, error: null };
}
