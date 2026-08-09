"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  BellRing,
  CalendarClock,
  ShieldPlus,
  Syringe,
} from "lucide-react";
import { useMemo } from "react";
import {
  Chip,
  EmptyState,
  SectionCard,
} from "@/components/dashboard/history/ui";
import {
  CARE_TYPE_LABELS,
  daysUntil,
  formatDate,
  type CareType,
  type Pet,
  type VaccineEntry,
} from "@/lib/dashboard";

type DueState = "overdue" | "soon" | "scheduled";

/** Inside this window the entry is surfaced as an active reminder. */
const SOON_WINDOW_DAYS = 30;

function dueState(entry: VaccineEntry): DueState {
  const days = daysUntil(entry.nextDue);
  if (days < 0) return "overdue";
  if (days <= SOON_WINDOW_DAYS) return "soon";
  return "scheduled";
}

const DUE_TONE: Record<DueState, { className: string; dot: string }> = {
  overdue: { className: "border-red-200 bg-red-50 text-red-700", dot: "bg-red-500" },
  soon: {
    className: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  scheduled: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
};

function dueLabel(entry: VaccineEntry): string {
  const days = daysUntil(entry.nextDue);
  if (days < 0) return `ვადაგადაცილებული ${Math.abs(days)} დღით`;
  if (days === 0) return "დღეს";
  return `დარჩა ${days} დღე`;
}

function TimelineRow({ entry }: { entry: VaccineEntry }) {
  const state = dueState(entry);
  const tone = DUE_TONE[state];

  return (
    <motion.li
      layout
      className="relative flex gap-4 pb-6 last:pb-0"
    >
      <span className="relative flex flex-col items-center">
        <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${tone.dot}`} />
        <span className="mt-1 w-px flex-1 bg-[#eceae5]" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-[var(--brand-primary)]">
            {entry.name}
          </p>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${tone.className}`}
          >
            {dueLabel(entry)}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          ჩატარდა {formatDate(entry.administered)}, შემდეგი{" "}
          {formatDate(entry.nextDue)}
        </p>
      </div>
    </motion.li>
  );
}

function CareGroup({
  entries,
  emptyLabel,
}: {
  entries: VaccineEntry[];
  emptyLabel: string;
}) {
  if (entries.length === 0) {
    return <p className="py-4 text-sm text-slate-400">{emptyLabel}</p>;
  }

  const sorted = [...entries].sort(
    (a, b) => daysUntil(a.nextDue) - daysUntil(b.nextDue),
  );

  return (
    <ul className="mt-3">
      {sorted.map((entry) => (
        <TimelineRow key={entry.id} entry={entry} />
      ))}
    </ul>
  );
}

export function MedicalHistoryPanel({ pet }: { pet: Pet }) {
  const byType = useMemo(() => {
    const groups: Record<CareType, VaccineEntry[]> = {
      vaccine: [],
      deworming: [],
      flea_tick: [],
    };
    for (const entry of pet.vaccines) groups[entry.careType].push(entry);
    return groups;
  }, [pet.vaccines]);

  const reminders = useMemo(
    () => pet.vaccines.filter((entry) => dueState(entry) !== "scheduled"),
    [pet.vaccines],
  );

  const allergies = pet.medicalRecord?.allergies ?? [];
  const chronic = pet.medicalRecord?.chronicConditions ?? [];

  return (
    <>
      <SectionCard
        id="vaccines"
        icon={Syringe}
        title="ვაქცინაცია და ანტიპარაზიტული მოვლა"
        description="წარსული და დაგეგმილი პროცედურები ავტომატური შეხსენებებით."
      >
        {reminders.length > 0 ? (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-amber-800">
                {reminders.length} აქტიური შეხსენება
              </p>
              <p className="mt-0.5 text-xs text-amber-700">
                {reminders.map((entry) => entry.name).join(", ")}
              </p>
            </div>
          </div>
        ) : null}

        {pet.vaccines.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="ჩანაწერები ჯერ არ არის"
            body="ვაქცინები და ანტიპარაზიტული მოვლა ემატება „ვაქცინები & პრევენცია“ ჟურნალიდან."
          />
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[var(--brand-primary)]">
                {CARE_TYPE_LABELS.vaccine}
              </h3>
              <CareGroup
                entries={byType.vaccine}
                emptyLabel="ვაქცინაციის ჩანაწერი არ არის."
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--brand-primary)]">
                ანტიპარაზიტული მოვლა
              </h3>
              <CareGroup
                entries={[...byType.deworming, ...byType.flea_tick]}
                emptyLabel="მატლების/რწყილის საწინააღმდეგო ჩანაწერი არ არის."
              />
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        id="allergies"
        icon={AlertTriangle}
        title="ალერგიები და მგრძნობელობა"
        description="მაღალი ხილვადობის ნიშნები საკვებზე, გარემოსა და მედიკამენტებზე."
      >
        {allergies.length === 0 && chronic.length === 0 ? (
          <EmptyState
            icon={ShieldPlus}
            title="ალერგია აღრიცხული არ არის"
            body="ალერგიები და ქრონიკული მდგომარეობები ივსება სამედიცინო ბარათში."
          />
        ) : (
          <div className="space-y-4">
            {allergies.length > 0 ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  ალერგიები
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {allergies.map((item) => (
                    <Chip key={item} tone="danger">
                      <AlertTriangle className="mr-1.5 h-3 w-3" />
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>
            ) : null}

            {chronic.length > 0 ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  ქრონიკული მდგომარეობები
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {chronic.map((item) => (
                    <Chip key={item} tone="warning">
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </SectionCard>
    </>
  );
}
