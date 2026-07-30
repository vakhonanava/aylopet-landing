import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Account,
  ActivityLevel,
  CareType,
  LabReportEntry,
  Pet,
  PetProfileSnapshot,
  Temperament,
  VaccineEntry,
} from "@/lib/dashboard";
import type {
  MedicalRecord,
  Medication,
  SeverityLevel,
  SymptomAttachment,
  SymptomLog,
} from "@/lib/medical";
import { PET_DOCUMENTS_BUCKET, PET_MEDICAL_DOCS_BUCKET } from "@/lib/platform/types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LAB_MIME_TYPES = new Set<LabReportEntry["mimeType"]>([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

const ACTIVITY_LEVELS = new Set<ActivityLevel>(["low", "moderate", "high"]);
const CARE_TYPES = new Set<CareType>(["vaccine", "deworming", "flea_tick"]);
const SEVERITY_LEVELS = new Set<SeverityLevel>(["low", "medium", "high", "critical"]);

export function isPlatformPetId(id: string): boolean {
  return UUID_RE.test(id);
}

function parseActivity(value: unknown): ActivityLevel {
  if (typeof value === "string" && ACTIVITY_LEVELS.has(value as ActivityLevel)) {
    return value as ActivityLevel;
  }
  return "moderate";
}

function parseCareType(value: unknown): CareType {
  if (typeof value === "string" && CARE_TYPES.has(value as CareType)) {
    return value as CareType;
  }
  return "vaccine";
}

function parseSeverity(value: unknown): SeverityLevel {
  if (typeof value === "string" && SEVERITY_LEVELS.has(value as SeverityLevel)) {
    return value as SeverityLevel;
  }
  return "low";
}

function parseTemperament(value: unknown): Temperament[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Temperament => typeof item === "string");
}

function parseSnapshot(row: {
  id: string;
  created_at: string;
  snapshot: unknown;
}): PetProfileSnapshot | null {
  if (!row.snapshot || typeof row.snapshot !== "object") return null;
  const snap = row.snapshot as Record<string, unknown>;
  return {
    id: row.id,
    savedAt: (snap.savedAt as string | undefined) ?? row.created_at,
    name: String(snap.name ?? ""),
    breed: String(snap.breed ?? ""),
    weightKg: Number(snap.weightKg ?? 0),
    activity: parseActivity(snap.activity),
    temperament: parseTemperament(snap.temperament),
    avatarUrl: typeof snap.avatarUrl === "string" ? snap.avatarUrl : undefined,
  };
}

export async function fetchUserDashboardFromSupabase(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ account: Account; pets: Pet[] } | null> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) return null;

  const { data: petsData, error: petsError } = await supabase
    .from("pets")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: true });

  if (petsError) return null;

  const pets: Pet[] = [];

  for (const row of petsData ?? []) {
    const petId = row.id as string;

    const [
      { data: files },
      { data: vaccinesData },
      { data: snapshotsData },
      { data: medicalRecordData },
      { data: symptomLogsData },
      { data: medicationsData },
    ] = await Promise.all([
      supabase
        .from("pet_files")
        .select("*")
        .eq("pet_id", petId)
        .order("created_at", { ascending: false }),
      supabase
        .from("pet_vaccines")
        .select("*")
        .eq("pet_id", petId)
        .order("administered", { ascending: false }),
      supabase
        .from("pet_profile_snapshots")
        .select("id, created_at, snapshot")
        .eq("pet_id", petId)
        .order("created_at", { ascending: false }),
      supabase.from("medical_records").select("*").eq("pet_id", petId).maybeSingle(),
      supabase
        .from("symptom_logs")
        .select("*")
        .eq("pet_id", petId)
        .order("logged_at", { ascending: false })
        .limit(60),
      supabase
        .from("medications")
        .select("*")
        .eq("pet_id", petId)
        .order("created_at", { ascending: false }),
    ]);

    const labReports: LabReportEntry[] = [];

    for (const file of files ?? []) {
      const mimeType = file.file_type as LabReportEntry["mimeType"];
      if (!LAB_MIME_TYPES.has(mimeType)) continue;

      const { data: signed } = await supabase.storage
        .from(PET_DOCUMENTS_BUCKET)
        .createSignedUrl(file.file_path, 3600);

      if (!signed?.signedUrl) continue;

      labReports.push({
        id: file.id as string,
        name: file.file_name as string,
        size: file.file_size as number,
        mimeType,
        pathname: file.file_path as string,
        url: signed.signedUrl,
        uploadedAt: file.created_at as string,
        status: "uploaded",
      });
    }

    const vaccines: VaccineEntry[] = (vaccinesData ?? []).map((v) => ({
      id: v.id as string,
      name: v.name as string,
      careType: parseCareType(v.care_type),
      administered: v.administered as string,
      nextDue: (v.next_due as string | null) ?? "",
    }));

    const profileHistory: PetProfileSnapshot[] = (snapshotsData ?? [])
      .map(parseSnapshot)
      .filter((item): item is PetProfileSnapshot => item !== null);

    const medicalRecord: MedicalRecord | null = medicalRecordData
      ? {
          chronicConditions: (medicalRecordData.chronic_conditions as string[] | null) ?? [],
          surgeriesAndTraumas: (medicalRecordData.surgeries_and_traumas as string | null) ?? "",
          allergies: (medicalRecordData.allergies as string[] | null) ?? [],
          geneticRisks: (medicalRecordData.genetic_risks as string[] | null) ?? [],
          updatedAt: (medicalRecordData.updated_at as string | null) ?? null,
        }
      : null;

    const medications: Medication[] = (medicationsData ?? []).map((m) => ({
      id: m.id as string,
      petId,
      name: m.name as string,
      dosage: (m.dosage as string | null) ?? "",
      frequency: (m.frequency as string | null) ?? "",
      isActive: Boolean(m.is_active),
    }));

    const symptomLogs: SymptomLog[] = [];
    for (const log of symptomLogsData ?? []) {
      const paths = (log.attachments as string[] | null) ?? [];
      const attachments: SymptomAttachment[] = [];
      for (const path of paths) {
        const { data: signed } = await supabase.storage
          .from(PET_MEDICAL_DOCS_BUCKET)
          .createSignedUrl(path, 3600);
        if (!signed?.signedUrl) continue;
        attachments.push({ path, url: signed.signedUrl });
      }
      symptomLogs.push({
        id: log.id as string,
        petId,
        loggedAt: log.logged_at as string,
        symptomType: log.symptom_type as string,
        severity: parseSeverity(log.severity),
        notes: (log.notes as string | null) ?? "",
        attachments,
      });
    }

    const rawWeight = Number(row.weight ?? 0);
    const weightKg =
      row.weight_unit === "lbs"
        ? Math.round(rawWeight * 0.453592 * 10) / 10
        : rawWeight;

    pets.push({
      id: petId,
      name: row.pet_name as string,
      breed: row.breed as string,
      weightKg,
      activity: parseActivity(row.activity),
      temperament: parseTemperament(row.temperament),
      avatarUrl: (row.avatar_url as string | null) ?? undefined,
      birthDate: (row.birth_date as string | null) ?? undefined,
      bcsScore: (row.bcs_score as number | null) ?? undefined,
      microchipId: (row.microchip_id as string | null) ?? undefined,
      vaccines,
      supplements: [],
      food: [],
      moods: [],
      labReports,
      profileHistory,
      medicalRecord,
      medications,
      symptomLogs,
    });
  }

  return {
    account: {
      name: (profile?.full_name as string | undefined) ?? "",
      email: (profile?.email as string | undefined) ?? "",
    },
    pets,
  };
}
