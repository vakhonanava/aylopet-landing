import type { Metadata } from "next";
import { VetReportView } from "@/components/dashboard/medical/VetReportView";
import { getVetReportByToken, type VetReportShareFailureReason } from "@/lib/platform/vet-report";

export const metadata: Metadata = {
  title: "Aylopet · ჯანმრთელობის რეპორტი",
  robots: { index: false, follow: false },
};

// Share-link expiry and revocation have to be evaluated on every request, so
// this route can never be served from the full route cache.
export const dynamic = "force-dynamic";

const REASON_MESSAGES: Record<VetReportShareFailureReason, string> = {
  not_found: "ეს ბმული არასწორია ან აღარ არსებობს.",
  expired: "ბმულს ვადა გაუვიდა.",
  revoked: "ეს ბმული გაუქმებულია.",
};

export default async function PublicVetReportPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await getVetReportByToken(token);

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-lg font-semibold text-[var(--brand-primary)]">რეპორტი ვერ მოიძებნა</p>
        <p className="mt-2 text-sm text-slate-500">{REASON_MESSAGES[result.reason]}</p>
      </div>
    );
  }

  return <VetReportView data={result.data} mode="public" />;
}
