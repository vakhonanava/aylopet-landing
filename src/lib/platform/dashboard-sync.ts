import type { SupabaseClient } from "@supabase/supabase-js";
import type { Account, LabReportEntry, Pet } from "@/lib/dashboard";
import { PET_DOCUMENTS_BUCKET } from "@/lib/platform/types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LAB_MIME_TYPES = new Set<LabReportEntry["mimeType"]>([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

export function isPlatformPetId(id: string): boolean {
  return UUID_RE.test(id);
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
    const { data: files } = await supabase
      .from("pet_files")
      .select("*")
      .eq("pet_id", row.id)
      .order("created_at", { ascending: false });

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

    const rawWeight = Number(row.weight ?? 0);
    const weightKg =
      row.weight_unit === "lbs"
        ? Math.round(rawWeight * 0.453592 * 10) / 10
        : rawWeight;

    pets.push({
      id: row.id as string,
      name: row.pet_name as string,
      breed: row.breed as string,
      weightKg,
      activity: "moderate",
      temperament: [],
      vaccines: [],
      supplements: [],
      food: [],
      moods: [],
      labReports,
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
