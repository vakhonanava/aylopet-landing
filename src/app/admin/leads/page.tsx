import type { Metadata } from "next";
import {
  formatExpectations,
  getAllPlatformSignups,
  getAllReferrals,
  getLeadStorageMode,
} from "@/lib/platform/admin";

export const metadata: Metadata = {
  title: "Aylopet · Leads Admin",
  robots: "noindex, nofollow",
};

// Reads live signups through the service-role client on every request — must
// never be prerendered or cached.
export const dynamic = "force-dynamic";

export default async function LeadsAdminPage() {
  const [leads, referrals] = await Promise.all([
    getAllPlatformSignups(),
    getAllReferrals(),
  ]);
  const storageMode = getLeadStorageMode();

  const completedReferrals = referrals.filter((r) => r.status === "completed");
  const pointsAwarded = completedReferrals.reduce((sum, r) => sum + r.points_awarded, 0);
  const inviters = new Map<string, { name: string; email: string; completed: number; pending: number; points: number }>();
  for (const r of referrals) {
    const key = r.referrer?.email ?? r.code;
    const row = inviters.get(key) ?? {
      name: r.referrer?.full_name ?? "·",
      email: r.referrer?.email ?? "·",
      completed: 0,
      pending: 0,
      points: 0,
    };
    if (r.status === "completed") row.completed += 1;
    else row.pending += 1;
    row.points += r.points_awarded;
    inviters.set(key, row);
  }
  const topInviters = [...inviters.values()].sort(
    (a, b) => b.completed - a.completed || b.pending - a.pending,
  );

  return (
    <main className="min-h-screen bg-[var(--background-main)] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Platform Signups
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {leads.length} რეგისტრაცია · storage:{" "}
          <code className="rounded bg-[var(--background-secondary)] px-1.5 py-0.5">
            {storageMode}
          </code>
          {" · unified waitlist + profiles + pets (RLS)"}
        </p>

        {leads.length === 0 ? (
          <p className="mt-10 text-[var(--text-secondary)]">
            ჯერ არავინ დარეგისტრირდა. გახსენი `/onboarding/platform`.
          </p>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--border-light)] bg-white shadow-soft">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-[var(--border-light)] bg-[var(--background-secondary)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">თარიღი</th>
                  <th className="px-4 py-3 font-semibold">მფლობელი</th>
                  <th className="px-4 py-3 font-semibold">ელ. ფოსტა</th>
                  <th className="px-4 py-3 font-semibold">ტელეფონი</th>
                  <th className="px-4 py-3 font-semibold">ძაღლი</th>
                  <th className="px-4 py-3 font-semibold">ჯიში</th>
                  <th className="px-4 py-3 font-semibold">მოლოდინები</th>
                  <th className="px-4 py-3 font-semibold">ფაილები</th>
                  <th className="px-4 py-3 font-semibold">წყარო</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-[var(--border-light)] last:border-0"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-[var(--text-secondary)]">
                      {new Date(lead.created_at).toLocaleDateString("ka-GE")}
                    </td>
                    <td className="px-4 py-3 font-medium">{lead.owner_name}</td>
                    <td className="px-4 py-3">{lead.email}</td>
                    <td className="px-4 py-3">{lead.phone ?? "·"}</td>
                    <td className="px-4 py-3">{lead.dog_name ?? "·"}</td>
                    <td className="px-4 py-3">{lead.breed ?? "·"}</td>
                    <td className="max-w-[14rem] px-4 py-3 text-xs">
                      {lead.expectations?.length
                        ? formatExpectations(lead.expectations)
                        : "·"}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{lead.file_count ?? 0}</td>
                    <td className="px-4 py-3 text-xs">{lead.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h2 className="mt-14 text-xl font-bold text-[var(--text-primary)]">
          რეფერალები
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {referrals.length} მოწვევა · {completedReferrals.length} დადასტურებული ·{" "}
          {pointsAwarded} ქულა დარიცხული
        </p>

        {referrals.length === 0 ? (
          <p className="mt-6 text-[var(--text-secondary)]">
            ჯერ არავინ დარეგისტრირებულა მოსაწვევი კოდით.
          </p>
        ) : (
          <>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border-light)] bg-white shadow-soft">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-[var(--border-light)] bg-[var(--background-secondary)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">მომწვევი</th>
                    <th className="px-4 py-3 font-semibold">დადასტურებული</th>
                    <th className="px-4 py-3 font-semibold">მოლოდინში</th>
                    <th className="px-4 py-3 font-semibold">ქულა</th>
                  </tr>
                </thead>
                <tbody>
                  {topInviters.map((row) => (
                    <tr key={row.email} className="border-b border-[var(--border-light)] last:border-0">
                      <td className="px-4 py-3">
                        <span className="font-medium">{row.name}</span>
                        <span className="block text-xs text-[var(--text-secondary)]">{row.email}</span>
                      </td>
                      <td className="px-4 py-3 tabular-nums">{row.completed}</td>
                      <td className="px-4 py-3 tabular-nums">{row.pending}</td>
                      <td className="px-4 py-3 tabular-nums">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border-light)] bg-white shadow-soft">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-[var(--border-light)] bg-[var(--background-secondary)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">თარიღი</th>
                    <th className="px-4 py-3 font-semibold">მომწვევი</th>
                    <th className="px-4 py-3 font-semibold">მოწვეული</th>
                    <th className="px-4 py-3 font-semibold">კოდი</th>
                    <th className="px-4 py-3 font-semibold">სტატუსი</th>
                    <th className="px-4 py-3 font-semibold">ქულა</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id} className="border-b border-[var(--border-light)] last:border-0">
                      <td className="px-4 py-3 whitespace-nowrap text-[var(--text-secondary)]">
                        {new Date(r.created_at).toLocaleDateString("ka-GE")}
                      </td>
                      <td className="px-4 py-3">{r.referrer?.email ?? "·"}</td>
                      <td className="px-4 py-3">{r.referred?.email ?? "·"}</td>
                      <td className="px-4 py-3 font-mono text-xs">{r.code}</td>
                      <td className="px-4 py-3 text-xs">
                        {r.status === "completed" ? "დადასტურებული" : "ელოდება ელფოსტის დადასტურებას"}
                      </td>
                      <td className="px-4 py-3 tabular-nums">{r.points_awarded}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
