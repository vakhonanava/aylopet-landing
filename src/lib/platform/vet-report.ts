import type { SupabaseClient } from "@supabase/supabase-js";
import type { CareType } from "@/lib/dashboard";
import type { MedicalRecord, Medication, SeverityLevel, SymptomLog } from "@/lib/medical";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { parsePetHistory } from "@/lib/platform/history-persistence";
import { PET_MEDICAL_DOCS_BUCKET } from "@/lib/platform/types";

export interface VetReportPet {
  id: string;
  name: string;
  breed: string;
  weightKg: number;
  gender: string | null;
  isNeutered: boolean;
  birthDate: string | null;
  bcsScore: number | null;
  microchipId: string | null;
  avatarUrl: string | null;
}

export interface VetReportOwner {
  fullName: string;
  email: string;
  phone: string | null;
}

export interface PreventativeCareEntry {
  title: string;
  administered: string;
  nextDue: string | null;
}

export interface VetReportData {
  pet: VetReportPet;
  owner: VetReportOwner;
  medicalRecord: MedicalRecord | null;
  activeMedications: Medication[];
  recentSymptomLogs: SymptomLog[];
  preventativeCare: Record<CareType, PreventativeCareEntry | null>;
  symptomWindowDays: number;
  generatedAt: string;
}

export type VetReportShareFailureReason = "not_found" | "expired" | "revoked";

function latestByCareType(
  rows: { name: string; care_type: string; administered: string; next_due: string | null }[],
): Record<CareType, PreventativeCareEntry | null> {
  const result: Record<CareType, PreventativeCareEntry | null> = {
    vaccine: null,
    deworming: null,
    flea_tick: null,
  };
  for (const row of rows) {
    const type = row.care_type as CareType;
    if (!(type in result) || result[type]) continue;
    result[type] = {
      title: row.name,
      administered: row.administered,
      nextDue: row.next_due,
    };
  }
  return result;
}

export async function buildVetReportData(
  supabase: SupabaseClient,
  petId: string,
  options?: { symptomWindowDays?: number },
): Promise<VetReportData | null> {
  const symptomWindowDays = options?.symptomWindowDays ?? 45;

  const { data: petRow, error: petError } = await supabase
    .from("pets")
    .select("*")
    .eq("id", petId)
    .maybeSingle();

  if (petError || !petRow) return null;

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("full_name, email, phone")
    .eq("id", petRow.owner_id)
    .maybeSingle();

  const windowStart = new Date(
    Date.now() - symptomWindowDays * 86_400_000,
  ).toISOString();

  const [
    { data: medicalRecordRow },
    { data: medicationsData },
    { data: symptomLogsData },
    { data: vaccinesData },
  ] = await Promise.all([
    supabase.from("medical_records").select("*").eq("pet_id", petId).maybeSingle(),
    supabase
      .from("medications")
      .select("*")
      .eq("pet_id", petId)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("symptom_logs")
      .select("*")
      .eq("pet_id", petId)
      .gte("logged_at", windowStart)
      .order("logged_at", { ascending: false }),
    supabase
      .from("pet_vaccines")
      .select("name, care_type, administered, next_due")
      .eq("pet_id", petId)
      .order("administered", { ascending: false }),
  ]);

  const medicalRecord: MedicalRecord | null = medicalRecordRow
    ? {
        chronicConditions: (medicalRecordRow.chronic_conditions as string[] | null) ?? [],
        surgeriesAndTraumas: (medicalRecordRow.surgeries_and_traumas as string | null) ?? "",
        allergies: (medicalRecordRow.allergies as string[] | null) ?? [],
        geneticRisks: (medicalRecordRow.genetic_risks as string[] | null) ?? [],
        updatedAt: (medicalRecordRow.updated_at as string | null) ?? null,
      }
    : null;

  const activeMedications: Medication[] = (medicationsData ?? []).map((m) => ({
    id: m.id as string,
    petId,
    name: m.name as string,
    dosage: (m.dosage as string | null) ?? "",
    frequency: (m.frequency as string | null) ?? "",
    isActive: Boolean(m.is_active),
  }));

  const recentSymptomLogs: SymptomLog[] = [];
  for (const log of symptomLogsData ?? []) {
    const paths = (log.attachments as string[] | null) ?? [];
    const attachments = [];
    for (const path of paths) {
      const { data: signed } = await supabase.storage
        .from(PET_MEDICAL_DOCS_BUCKET)
        .createSignedUrl(path, 3600);
      if (!signed?.signedUrl) continue;
      attachments.push({ path, url: signed.signedUrl });
    }
    recentSymptomLogs.push({
      id: log.id as string,
      petId,
      loggedAt: log.logged_at as string,
      symptomType: log.symptom_type as string,
      severity: (log.severity as SeverityLevel) ?? "low",
      notes: (log.notes as string | null) ?? "",
      attachments,
    });
  }

  const preventativeCare = latestByCareType(vaccinesData ?? []);

  // Sex/neuter status is only ever set at onboarding on the flat columns; any
  // later edit goes through `history.reproductive` instead, so that's the
  // source of truth whenever it's present.
  const reproductive = parsePetHistory(petRow.history).reproductive;

  return {
    pet: {
      id: petId,
      name: petRow.pet_name as string,
      breed: petRow.breed as string,
      weightKg: Number(petRow.weight ?? 0),
      gender: reproductive?.sex ?? (petRow.gender as string | null) ?? null,
      isNeutered: reproductive
        ? reproductive.status === "neutered"
        : Boolean(petRow.is_neutered),
      birthDate: (petRow.birth_date as string | null) ?? null,
      bcsScore: (petRow.bcs_score as number | null) ?? null,
      microchipId: (petRow.microchip_id as string | null) ?? null,
      avatarUrl: (petRow.avatar_url as string | null) ?? null,
    },
    owner: {
      fullName: (profileRow?.full_name as string | undefined) ?? "",
      email: (profileRow?.email as string | undefined) ?? "",
      phone: (profileRow?.phone as string | null | undefined) ?? null,
    },
    medicalRecord,
    activeMedications,
    recentSymptomLogs,
    preventativeCare,
    symptomWindowDays,
    generatedAt: new Date().toISOString(),
  };
}

export async function getVetReportByToken(
  token: string,
): Promise<
  | { ok: true; data: VetReportData }
  | { ok: false; reason: VetReportShareFailureReason }
> {
  const admin = createSupabaseAdmin();

  const { data: share } = await admin
    .from("vet_report_shares")
    .select("pet_id, revoked, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (!share) return { ok: false, reason: "not_found" };
  if (share.revoked) return { ok: false, reason: "revoked" };
  if (share.expires_at && new Date(share.expires_at as string) < new Date()) {
    return { ok: false, reason: "expired" };
  }

  const data = await buildVetReportData(admin, share.pet_id as string);
  if (!data) return { ok: false, reason: "not_found" };

  return { ok: true, data };
}
