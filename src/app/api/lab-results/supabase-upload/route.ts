import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isPlatformPetId } from "@/lib/platform/dashboard-sync";
import { uploadPetDocument } from "@/lib/platform/supabase";
import { PET_DOCUMENTS_BUCKET } from "@/lib/platform/types";
import { uploadLabReport } from "@/lib/lab-reports/repository";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;
const LEGACY_PET_ID_PATTERN = /^[a-zA-Z0-9_-]{1,80}$/;

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return Response.json(
      { error: "Supabase storage is not configured." },
      { status: 503 },
    );
  }

  if (!isSameOrigin(request)) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid upload request." }, { status: 400 });
  }

  const petId = String(formData.get("petId") ?? "");
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Missing file." }, { status: 400 });
  }

  if (
    !ALLOWED_CONTENT_TYPES.includes(
      file.type as (typeof ALLOWED_CONTENT_TYPES)[number],
    )
  ) {
    return Response.json(
      { error: "Only PDF, JPEG, and PNG files are allowed." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: "File exceeds 10MB limit." }, { status: 400 });
  }

  try {
    if (isPlatformPetId(petId)) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return Response.json({ error: "Sign in required." }, { status: 401 });
      }

      const { data: ownedPet } = await supabase
        .from("pets")
        .select("id")
        .eq("id", petId)
        .eq("owner_id", user.id)
        .maybeSingle();

      if (!ownedPet) {
        return Response.json({ error: "Pet not found." }, { status: 403 });
      }

      const { metadata, error } = await uploadPetDocument(supabase, {
        userId: user.id,
        petId,
        file,
        category: "vet_medical",
      });

      if (error || !metadata) {
        return Response.json({ error: error ?? "Upload failed." }, { status: 500 });
      }

      const { data: signed } = await supabase.storage
        .from(PET_DOCUMENTS_BUCKET)
        .createSignedUrl(metadata.filePath, 60 * 60);

      return Response.json({
        ok: true,
        report: {
          id: metadata.id,
          petId: metadata.petId,
          name: metadata.fileName,
          size: metadata.fileSize,
          mimeType: file.type,
          storagePath: metadata.filePath,
          url: signed?.signedUrl ?? "",
          uploadedAt: metadata.createdAt,
          status: "uploaded",
        },
      });
    }

    if (!LEGACY_PET_ID_PATTERN.test(petId)) {
      return Response.json({ error: "Invalid pet identifier." }, { status: 400 });
    }

    const report = await uploadLabReport({ petId, file });
    return Response.json({ ok: true, report });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload could not be completed.";
    return Response.json({ error: message }, { status: 500 });
  }
}
