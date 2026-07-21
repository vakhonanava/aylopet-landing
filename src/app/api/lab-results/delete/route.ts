import { del } from "@vercel/blob";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { deleteLabReport } from "@/lib/lab-reports/repository";

const BLOB_REPORT_PATH_PATTERN =
  /^lab-results\/[a-zA-Z0-9_-]{1,80}\/[^/]{1,240}$/;
const SUPABASE_REPORT_PATH_PATTERN =
  /^[a-zA-Z0-9_-]{1,80}\/[^/]{1,240}$/;

export const runtime = "nodejs";

export async function DELETE(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }

  let pathname = "";
  try {
    const body = (await request.json()) as { pathname?: unknown };
    pathname = typeof body.pathname === "string" ? body.pathname : "";
  } catch {
    return Response.json({ error: "Invalid delete request." }, { status: 400 });
  }

  if (isSupabaseConfigured()) {
    if (!SUPABASE_REPORT_PATH_PATTERN.test(pathname)) {
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
