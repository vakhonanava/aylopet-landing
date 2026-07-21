import { isSupabaseConfigured } from "@/lib/supabase/env";
import { uploadLabReport } from "@/lib/lab-reports/repository";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;
const PET_ID_PATTERN = /^[a-zA-Z0-9_-]{1,80}$/;

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

  if (!PET_ID_PATTERN.test(petId)) {
    return Response.json({ error: "Invalid pet identifier." }, { status: 400 });
  }

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
    const report = await uploadLabReport({ petId, file });
    return Response.json({ ok: true, report });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload could not be completed.";
    return Response.json({ error: message }, { status: 500 });
  }
}
