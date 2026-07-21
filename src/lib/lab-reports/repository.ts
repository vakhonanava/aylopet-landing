import { createSupabaseAdmin } from "@/lib/supabase/server";
import {
  LAB_RESULTS_BUCKET,
  type LabReportMimeType,
  type LabReportRecord,
} from "@/lib/lab-reports/types";

interface LabReportRow {
  id: string;
  pet_id: string;
  name: string;
  size_bytes: number;
  mime_type: LabReportMimeType;
  storage_path: string;
  status: "uploaded";
  uploaded_at: string;
}

function uid(prefix = "lab"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function rowToRecord(row: LabReportRow, url: string): LabReportRecord {
  return {
    id: row.id,
    petId: row.pet_id,
    name: row.name,
    size: row.size_bytes,
    mimeType: row.mime_type,
    storagePath: row.storage_path,
    url,
    uploadedAt: row.uploaded_at,
    status: row.status,
  };
}

export async function listLabReportsForPet(
  petId: string,
): Promise<LabReportRecord[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("lab_reports")
    .select("*")
    .eq("pet_id", petId)
    .order("uploaded_at", { ascending: false });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as LabReportRow[];
  const records: LabReportRecord[] = [];

  for (const row of rows) {
    const { data: signed, error: signError } = await supabase.storage
      .from(LAB_RESULTS_BUCKET)
      .createSignedUrl(row.storage_path, 60 * 60);

    if (signError) continue;
    records.push(rowToRecord(row, signed.signedUrl));
  }

  return records;
}

export async function uploadLabReport(input: {
  petId: string;
  file: File;
}): Promise<LabReportRecord> {
  const supabase = createSupabaseAdmin();
  const id = uid();
  const safeName = input.file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 120);
  const storagePath = `${input.petId}/${Date.now()}-${safeName}`;

  const buffer = Buffer.from(await input.file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(LAB_RESULTS_BUCKET)
    .upload(storagePath, buffer, {
      contentType: input.file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const row: LabReportRow = {
    id,
    pet_id: input.petId,
    name: input.file.name,
    size_bytes: input.file.size,
    mime_type: input.file.type as LabReportMimeType,
    storage_path: storagePath,
    status: "uploaded",
    uploaded_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("lab_reports")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    await supabase.storage.from(LAB_RESULTS_BUCKET).remove([storagePath]);
    throw new Error(error.message);
  }

  const { data: signed, error: signError } = await supabase.storage
    .from(LAB_RESULTS_BUCKET)
    .createSignedUrl(storagePath, 60 * 60);

  if (signError) throw new Error(signError.message);

  return rowToRecord(data as LabReportRow, signed.signedUrl);
}

export async function deleteLabReport(storagePath: string): Promise<void> {
  const supabase = createSupabaseAdmin();

  const { error: storageError } = await supabase.storage
    .from(LAB_RESULTS_BUCKET)
    .remove([storagePath]);

  if (storageError) {
    throw new Error(storageError.message);
  }

  const { error: dbError } = await supabase
    .from("lab_reports")
    .delete()
    .eq("storage_path", storagePath);

  if (dbError) {
    throw new Error(dbError.message);
  }
}
