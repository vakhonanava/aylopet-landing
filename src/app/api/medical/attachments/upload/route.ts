import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isPlatformPetId } from "@/lib/platform/dashboard-sync";
import {
  ACCEPTED_MEDICAL_FILE_TYPES,
  MAX_MEDICAL_FILE_BYTES,
  PET_MEDICAL_DOCS_BUCKET,
} from "@/lib/platform/types";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

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
    !ACCEPTED_MEDICAL_FILE_TYPES.includes(
      file.type as (typeof ACCEPTED_MEDICAL_FILE_TYPES)[number],
    )
  ) {
    return Response.json(
      { error: "Only JPEG, PNG, WEBP, MP4, MOV, or PDF files are allowed." },
      { status: 400 },
    );
  }

  if (file.size > MAX_MEDICAL_FILE_BYTES) {
    return Response.json({ error: "File exceeds 10MB limit." }, { status: 400 });
  }

  if (!isPlatformPetId(petId)) {
    return Response.json({ error: "Invalid pet identifier." }, { status: 400 });
  }

  try {
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

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const path = `${user.id}/${petId}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(PET_MEDICAL_DOCS_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      return Response.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: signed } = await supabase.storage
      .from(PET_MEDICAL_DOCS_BUCKET)
      .createSignedUrl(path, 60 * 60);

    return Response.json({ ok: true, path, url: signed?.signedUrl ?? "" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload could not be completed.";
    return Response.json({ error: message }, { status: 500 });
  }
}
