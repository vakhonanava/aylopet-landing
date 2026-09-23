"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import type { ReactNode } from "react";
import { LabFilesPrint } from "@/components/dashboard/medical/LabFilesPrint";
import {
  CARE_TYPE_LABELS,
  MOOD_SCALE,
  daysUntil,
  formatDate,
  mealLabel,
} from "@/lib/dashboard";
import { SEVERITY_LEVELS } from "@/lib/medical";
import { summariseWeight } from "@/lib/pet-history/calculations";
import {
  STOOL_CONSISTENCY_LABELS,
  URINATION_CHANGE_LABELS,
  WATER_CHANGE_LABELS,
  hydrationEntryFlags,
  sortHydrationEntries,
} from "@/lib/pet-history/hydration";
import {
  LAB_METRIC_DEFS,
  flaggedLabValues,
  labFlagStatus,
  sortLabMetricEntries,
} from "@/lib/pet-history/lab-metrics";
import {
  APPETITE_LABELS,
  DIET_LABELS,
  GENETIC_CATEGORY_LABELS,
  GENETIC_LEVEL,
  MICROCHIP_STATUS,
} from "@/lib/pet-history/labels";
import {
  VET_VISIT_OUTCOME,
  VET_VISIT_REASON_LABELS,
  pendingFollowUps,
  sortVetVisits,
} from "@/lib/pet-history/vet-visits";
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

const RECENT_ROWS = 10;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-6 break-inside-avoid-page">
      <h2 className="mb-2 border-b border-[#e5e7eb] pb-1 text-sm font-bold uppercase tracking-wide text-[var(--brand-primary)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Empty({ children = "ჩანაწერი არ არის." }: { children?: ReactNode }) {
  return <p className="text-sm text-slate-400">{children}</p>;
}

