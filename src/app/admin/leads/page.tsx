import type { Metadata } from "next";
import {
  formatExpectations,
  getAllPlatformSignups,
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
  const leads = await getAllPlatformSignups();
  const storageMode = getLeadStorageMode();

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
      </div>
    </main>
  );
}
