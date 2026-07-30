import { getVetReportByToken } from "@/lib/platform/vet-report";

export const runtime = "nodejs";

const STATUS_BY_REASON = {
  not_found: 404,
  expired: 410,
  revoked: 410,
} as const;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const result = await getVetReportByToken(token);

  if (!result.ok) {
    return Response.json(
      { error: result.reason },
      { status: STATUS_BY_REASON[result.reason] },
    );
  }

  return Response.json({ ok: true, data: result.data });
}