/** „Label: value“ line that disappears when there is no value. */
function Field({ label, value }: { label: string; value?: ReactNode }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <p className="text-sm text-slate-700">
      <span className="font-semibold text-[var(--brand-primary)]">{label}:</span>{" "}
      <span className="break-words">{value}</span>
    </p>
  );
}

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
    careHistory,
    history,
    labFiles,
    symptomWindowDays,
    generatedAt,
  } = data;

  const chip = history.microchip;
  const vet = history.vet;
  const visits = sortVetVisits(history.vetVisits).reverse();
  const followUps = pendingFollowUps(history.vetVisits);
  const weight = summariseWeight(history.weightLogs);
  const labEntries = sortLabMetricEntries(history.labMetrics).reverse();
  const flaggedLabs = flaggedLabValues(history.labMetrics);
  const hydration = sortHydrationEntries(history.hydrationLogs).reverse();
  const latestHydrationFlags = hydration[0] ? hydrationEntryFlags(hydration[0]) : [];
  const dnaRisks = (history.dna?.risks ?? []).filter((risk) => risk.level !== "clear");
  const appetiteNotes = history.foodLogs
    .filter(
      (entry) =>
        entry.appetite === "refused" ||
        entry.appetite === "poor" ||
        entry.digestiveResponse,
    )
    .slice(0, RECENT_ROWS);
  const caretaker = history.caretaker;
  const caretakerRows = caretaker
    ? ([
        ["დღის რეჟიმი", caretaker.routine],
        ["კვება", caretaker.feeding],
        ["მედიკამენტები", caretaker.medication],
        ["ქცევა", caretaker.behaviour],
        ["საგანგებო სიტუაციაში", caretaker.emergency],
      ] as const).filter(([, value]) => value?.trim())
    : [];

  const ownerName = chip?.ownerName || owner.fullName;
  const ownerPhone = chip?.ownerPhone || owner.phone;

  const hasHighlights =
    (!!medicalRecord &&
      (medicalRecord.allergies.length > 0 ||
        medicalRecord.chronicConditions.length > 0 ||
        medicalRecord.geneticRisks.length > 0 ||
        !!medicalRecord.surgeriesAndTraumas)) ||
    dnaRisks.length > 0 ||
    flaggedLabs.length > 0 ||
    followUps.length > 0 ||
    latestHydrationFlags.length > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
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

      <header className="mb-6 grid gap-4 border-b border-[#e5e7eb] pb-6 sm:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-[var(--brand-primary)]">{pet.name}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {pet.breed}, {computeAge(pet.birthDate)}, {genderLabel(pet.gender)}
            {pet.isNeutered ? ", კასტრირებული/სტერილიზებული" : ""}
            {history.reproductive?.procedureDate
              ? ` (${formatDate(history.reproductive.procedureDate)})`
              : ""}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            წონა: {weight.latest?.weightKg ?? pet.weightKg} კგ
            {(weight.latest?.bcs ?? pet.bcsScore)
              ? `, BCS: ${weight.latest?.bcs ?? pet.bcsScore}/9`
              : ""}
          </p>
          {pet.microchipId && (
            <p className="mt-1 text-sm text-slate-500">
              მიკროჩიპი: {pet.microchipId}
              {chip ? `, ${MICROCHIP_STATUS[chip.status].label}` : ""}
              {chip?.registryName ? ` (${chip.registryName})` : ""}
            </p>
          )}
        </div>
        <div className="text-xs text-slate-500 sm:text-right">
          <p className="font-semibold text-slate-600">მეპატრონე</p>
          <p>{ownerName}</p>
          {ownerPhone && <p>{ownerPhone}</p>}
          <p>{owner.email}</p>
          {chip?.ownerAddress && <p>{chip.ownerAddress}</p>}
          {vet && (vet.clinicName || vet.vetName || vet.phone) ? (
            <>
              <p className="mt-2 font-semibold text-slate-600">მკურნალი ვეტერინარი</p>
              {vet.clinicName && <p>{vet.clinicName}</p>}
              {vet.vetName && <p>{vet.vetName}</p>}
              {vet.phone && <p>{vet.phone}</p>}
              {vet.emergencyPhone && <p>სასწრაფო: {vet.emergencyPhone}</p>}
            </>
          ) : null}
          <p className="mt-2 text-slate-400">შედგენილია: {formatDate(generatedAt)}</p>
        </div>
      </header>

      {hasHighlights && (
        <section className="mb-6 space-y-2 rounded-2xl border border-red-200 bg-red-50 p-4 break-inside-avoid">
          <h2 className="text-sm font-bold uppercase tracking-wide text-red-700">ყურადღება</h2>
          {medicalRecord && medicalRecord.allergies.length > 0 && (
            <p className="text-sm text-red-800">
              <span className="font-semibold">ალერგიები:</span>{" "}
              {medicalRecord.allergies.join(", ")}
            </p>
          )}
          {medicalRecord && medicalRecord.chronicConditions.length > 0 && (
            <p className="text-sm text-red-800">
              <span className="font-semibold">ქრონიკული დაავადებები:</span>{" "}
              {medicalRecord.chronicConditions.join(", ")}
            </p>
          )}
          {medicalRecord?.surgeriesAndTraumas && (
            <p className="whitespace-pre-line text-sm text-red-800">
              <span className="font-semibold">ოპერაციები/ტრავმები:</span>{" "}
              {medicalRecord.surgeriesAndTraumas}
            </p>
          )}
          {(medicalRecord?.geneticRisks.length ?? 0) > 0 || dnaRisks.length > 0 ? (
            <p className="text-sm text-red-800">
              <span className="font-semibold">გენეტიკური რისკები:</span>{" "}
              {[
                ...(medicalRecord?.geneticRisks ?? []),
                ...dnaRisks.map(
                  (risk) => `${risk.condition} (${GENETIC_LEVEL[risk.level].label})`,
                ),
              ].join(", ")}
            </p>
          ) : null}
          {flaggedLabs.length > 0 && (
            <p className="text-sm text-red-800">
              <span className="font-semibold">ნორმიდან გადახრილი ანალიზები:</span>{" "}
              {flaggedLabs
                .map(
                  (flag) =>
                    `${flag.def.label} ${flag.value} ${flag.def.unit} (${flag.status === "high" ? "მაღალი" : "დაბალი"})`,
                )
                .join(", ")}
            </p>
          )}
          {latestHydrationFlags.length > 0 && (
            <p className="text-sm text-red-800">
              <span className="font-semibold">ბოლო დაკვირვება:</span>{" "}
              {latestHydrationFlags.map((flag) => flag.label).join(", ")}
            </p>
          )}
          {followUps.length > 0 && (
            <p className="text-sm text-red-800">
              <span className="font-semibold">დაგეგმილი განმეორებითი ვიზიტი:</span>{" "}
              {followUps
                .map(
                  (visit) =>
                    `${formatDate(visit.followUpDate ?? "")}, ${VET_VISIT_REASON_LABELS[visit.reason]}`,
                )
                .join("; ")}
            </p>
          )}
        </section>
      )}

      <Section title="ვეტ ვიზიტები და ოპერაციები">
        {visits.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-3">
            {visits.map((visit) => (
              <article
                key={visit.id}
                className={`space-y-1 rounded-xl border p-3 break-inside-avoid ${
                  visit.reason === "surgery"
                    ? "border-amber-300 bg-amber-50/60"
                    : "border-[#e5e7eb]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[var(--brand-primary)]">
                    {formatDate(visit.visitedAt)}, {VET_VISIT_REASON_LABELS[visit.reason]}
                  </p>
                  <span className="text-xs font-medium text-slate-500">
                    {VET_VISIT_OUTCOME[visit.outcome].label}
                  </span>
                </div>
                <Field
                  label="კლინიკა / ექიმი"
                  value={[visit.clinicName, visit.vetName].filter(Boolean).join(", ")}
                />
                <Field label="ჩივილი" value={visit.complaint} />
                <Field label="დიაგნოზი" value={visit.diagnosis} />
                <Field label="მკურნალობა" value={visit.treatment} />
                <Field
                  label="განმეორებითი ვიზიტი"
                  value={visit.followUpDate ? formatDate(visit.followUpDate) : undefined}
                />
                <Field label="შენიშვნა" value={visit.note} />
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section title="მიმდინარე მედიკამენტები და დანამატები">
        {activeMedications.length === 0 && history.supplements.length === 0 ? (
          <Empty>არ არის აქტიური მედიკამენტი ან დანამატი.</Empty>
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
              {history.supplements.map((s) => (
                <tr key={s.id} className="border-b border-[#f1f1ef]">
                  <td className="py-2 pr-4 font-medium text-[var(--brand-primary)]">
                    {s.name} <span className="text-xs font-normal text-slate-400">(დანამატი)</span>
                  </td>
                  <td className="py-2 pr-4 text-slate-600">{s.dosage || "·"}</td>
                  <td className="py-2 text-slate-600">{s.frequency || "·"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title={`სიმპტომების ისტორია (ბოლო ${symptomWindowDays} დღე)`}>
        {recentSymptomLogs.length === 0 ? (
          <Empty />
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
      </Section>

      <Section title="წონა და სხეულის კონდიცია">
        {weight.sorted.length === 0 ? (
          <Empty />
        ) : (
          <>
            {history.weightTarget && (
              <p className="mb-2 text-sm text-slate-600">
                სამიზნე: {history.weightTarget.minKg}–{history.weightTarget.maxKg} კგ
              </p>
            )}
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-left text-slate-500">
                  <th className="py-2 pr-4 font-medium">თარიღი</th>
                  <th className="py-2 pr-4 font-medium">წონა</th>
                  <th className="py-2 pr-4 font-medium">BCS</th>
                  <th className="py-2 font-medium">შენიშვნა</th>
                </tr>
              </thead>
              <tbody>
                {[...weight.sorted].reverse().slice(0, RECENT_ROWS).map((entry) => (
                  <tr key={entry.id} className="border-b border-[#f1f1ef]">
                    <td className="whitespace-nowrap py-2 pr-4 text-slate-600">
                      {formatDate(entry.recordedAt)}
                    </td>
                    <td className="py-2 pr-4 font-medium text-[var(--brand-primary)]">
                      {entry.weightKg} კგ
                    </td>
                    <td className="py-2 pr-4 text-slate-600">
                      {entry.bcs ? `${entry.bcs}/9` : "·"}
                    </td>
                    <td className="py-2 text-slate-600">{entry.note || "·"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </Section>

      <Section title="ლაბორატორიული მაჩვენებლები">
        {labEntries.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-4">
            {labEntries.map((entry) => (
              <div key={entry.id} className="break-inside-avoid">
                <p className="mb-1 text-sm font-semibold text-[var(--brand-primary)]">
                  {formatDate(entry.recordedAt)}
                  {entry.labName ? `, ${entry.labName}` : ""}
                </p>
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    {LAB_METRIC_DEFS.filter((def) => entry.values[def.key] !== undefined).map(
                      (def) => {
                        const value = entry.values[def.key] as number;
                        const flag = labFlagStatus(def.key, value);
                        return (
                          <tr key={def.key} className="border-b border-[#f1f1ef]">
                            <td className="py-1.5 pr-4 text-slate-600">{def.label}</td>
                            <td
                              className={`whitespace-nowrap py-1.5 pr-4 font-medium ${
                                flag === "normal" ? "text-[var(--brand-primary)]" : "text-red-600"
                              }`}
                            >
                              {value} {def.unit}
                              {flag === "high" ? " ↑" : flag === "low" ? " ↓" : ""}
                            </td>
                            <td className="whitespace-nowrap py-1.5 text-xs text-slate-400">
                              {def.normalMin}–{def.normalMax}
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
                {entry.note && <p className="mt-1 text-xs text-slate-500">{entry.note}</p>}
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="წყალი, შარდვა, განავალი">
        {hydration.length === 0 ? (
          <Empty />
        ) : (
          <ul className="space-y-1.5 text-sm text-slate-700">
            {hydration.slice(0, RECENT_ROWS).map((entry) => {
              const parts = [
                entry.waterMl ? `წყალი ${entry.waterMl} მლ` : null,
                entry.waterChange ? `წყალი: ${WATER_CHANGE_LABELS[entry.waterChange]}` : null,
                entry.urinationCount !== undefined ? `შარდვა ${entry.urinationCount}-ჯერ` : null,
                entry.urinationChange
                  ? `შარდვა: ${URINATION_CHANGE_LABELS[entry.urinationChange]}`
                  : null,
                entry.urinationStraining ? "გაძნელებული შარდვა" : null,
                entry.urinationBlood ? "სისხლი შარდში" : null,
                entry.stoolCount !== undefined ? `განავალი ${entry.stoolCount}-ჯერ` : null,
                entry.stoolConsistency
                  ? STOOL_CONSISTENCY_LABELS[entry.stoolConsistency]
                  : null,
                entry.stoolBlood ? "სისხლი განავალში" : null,
                entry.note || null,
              ].filter(Boolean);
              return (
                <li key={entry.id} className="border-b border-[#f1f1ef] pb-1.5">
                  <span className="font-medium text-[var(--brand-primary)]">
                    {formatDate(entry.recordedAt)}:
                  </span>{" "}
                  {parts.join(", ")}
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section title="კვება და რაციონი">
        {!history.diet && appetiteNotes.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-1">
            {history.diet && (
              <>
                <Field
                  label="დიეტა"
                  value={`${DIET_LABELS[history.diet.type]}${history.diet.productName ? `, ${history.diet.productName}` : ""}`}
                />
                <Field label="კვების სიხშირე" value={`დღეში ${history.diet.mealsPerDay}-ჯერ`} />
                <Field
                  label="ენერგეტიკული სიმკვრივე"
                  value={history.diet.kcalPer100g ? `${history.diet.kcalPer100g} kcal / 100 გ` : undefined}
                />
                <Field label="სამკურნალო დიეტის მიზეზი" value={history.diet.prescriptionReason} />
              </>
            )}
            {appetiteNotes.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {appetiteNotes.map((entry) => (
                  <li key={entry.id}>
                    <span className="font-medium text-[var(--brand-primary)]">
                      {formatDate(entry.date)}, {mealLabel(entry)}:
                    </span>{" "}
                    {[
                      entry.appetite ? `მადა — ${APPETITE_LABELS[entry.appetite]}` : null,
                      entry.digestiveResponse,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Section>

      <Section title="ვაქცინაცია და პარაზიტების პრევენცია">
        {careHistory.length === 0 ? (
          <Empty />
        ) : (
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
              {careHistory.map((entry, index) => (
                <tr key={`${entry.name}-${entry.administered}-${index}`} className="border-b border-[#f1f1ef]">
                  <td className="py-2 pr-4 text-slate-600">{CARE_TYPE_LABELS[entry.careType]}</td>
                  <td className="py-2 pr-4 font-medium text-[var(--brand-primary)]">{entry.name}</td>
                  <td className="whitespace-nowrap py-2 pr-4 text-slate-600">
                    {formatDate(entry.administered)}
                  </td>
                  <td className="py-2 text-slate-600">
                    {entry.nextDue
                      ? `${formatDate(entry.nextDue)}${
                          daysUntil(entry.nextDue) < 0 ? " (ვადაგადაცილებული)" : ""
                        }`
                      : "·"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {history.dna && (history.dna.ancestry.length > 0 || history.dna.risks.length > 0) ? (
        <Section title="გენეტიკური პროფილი">
          <div className="space-y-1">
            <Field
              label="ტესტი"
              value={[
                history.dna.provider,
                history.dna.testedAt ? formatDate(history.dna.testedAt) : null,
              ]
                .filter(Boolean)
                .join(", ")}
            />
            <Field
              label="წარმომავლობა"
              value={history.dna.ancestry
                .map((segment) => `${segment.breed} ${segment.percentage}%`)
                .join(", ")}
            />
            {history.dna.risks.length > 0 && (
              <ul className="mt-1 space-y-1 text-sm text-slate-700">
                {history.dna.risks.map((risk) => (
                  <li key={risk.id}>
                    <span className="font-medium text-[var(--brand-primary)]">
                      {risk.condition}
                    </span>{" "}
                    ({GENETIC_CATEGORY_LABELS[risk.category]}
                    {risk.gene ? `, ${risk.gene}` : ""}) — {GENETIC_LEVEL[risk.level].label}
                  </li>
                ))}
              </ul>
            )}
            <Field label="შენიშვნა" value={history.dna.notes} />
          </div>
        </Section>
      ) : null}

      {caretakerRows.length > 0 || history.moodLogs.length > 0 ? (
        <Section title="ქცევა და მოვლის შენიშვნები">
          <div className="space-y-1">
            {caretakerRows.map(([label, value]) => (
              <Field key={label} label={label} value={value} />
            ))}
            {history.moodLogs.length > 0 && (
              <Field
                label="ბოლო ჩექ-ინები"
                value={history.moodLogs
                  .slice(0, 5)
                  .map((entry) => {
                    const mood = MOOD_SCALE.find((m) => m.value === entry.mood);
                    return `${formatDate(entry.date)} — ${mood?.label ?? entry.mood}, ენერგია ${entry.energy}%${entry.notes ? ` (${entry.notes})` : ""}`;
                  })
                  .join("; ")}
              />
            )}
          </div>
        </Section>
      ) : null}

      <LabFilesPrint files={labFiles} />
    </div>
  );
}
