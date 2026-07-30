"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import { CARE_TYPE_LABELS, daysUntil, formatDate, type CareType } from "@/lib/dashboard";
import { SEVERITY_LEVELS } from "@/lib/medical";
import type { VetReportData } from "@/lib/platform/vet-report";

function computeAge(birthDate: string | null): string {
  if (!birthDate) return "უცნობია";
  const now = new Date();
  const dob = new Date(birthDate);
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years <= 0) return `${months} თვის`;
  return `${years} წლის${months > 0 ? ` ${months} თვის` : ""}`;
}

function genderLabel(gender: string | null): string {
  if (gender === "male") return "მამრობითი";
  if (gender === "female") return "მდედრობითი";
  return "უცნობია";
}

const CARE_TYPE_ORDER: CareType[] = ["vaccine", "deworming", "flea_tick"];

export function VetReportView({
  data,
  mode,
}: {
  data: VetReportData;
  mode: "authenticated" | "public";
}) {
  const {
    pet,
    owner,
    medicalRecord,
    activeMedications,
    recentSymptomLogs,
    preventativeCare,
    symptomWindowDays,
    generatedAt,
  } = data;

  const hasHighlights =
    !!medicalRecord &&
    (medicalRecord.allergies.length > 0 ||
      medicalRecord.chronicConditions.length > 0 ||
      medicalRecord.geneticRisks.length > 0 ||
      !!medicalRecord.surgeriesAndTraumas);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between print:hidden">
        {mode === "authenticated" ? (
          <Link
            href={`/dashboard/pets/${pet.id}`}
            className="text-sm font-medium text-slate-500 hover:text-[var(--brand-primary)]"
          >
            ← პროფილში დაბრუნება
          </Link>
        ) : (
          <span className="text-sm text-slate-400">გაზიარებული ჯანმრთელობის რეპორტი</span>
        )}
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-medium text-white"
        >
          <Printer className="h-4 w-4" /> ბეჭდვა / PDF-ად შენახვა
        </button>
      </div>

      <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[#e5e7eb] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--brand-primary)]">{pet.name}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {pet.breed} · {computeAge(pet.birthDate)} · {genderLabel(pet.gender)}
            {pet.isNeutered ? " · კასტრირებული/სტერილიზებული" : ""}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            წონა: {pet.weightKg} კგ{pet.bcsScore ? ` · BCS: ${pet.bcsScore}/9` : ""}
          </p>
          {pet.microchipId && (
            <p className="mt-1 text-sm text-slate-500">მიკროჩიპი: {pet.microchipId}</p>
          )}
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>{owner.fullName}</p>
          <p>{owner.email}</p>
          {owner.phone && <p>{owner.phone}</p>}
          <p className="mt-2">შედგენილია: {formatDate(generatedAt)}</p>
        </div>
      </header>

      {hasHighlights && medicalRecord && (
        <section className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-red-700">ყურადღება</h2>
          {medicalRecord.allergies.length > 0 && (
            <p className="mt-2 text-sm text-red-800">
              <span className="font-semibold">ალერგიები:</span>{" "}
              {medicalRecord.allergies.join(", ")}
            </p>
          )}
          {medicalRecord.chronicConditions.length > 0 && (
            <p className="mt-2 text-sm text-red-800">
              <span className="font-semibold">ქრონიკული დაავადებები:</span>{" "}
              {medicalRecord.chronicConditions.join(", ")}
            </p>
          )}
          {medicalRecord.geneticRisks.length > 0 && (
            <p className="mt-2 text-sm text-red-800">
              <span className="font-semibold">გენეტიკური რისკები:</span>{" "}
              {medicalRecord.geneticRisks.join(", ")}
            </p>
          )}
          {medicalRecord.surgeriesAndTraumas && (
            <p className="mt-2 text-sm text-red-800">
              <span className="font-semibold">ოპერაციები/ტრავმები:</span>{" "}
              {medicalRecord.surgeriesAndTraumas}
            </p>
          )}
        </section>
      )}

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--brand-primary)]">
          მიმდინარე მედიკამენტები
        </h2>
        {activeMedications.length === 0 ? (
          <p className="text-sm text-slate-400">არ არის აქტიური მედიკამენტი.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb] text-left text-slate-500">
                <th className="py-2 pr-4 font-medium">სახელი</th>
                <th className="py-2 pr-4 font-medium">დოზა</th>
                <th className="py-2 font-medium">სიხშირე</th>
              </tr>
            </thead>
            <tbody>
              {activeMedications.map((m) => (
                <tr key={m.id} className="border-b border-[#f1f1ef]">
                  <td className="py-2 pr-4 font-medium text-[var(--brand-primary)]">{m.name}</td>
                  <td className="py-2 pr-4 text-slate-600">{m.dosage || "·"}</td>
                  <td className="py-2 text-slate-600">{m.frequency || "·"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--brand-primary)]">
          სიმპტომების ისტორია (ბოლო {symptomWindowDays} დღე)
        </h2>
        {recentSymptomLogs.length === 0 ? (
          <p className="text-sm text-slate-400">ჩანაწერი არ არის.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb] text-left text-slate-500">
                <th className="py-2 pr-4 font-medium">თარიღი</th>
                <th className="py-2 pr-4 font-medium">სიმპტომი</th>
                <th className="py-2 pr-4 font-medium">სიმძიმე</th>
                <th className="py-2 font-medium">შენიშვნა</th>
              </tr>
            </thead>
            <tbody>
              {recentSymptomLogs.map((log) => {
                const level = SEVERITY_LEVELS.find((l) => l.value === log.severity);
                return (
                  <tr key={log.id} className="border-b border-[#f1f1ef] align-top">
                    <td className="whitespace-nowrap py-2 pr-4 text-slate-600">
                      {formatDate(log.loggedAt)}
                    </td>
                    <td className="py-2 pr-4 font-medium text-[var(--brand-primary)]">
                      {log.symptomType}
                    </td>
                    <td className="py-2 pr-4">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${level?.colorClass ?? ""}`}
                      >
                        {level?.label ?? log.severity}
                      </span>
                    </td>
                    <td className="py-2 text-slate-600">{log.notes || "·"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--brand-primary)]">
          ვაქცინაცია & პარაზიტების პრევენცია
        </h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#e5e7eb] text-left text-slate-500">
              <th className="py-2 pr-4 font-medium">ტიპი</th>
              <th className="py-2 pr-4 font-medium">დასახელება</th>
              <th className="py-2 pr-4 font-medium">ჩატარდა</th>
              <th className="py-2 font-medium">შემდეგი</th>
            </tr>
          </thead>
          <tbody>
            {CARE_TYPE_ORDER.map((type) => {
              const entry = preventativeCare[type];
              return (
                <tr key={type} className="border-b border-[#f1f1ef]">
                  <td className="py-2 pr-4 text-slate-600">{CARE_TYPE_LABELS[type]}</td>
                  <td className="py-2 pr-4 font-medium text-[var(--brand-primary)]">
                    {entry?.title ?? "·"}
                  </td>
                  <td className="py-2 pr-4 text-slate-600">
                    {entry ? formatDate(entry.administered) : "·"}
                  </td>
                  <td className="py-2 text-slate-600">
                    {entry?.nextDue
                      ? `${formatDate(entry.nextDue)}${
                          daysUntil(entry.nextDue) < 0 ? " (ვადაგადაცილებული)" : ""
                        }`
                      : "·"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
