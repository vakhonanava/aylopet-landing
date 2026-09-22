import {
  PET_DOCUMENTS_BUCKET,
  PET_MEDICAL_DOCS_BUCKET,
} from "@/lib/platform/types";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/utils/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/**
 * Uploads live at `<userId>/<petId>/<file>`; storage listing is one level at a
 * time, so walk the member's folder and collect the leaves.
 */
async function removeUserFiles(
  admin: SupabaseClient,
  bucket: string,
  userId: string,
): Promise<void> {
  const { data: folders } = await admin.storage.from(bucket).list(userId);
  if (!folders?.length) return;

  const paths: string[] = [];
  for (const folder of folders) {
    const prefix = `${userId}/${folder.name}`;
    const { data: files } = await admin.storage.from(bucket).list(prefix);
    for (const file of files ?? []) {
      paths.push(`${prefix}/${file.name}`);
    }
    // A file sitting directly in the member's folder lists with no children.
    if (!files?.length) paths.push(prefix);
  }

  if (paths.length) await admin.storage.from(bucket).remove(paths);
}

/**
 * Deletes the signed-in member's account for good.
 *
 * Pets, documents, logbook, medical records, invites and points hang off
 * profiles with `on delete cascade`, so removing the auth user clears them.
 * What does not cascade is handled here: stored files, and the rows that keep
 * the member's contact details under their email rather than their id.
 */
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }

  let user;
  try {
    const supabase = await createClient();
    ({
      data: { user },
    } = await supabase.auth.getUser());
  } catch {
    return Response.json({ error: "Auth is not configured." }, { status: 500 });
  }

  if (!user) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return Response.json(
      { error: "Account deletion is not configured on this environment." },
      { status: 500 },
    );
  }

  const admin = createSupabaseAdmin();
  const email = user.email?.trim().toLowerCase() ?? "";

  try {
    await removeUserFiles(admin, PET_DOCUMENTS_BUCKET, user.id);
    await removeUserFiles(admin, PET_MEDICAL_DOCS_BUCKET, user.id);

    // waitlist.user_id is `on delete set null`, so the row would outlive the
    // account with the member's name, email and phone still on it.
    await admin.from("waitlist").delete().eq("user_id", user.id);
    if (email) {
      await admin.from("waitlist").delete().eq("email", email);
      await admin.from("early_adopter_leads").delete().eq("email", email);
      await admin.from("project_expectations").delete().eq("email", email);
    }

    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  } catch (cause) {
    return Response.json(
      { error: cause instanceof Error ? cause.message : "Deletion failed." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
