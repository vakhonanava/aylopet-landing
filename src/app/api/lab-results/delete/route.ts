import { del } from "@vercel/blob";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { deletePetDocument } from "@/lib/platform/supabase";
import { deleteLabReport } from "@/lib/lab-reports/repository";
import { createClient } from "@/utils/supabase/server";

const BLOB_REPORT_PATH_PATTERN =
  /^lab-results\/[a-zA-Z0-9_-]{1,80}\/[^/]{1,240}$/;
const LEGACY_SUPABASE_REPORT_PATH_PATTERN =
  /^[a-zA-Z0-9_-]{1,80}\/[^/]{1,240}$/;
const PLATFORM_FILE_PATH_PATTERN =
  /^[0-9a-f-]{36}\/[0-9a-f-]{36}\/[^/]{1,240}$/i;

export const runtime = "nodejs";

export async function DELETE(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }

  let pathname = "";
  let fileId = "";
  try {
    const body = (await request.json()) as {
      pathname?: unknown;
      fileId?: unknown;
    };
    pathname = typeof body.pathname === "string" ? body.pathname : "";
    fileId = typeof body.fileId === "string" ? body.fileId : "";
  } catch {
    return Response.json({ error: "Invalid delete request." }, { status: 400 });
  }

  if (isSupabaseConfigured()) {
    if (PLATFORM_FILE_PATH_PATTERN.test(pathname) || fileId) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return Response.json({ error: "Sign in required." }, { status: 401 });
      }

      const query = supabase
        .from("pet_files")
        .select("*")
        .eq("owner_id", user.id);

      const { data: fileRow, error: lookupError } = fileId
        ? await query.eq("id", fileId).maybeSingle()
        : await query.eq("file_path", pathname).maybeSingle();

      if (lookupError || !fileRow) {
        return Response.json({ error: "File not found." }, { status: 404 });
      }

      const { error } = await deletePetDocument(supabase, {
        id: fileRow.id as string,
        petId: fileRow.pet_id as string,
        fileName: fileRow.file_name as string,
        filePath: fileRow.file_path as string,
        fileSize: fileRow.file_size as number,
        fileType: fileRow.file_type as string,
        category: fileRow.category as "vet_medical",
        status: fileRow.status as string,
        createdAt: fileRow.created_at as string,
      });

      if (error) {
        return Response.json({ error }, { status: 500 });
      }

      return Response.json({ ok: true });
    }

    if (!LEGACY_SUPABASE_REPORT_PATH_PATTERN.test(pathname)) {
      return Response.json({ error: "Invalid report pathname." }, { status: 400 });
    }

    try {
      await deleteLabReport(pathname);
      return Response.json({ ok: true });
    } catch {
      return Response.json(
        { error: "ფაილის წაშლა ვერ მოხერხდა. სცადე თავიდან." },
        { status: 500 },
      );
    }
  }

  if (!BLOB_REPORT_PATH_PATTERN.test(pathname)) {
    return Response.json({ error: "Invalid report pathname." }, { status: 400 });
  }

  try {
    await del(pathname);
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "ფაილის წაშლა ვერ მოხერხდა. სცადე თავიდან." },
      { status: 500 },
    );
  }
}
