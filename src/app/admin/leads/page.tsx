import type { Metadata } from "next";
import { getAllLeads, getLeadStorageMode } from "@/lib/leads/repository";
import {
  FEATURE_EXPECTATION_LABELS,
  GOAL_LABELS,
  PRODUCT_INTEREST_LABELS,
  PRODUCT_EXPECTATION_LABELS,
  REFERRAL_LABELS,
} from "@/lib/leads/types";

export const metadata: Metadata = {
  title: "Aylopet · Leads Admin",
  robots: "noindex, nofollow",
};

export default async function LeadsAdminPage() {
  const leads = await getAllLeads();
  const storageMode = getLeadStorageMode();

  return (
    <main className="min-h-screen bg-[var(--background-main)] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Early Adopter Leads
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {leads.length} რეგისტრაცია · storage:{" "}
          <code className="rounded bg-[var(--background-secondary)] px-1.5 py-0.5">
            {storageMode}
          </code>
        </p>

        {leads.length === 0 ? (
          <p className="mt-10 text-[var(--text-secondary)]">
            ჯერ არავინ დარეგისტრირდა.
          </p>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--border-light)] bg-white shadow-soft">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-[var(--border-light)] bg-[var(--background-secondary)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">თარიღი</th>
                  <th className="px-4 py-3 font-semibold">მფლობელი</th>
                  <th className="px-4 py-3 font-semibold">ელ. ფოსტა</th>
                  <th className="px-4 py-3 font-semibold">ტელეფონი</th>
                  <th className="px-4 py-3 font-semibold">ძაღლი</th>
                  <th className="px-4 py-3 font-semibold">ჯიში</th>
                  <th className="px-4 py-3 font-semibold">ინტერესები</th>
                  <th className="px-4 py-3 font-semibold">ფუნქციები</th>
                  <th className="px-4 py-3 font-semibold">მიზანი</th>
                  <th className="px-4 py-3 font-semibold">წყარო</th>
                  <th className="px-4 py-3 font-semibold">DNA</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-[var(--border-light)] last:border-0"
                  >
                    <td className="px-4 py-3 tabular-nums">{lead.position}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-[var(--text-secondary)]">
                      {new Date(lead.createdAt).toLocaleDateString("ka-GE")}
                    </td>
                    <td className="px-4 py-3 font-medium">{lead.ownerName}</td>
                    <td className="px-4 py-3">{lead.email}</td>
                    <td className="px-4 py-3">{lead.phone ?? "·"}</td>
                    <td className="px-4 py-3">{lead.dogName}</td>
                    <td className="px-4 py-3">{lead.breed}</td>
                    <td className="max-w-[14rem] px-4 py-3 text-xs">
                      {lead.productInterests?.length
                        ? lead.productInterests
                            .map((interest) => PRODUCT_INTEREST_LABELS[interest])
                            .join(", ")
                        : lead.productExpectation
                          ? PRODUCT_EXPECTATION_LABELS[
                              lead.productExpectation
                            ]
                          : "·"}
                    </td>
                    <td className="px-4 py-3 max-w-[12rem] text-xs">
                      {lead.featureExpectations?.length
                        ? lead.featureExpectations
                            .map((f) => FEATURE_EXPECTATION_LABELS[f])
                            .join(", ")
                        : "·"}
                    </td>
                    <td className="px-4 py-3">
                      {GOAL_LABELS[lead.primaryGoal]}
                    </td>
                    <td className="px-4 py-3">
                      {REFERRAL_LABELS[lead.referralSource]}
                    </td>
                    <td className="px-4 py-3">
                      {lead.wantsDnaKit ? "✓" : "·"}
                    </td>
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
