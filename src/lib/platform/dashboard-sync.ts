import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Account,
  ActivityLevel,
  LabReportEntry,
  Pet,
  PetProfileSnapshot,
  Temperament,
  VaccineEntry,
} from "@/lib/dashboard";
import { PET_DOCUMENTS_BUCKET } from "@/lib/platform/types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LAB_MIME_TYPES = new Set<LabReportEntry["mimeType"]>([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

const ACTIVITY_LEVELS = new Set<ActivityLevel>(["low", "moderate", "high"]);

export function isPlatformPetId(id: string): boolean {
  return UUID_RE.test(id);
}

function parseActivity(value: unknown): ActivityLevel {
  if (typeof value === "string" && ACTIVITY_LEVELS.has(value as ActivityLevel)) {
    return value as ActivityLevel;
  }
  return "moderate";
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

    const [{ data: files }, { data: vaccinesData }, { data: snapshotsData }] =
      await Promise.all([
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
      administered: v.administered as string,
      nextDue: (v.next_due as string | null) ?? "",
    }));

    const profileHistory: PetProfileSnapshot[] = (snapshotsData ?? [])
      .map(parseSnapshot)
      .filter((item): item is PetProfileSnapshot => item !== null);

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
      vaccines,
      supplements: [],
      food: [],
      moods: [],
      labReports,
      profileHistory,
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
