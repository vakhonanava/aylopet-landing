"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Stethoscope,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { addButton, fieldLabel, textInput } from "@/components/dashboard/FormControls";
import { EmptyState, SectionCard, StatusPill } from "@/components/dashboard/history/ui";
import { useHistorySave } from "@/components/dashboard/history/useHistorySave";
import { formatDate, uid, type Pet } from "@/lib/dashboard";
import {
  VET_VISIT_OUTCOME,
  VET_VISIT_REASON_LABELS,
  pendingFollowUps,
  sortVetVisits,
} from "@/lib/pet-history/vet-visits";
import type {
  VetVisitEntry,
  VetVisitOutcome,
  VetVisitReason,
} from "@/lib/pet-history/types";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const REASON_OPTIONS: VetVisitReason[] = [
  "checkup",
  "vaccination",
  "illness",
  "injury",
  "surgery",
  "follow_up",
  "other",
];

const OUTCOME_OPTIONS: VetVisitOutcome[] = [
  "resolved",
  "ongoing",
  "follow_up_needed",
];

export function VetVisitsPanel({ pet }: { pet: Pet }) {
  const { save, saving, error } = useHistorySave(pet.id);
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [visitedAt, setVisitedAt] = useState(today());
  const [reason, setReason] = useState<VetVisitReason>("checkup");
  const [clinicName, setClinicName] = useState("");
  const [vetName, setVetName] = useState("");
  const [complaint, setComplaint] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [outcome, setOutcome] = useState<VetVisitOutcome>("resolved");
  const [followUpDate, setFollowUpDate] = useState("");
  const [cost, setCost] = useState("");
  const [note, setNote] = useState("");

  const entries = useMemo(
    () => pet.history?.vetVisits ?? [],
    [pet.history?.vetVisits],
  );
  const sorted = useMemo(() => sortVetVisits(entries), [entries]);
  const pending = useMemo(() => pendingFollowUps(entries), [entries]);

  const resetForm = () => {
    setVisitedAt(today());
    setReason("checkup");
    setClinicName("");
    setVetName("");
    setComplaint("");
    setDiagnosis("");
    setTreatment("");
    setOutcome("resolved");
    setFollowUpDate("");
    setCost("");
    setNote("");
  };

  const submit = async () => {
    const entry: VetVisitEntry = {
      id: uid("visit"),
      visitedAt,
      reason,
      outcome,
      ...(clinicName.trim() ? { clinicName: clinicName.trim() } : {}),
      ...(vetName.trim() ? { vetName: vetName.trim() } : {}),
      ...(complaint.trim() ? { complaint: complaint.trim() } : {}),
      ...(diagnosis.trim() ? { diagnosis: diagnosis.trim() } : {}),
      ...(treatment.trim() ? { treatment: treatment.trim() } : {}),
      ...(outcome === "follow_up_needed" && followUpDate
        ? { followUpDate }
        : {}),
      ...(cost.trim() ? { costAmount: Number(cost) } : {}),
      ...(note.trim() ? { note: note.trim() } : {}),
    };

    const ok = await save({ vetVisits: [...entries, entry] });
    if (ok) {
      resetForm();
      setOpen(false);
    }
  };

  const removeEntry = async (id: string) => {
    await save({ vetVisits: entries.filter((e) => e.id !== id) });
  };

  return (
    <SectionCard
      id="vet-visits"
      icon={Stethoscope}
      title="ვეტერინარის ვიზიტები"
      description="რატომ იყავით, რა დაუდგინეს და რა შედეგი მოჰყვა — ეს ისტორია ლაბ-მაჩვენებლებსა და სიმპტომებს აზუსტებს."
      action={
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[var(--brand-primary)] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
        >
          <Plus className="h-3.5 w-3.5" /> ვიზიტის დამატება
        </button>
      }
    >
      {pending.length > 0 ? (
        <div className="mb-5 flex flex-wrap gap-2">
          {pending.map((visit) => (
            <span
              key={visit.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
            >
              <CalendarClock className="h-3.5 w-3.5" />
              საკონტროლო ვიზიტი
              {visit.followUpDate ? `, ${formatDate(visit.followUpDate)}` : ""}
            </span>
          ))}
        </div>
      ) : null}

      {sorted.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="ვიზიტები ჯერ არ არის ჩაწერილი"
          body="დაამატე ბოლო ვეტ-ვიზიტი — მიზეზი, დიაგნოზი და შედეგი, რომ ისტორია ერთ ადგილას გქონდეს."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {[...sorted].reverse().map((visit) => {
            const expanded = expandedId === visit.id;
            return (
              <li
                key={visit.id}
                className="rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--brand-primary)]">
                      {formatDate(visit.visitedAt)} ·{" "}
                      {VET_VISIT_REASON_LABELS[visit.reason]}
                    </p>
                    <p className="text-xs text-slate-400">
                      {[visit.clinicName, visit.vetName]
                        .filter(Boolean)
                        .join(", ") || "კლინიკა მითითებული არ არის"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill tone={VET_VISIT_OUTCOME[visit.outcome]} />
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : visit.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-primary)]"
                    >
                      {expanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                      დეტალები
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeEntry(visit.id)}
                      aria-label="ჩანაწერის წაშლა"
                      className="cursor-pointer rounded-lg p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {expanded ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-2 border-t border-[#eceae5] pt-3 text-sm">
                        {visit.complaint ? (
                          <p>
                            <span className="font-medium text-[var(--brand-primary)]">
                              საჩივარი:
                            </span>{" "}
                            <span className="text-slate-600">
                              {visit.complaint}
                            </span>
                          </p>
                        ) : null}
                        {visit.diagnosis ? (
                          <p>
                            <span className="font-medium text-[var(--brand-primary)]">
                              დიაგნოზი:
                            </span>{" "}
                            <span className="text-slate-600">
                              {visit.diagnosis}
                            </span>
                          </p>
                        ) : null}
                        {visit.treatment ? (
                          <p>
                            <span className="font-medium text-[var(--brand-primary)]">
                              მკურნალობა:
                            </span>{" "}
                            <span className="text-slate-600">
                              {visit.treatment}
                            </span>
                          </p>
                        ) : null}
                        {visit.costAmount !== undefined ? (
                          <p>
                            <span className="font-medium text-[var(--brand-primary)]">
                              ღირებულება:
                            </span>{" "}
                            <span className="text-slate-600">
                              {visit.costAmount} ₾
                            </span>
                          </p>
                        ) : null}
                        {visit.note ? (
                          <p>
                            <span className="font-medium text-[var(--brand-primary)]">
                              შენიშვნა:
                            </span>{" "}
                            <span className="text-slate-600">{visit.note}</span>
                          </p>
                        ) : null}
                        {!visit.complaint &&
                        !visit.diagnosis &&
                        !visit.treatment &&
                        !visit.note ? (
                          <p className="text-slate-400">
                            დამატებითი დეტალები არ არის.
                          </p>
                        ) : null}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      )}

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5 space-y-5 rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={fieldLabel} htmlFor="visit-date">
                    ვიზიტის თარიღი
                  </label>
                  <input
                    id="visit-date"
                    type="date"
                    value={visitedAt}
                    max={today()}
                    onChange={(event) => setVisitedAt(event.target.value)}
                    className={`${textInput} mt-2`}
                  />
                </div>
                <div>
                  <label className={fieldLabel} htmlFor="visit-clinic">
                    კლინიკა (არასავალდებულო)
                  </label>
                  <input
                    id="visit-clinic"
                    value={clinicName}
                    onChange={(event) => setClinicName(event.target.value)}
                    placeholder="მაგ. VetClinic Tbilisi"
                    className={`${textInput} mt-2`}
                  />
                </div>
              </div>

              <div>
                <label className={fieldLabel} htmlFor="visit-vet">
                  ვეტერინარის სახელი (არასავალდებულო)
                </label>
                <input
                  id="visit-vet"
                  value={vetName}
                  onChange={(event) => setVetName(event.target.value)}
                  placeholder="დოქტორის სახელი"
                  className={`${textInput} mt-2 max-w-sm`}
                />
              </div>

              <div>
                <span className={fieldLabel}>ვიზიტის მიზეზი</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {REASON_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setReason(option)}
                      className={`cursor-pointer rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                        reason === option
                          ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                          : "border-[#e5e7eb] bg-white text-slate-500 hover:border-[var(--brand-primary)]/30"
                      }`}
                    >
                      {VET_VISIT_REASON_LABELS[option]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={fieldLabel} htmlFor="visit-complaint">
                  საჩივარი / რატომ მიხვედით
                </label>
                <textarea
                  id="visit-complaint"
                  value={complaint}
                  onChange={(event) => setComplaint(event.target.value)}
                  placeholder="მაგ. ღებინება ორი დღეა"
                  className={`${textInput} mt-2 min-h-16 resize-none`}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={fieldLabel} htmlFor="visit-diagnosis">
                    დიაგნოზი
                  </label>
                  <textarea
                    id="visit-diagnosis"
                    value={diagnosis}
                    onChange={(event) => setDiagnosis(event.target.value)}
                    placeholder="ვეტის დასკვნა"
                    className={`${textInput} mt-2 min-h-16 resize-none`}
                  />
                </div>
                <div>
                  <label className={fieldLabel} htmlFor="visit-treatment">
                    მკურნალობა / დანიშნულება
                  </label>
                  <textarea
                    id="visit-treatment"
                    value={treatment}
                    onChange={(event) => setTreatment(event.target.value)}
                    placeholder="მედიკამენტები, პროცედურები"
                    className={`${textInput} mt-2 min-h-16 resize-none`}
                  />
                </div>
              </div>

              <div>
                <span className={fieldLabel}>შედეგი</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {OUTCOME_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setOutcome(option)}
                      className={`cursor-pointer rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                        outcome === option
                          ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                          : "border-[#e5e7eb] bg-white text-slate-500 hover:border-[var(--brand-primary)]/30"
                      }`}
                    >
                      {VET_VISIT_OUTCOME[option].label}
                    </button>
                  ))}
                </div>
              </div>

              {outcome === "follow_up_needed" ? (
                <div>
                  <label className={fieldLabel} htmlFor="visit-followup">
                    საკონტროლო ვიზიტის თარიღი
                  </label>
                  <input
                    id="visit-followup"
                    type="date"
                    value={followUpDate}
                    onChange={(event) => setFollowUpDate(event.target.value)}
                    className={`${textInput} mt-2 max-w-[12rem]`}
                  />
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={fieldLabel} htmlFor="visit-cost">
                    ღირებულება (₾, არასავალდებულო)
                  </label>
                  <input
                    id="visit-cost"
                    type="number"
                    min="0"
                    inputMode="decimal"
                    value={cost}
                    onChange={(event) => setCost(event.target.value)}
                    placeholder="მაგ. 150"
                    className={`${textInput} mt-2`}
                  />
                </div>
                <div>
                  <label className={fieldLabel} htmlFor="visit-note">
                    შენიშვნა
                  </label>
                  <input
                    id="visit-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="დამატებითი ინფორმაცია"
                    className={`${textInput} mt-2`}
                  />
                </div>
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                type="button"
                onClick={() => void submit()}
                disabled={saving}
                className={`${addButton} cursor-pointer disabled:opacity-60`}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BadgeCheck className="h-4 w-4" />
                )}
                ვიზიტის შენახვა
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SectionCard>
  );
}
