import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createVetReportShareInSupabase } from "@/lib/platform/medical-persistence";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return Response.json(
      { error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  if (!isSameOrigin(request)) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }

  let body: { petId?: string; expiresInDays?: number };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const petId = String(body.petId ?? "");
  if (!petId) {
    return Response.json({ error: "Missing petId." }, { status: 400 });
  }

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

  const { token, error } = await createVetReportShareInSupabase(
    supabase,
    user.id,
    petId,
    { expiresInDays: body.expiresInDays },
  );

  if (error || !token) {
    return Response.json(
      { error: error ?? "Share link could not be created." },
      { status: 500 },
    );
  }

  const origin = new URL(request.url).origin;
  return Response.json({ ok: true, token, url: `${origin}/vet-report/${token}` });
}
