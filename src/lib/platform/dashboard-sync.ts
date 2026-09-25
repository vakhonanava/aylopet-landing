import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Account,
  ActivityLevel,
  CareType,
  LabReportEntry,
  Pet,
  PetProfileSnapshot,
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
import { parsePetHistory } from "@/lib/platform/history-persistence";
import { createSignedUrlMap } from "@/lib/platform/signed-urls";

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
    avatarUrl: typeof snap.avatarUrl === "string" ? snap.avatarUrl : undefined,
  };
}

/** Rows of one owner-wide query, bucketed by pet with the query order kept. */
function groupByPet<T extends { pet_id: unknown }>(rows: T[] | null): Map<string, T[]> {
  const byPet = new Map<string, T[]>();
  for (const row of rows ?? []) {
    const petId = row.pet_id as string;
    const list = byPet.get(petId);
    if (list) list.push(row);
    else byPet.set(petId, [row]);
  }
  return byPet;
}

const SYMPTOM_LOGS_PER_PET = 60;
/** The symptom query spans the whole account, so its cap is only a backstop. */
const SYMPTOM_LOGS_QUERY_CAP = 500;

export async function fetchUserDashboardFromSupabase(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ account: Account; pets: Pet[] } | null> {
  // Every child table carries owner_id (and RLS only returns the caller's
  // rows), so the whole account loads in one parallel round. Going pet by pet
  // and file by file chained 5+ round trips to a database ~0.3–1s away.
  const [
    { data: profile, error: profileError },
    { data: petsData, error: petsError },
    { data: files },
    { data: vaccinesData },
    { data: snapshotsData },
    { data: medicalRecordsData },
    { data: symptomLogsData },
    { data: medicationsData },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, email, phone")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("pets")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: true }),
    supabase
      .from("pet_files")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("pet_vaccines")
      .select("*")
      .eq("owner_id", userId)
      .order("administered", { ascending: false }),
    supabase
      .from("pet_profile_snapshots")
      .select("id, pet_id, created_at, snapshot")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false }),
    supabase.from("medical_records").select("*").eq("owner_id", userId),
    supabase
      .from("symptom_logs")
      .select("*")
      .eq("owner_id", userId)
      .order("logged_at", { ascending: false })
      .limit(SYMPTOM_LOGS_QUERY_CAP),
    supabase
      .from("medications")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  if (profileError || petsError) return null;

  const filesByPet = groupByPet(files);
  const vaccinesByPet = groupByPet(vaccinesData);
  const snapshotsByPet = groupByPet(snapshotsData);
  const medicalRecordsByPet = groupByPet(medicalRecordsData);
  const medicationsByPet = groupByPet(medicationsData);
  const symptomLogsByPet = new Map(
    [...groupByPet(symptomLogsData)].map(([petId, logs]) => [
      petId,
      logs.slice(0, SYMPTOM_LOGS_PER_PET),
    ]),
  );

  const labFiles = (files ?? []).filter((file) =>
    LAB_MIME_TYPES.has(file.file_type as LabReportEntry["mimeType"]),
  );
  const [labUrls, attachmentUrls] = await Promise.all([
    createSignedUrlMap(
      supabase,
      PET_DOCUMENTS_BUCKET,
      labFiles.map((file) => file.file_path as string),
    ),
    createSignedUrlMap(
      supabase,
      PET_MEDICAL_DOCS_BUCKET,
      [...symptomLogsByPet.values()]
        .flat()
        .flatMap((log) => (log.attachments as string[] | null) ?? []),
    ),
  ]);

  const pets: Pet[] = [];

  for (const row of petsData ?? []) {
    const petId = row.id as string;

    const labReports: LabReportEntry[] = [];

    for (const file of filesByPet.get(petId) ?? []) {
      const mimeType = file.file_type as LabReportEntry["mimeType"];
      if (!LAB_MIME_TYPES.has(mimeType)) continue;

      const url = labUrls.get(file.file_path as string);
      if (!url) continue;

      labReports.push({
        id: file.id as string,
        name: file.file_name as string,
        size: file.file_size as number,
        mimeType,
        pathname: file.file_path as string,
        url,
        uploadedAt: file.created_at as string,
        status: "uploaded",
      });
    }

    const vaccines: VaccineEntry[] = (vaccinesByPet.get(petId) ?? []).map((v) => ({
      id: v.id as string,
      name: v.name as string,
      careType: parseCareType(v.care_type),
      administered: v.administered as string,
      nextDue: (v.next_due as string | null) ?? "",
    }));

    const profileHistory: PetProfileSnapshot[] = (snapshotsByPet.get(petId) ?? [])
      .map(parseSnapshot)
      .filter((item): item is PetProfileSnapshot => item !== null);

    const medicalRecordData = medicalRecordsByPet.get(petId)?.[0];
    const medicalRecord: MedicalRecord | null = medicalRecordData
      ? {
          chronicConditions: (medicalRecordData.chronic_conditions as string[] | null) ?? [],
          surgeriesAndTraumas: (medicalRecordData.surgeries_and_traumas as string | null) ?? "",
          allergies: (medicalRecordData.allergies as string[] | null) ?? [],
          geneticRisks: (medicalRecordData.genetic_risks as string[] | null) ?? [],
          updatedAt: (medicalRecordData.updated_at as string | null) ?? null,
        }
      : null;

    const medications: Medication[] = (medicationsByPet.get(petId) ?? []).map((m) => ({
      id: m.id as string,
      petId,
      name: m.name as string,
      dosage: (m.dosage as string | null) ?? "",
      frequency: (m.frequency as string | null) ?? "",
      isActive: Boolean(m.is_active),
    }));

    const symptomLogs: SymptomLog[] = [];
    for (const log of symptomLogsByPet.get(petId) ?? []) {
      const paths = (log.attachments as string[] | null) ?? [];
      const attachments: SymptomAttachment[] = [];
      for (const path of paths) {
        const url = attachmentUrls.get(path);
        if (!url) continue;
        attachments.push({ path, url });
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

    const history = parsePetHistory(row.history);

    pets.push({
      id: petId,
      name: row.pet_name as string,
      breed: row.breed as string,
      weightKg,
      activity: parseActivity(row.activity),
      avatarUrl: (row.avatar_url as string | null) ?? undefined,
      birthDate: (row.birth_date as string | null) ?? undefined,
      bcsScore: (row.bcs_score as number | null) ?? undefined,
      microchipId: (row.microchip_id as string | null) ?? undefined,
      vaccines,
      // Logbook tabs — real source of truth is `history`, mirrored onto the
      // flat fields so existing reads (LogbookTabs, NutritionPanel) don't change.
      supplements: history.supplements,
      food: history.foodLogs,
      moods: history.moodLogs,
      labReports,
      profileHistory,
      medicalRecord,
      medications,
      symptomLogs,
      history,
    });
  }

  return {
    account: {
      name: (profile?.full_name as string | undefined) ?? "",
      email: (profile?.email as string | undefined) ?? "",
      phone: (profile?.phone as string | null | undefined) ?? undefined,
    },
    pets,
  };
}
