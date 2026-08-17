"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { addButton, fieldLabel, textInput } from "@/components/dashboard/FormControls";
import { Chip, EmptyState, SectionCard } from "@/components/dashboard/history/ui";
import { useHistorySave } from "@/components/dashboard/history/useHistorySave";
import { formatDate, uid, type Pet } from "@/lib/dashboard";
import {
  LAB_METRIC_CATEGORY_LABELS,
  LAB_METRIC_DEFS,
  flaggedLabValues,
  labFlagStatus,
  sortLabMetricEntries,
  type LabMetricCategory,
} from "@/lib/pet-history/lab-metrics";
import type { LabMetricEntry, LabMetricKey } from "@/lib/pet-history/types";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const CATEGORIES: LabMetricCategory[] = ["cbc", "chemistry", "urinalysis"];

export function LabMetricsPanel({ pet }: { pet: Pet }) {
  const { save, saving, error } = useHistorySave(pet.id);
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [date, setDate] = useState(today());
  const [labName, setLabName] = useState("");
  const [note, setNote] = useState("");
  const [values, setValues] = useState<Partial<Record<LabMetricKey, string>>>({});

  const entries = useMemo(
    () => pet.history?.labMetrics ?? [],
    [pet.history?.labMetrics],
  );
  const sorted = useMemo(() => sortLabMetricEntries(entries), [entries]);
  const flagged = useMemo(() => flaggedLabValues(entries), [entries]);

  const setValue = (key: LabMetricKey, raw: string) => {
    setValues((prev) => ({ ...prev, [key]: raw }));
  };

  const resetForm = () => {
    setDate(today());
    setLabName("");
    setNote("");
    setValues({});
  };

  const submit = async () => {
    const parsedValues: Partial<Record<LabMetricKey, number>> = {};
    for (const def of LAB_METRIC_DEFS) {
      const raw = values[def.key];
      if (!raw || raw.trim() === "") continue;
      const num = Number(raw);
      if (!Number.isFinite(num)) continue;
      parsedValues[def.key] = Number(num.toFixed(def.decimals));
    }
    if (Object.keys(parsedValues).length === 0) return;

    const entry: LabMetricEntry = {
      id: uid("lab"),
      recordedAt: date,
      ...(labName.trim() ? { labName: labName.trim() } : {}),
      ...(note.trim() ? { note: note.trim() } : {}),
      values: parsedValues,
    };

    const ok = await save({ labMetrics: [...entries, entry] });
    if (ok) {
      resetForm();
      setOpen(false);
    }
  };

  const removeEntry = async (id: string) => {
    await save({ labMetrics: entries.filter((e) => e.id !== id) });
  };

  const filledCount = Object.values(values).filter(
    (v) => v && v.trim() !== "",
  ).length;

  return (
    <SectionCard
      id="lab-metrics"
      icon={FlaskConical}
      title="ლაბორატორიული მაჩვენებლები"
      description="შეიყვანე სისხლის/შარდის ანალიზის მაჩვენებლები, რომ დროში ტრენდი გამოჩნდეს."
      action={
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[var(--brand-primary)] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
        >
          <Plus className="h-3.5 w-3.5" /> შედეგის დამატება
        </button>
      }
    >
      {flagged.length > 0 ? (
        <div className="mb-5 flex flex-wrap gap-2">
          {flagged.map((item) => (
            <Chip
              key={item.key}
              tone={item.status === "high" ? "danger" : "warning"}
            >
              {item.def.label}: {item.value}
              {item.def.unit ? ` ${item.def.unit}` : ""}
              {item.status === "high" ? " ↑" : " ↓"}
            </Chip>
          ))}
        </div>
      ) : null}

      {sorted.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="ლაბორატორიული ჩანაწერები ჯერ არ არის"
          body="დაამატე პირველი ანალიზის შედეგები — ტრენდის საჩვენებლად საკმარისია ერთი მაჩვენებელიც."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {[...sorted].reverse().map((entry) => {
            const expanded = expandedId === entry.id;
            const count = Object.keys(entry.values).length;
            return (
              <li
                key={entry.id}
                className="rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--brand-primary)]">
                      {formatDate(entry.recordedAt)}
                      {entry.labName ? ` · ${entry.labName}` : ""}
                    </p>
                    <p className="text-xs text-slate-400">
                      {count} მაჩვენებელი
                      {entry.note ? `, ${entry.note}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : entry.id)}
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
                      onClick={() => void removeEntry(entry.id)}
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
                      <div className="mt-3 grid gap-2 border-t border-[#eceae5] pt-3 sm:grid-cols-2 lg:grid-cols-3">
                        {LAB_METRIC_DEFS.filter(
                          (def) => entry.values[def.key] !== undefined,
                        ).map((def) => {
                          const value = entry.values[def.key] as number;
                          const status = labFlagStatus(def.key, value);
                          return (
                            <div
                              key={def.key}
                              className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm"
                            >
                              <span className="text-slate-500">
                                {def.label}
                              </span>
                              <span
                                className={`font-semibold ${
                                  status === "normal"
                                    ? "text-[var(--brand-primary)]"
                                    : status === "high"
                                      ? "text-red-600"
                                      : "text-amber-600"
                                }`}
                              >
                                {value}
                                {def.unit ? ` ${def.unit}` : ""}
                              </span>
                            </div>
                          );
                        })}
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
                  <label className={fieldLabel} htmlFor="lab-date">
                    თარიღი
                  </label>
                  <input
                    id="lab-date"
                    type="date"
                    value={date}
                    max={today()}
                    onChange={(event) => setDate(event.target.value)}
                    className={`${textInput} mt-2`}
                  />
                </div>
                <div>
                  <label className={fieldLabel} htmlFor="lab-name">
                    ლაბორატორია (არასავალდებულო)
                  </label>
                  <input
                    id="lab-name"
                    value={labName}
                    onChange={(event) => setLabName(event.target.value)}
                    placeholder="მაგ. VetLab Tbilisi"
                    className={`${textInput} mt-2`}
                  />
                </div>
              </div>

              <p className="text-xs text-slate-400">
                შეავსე მხოლოდ ის მაჩვენებლები, რაც ანალიზში გაქვს — დანარჩენი
                ცარიელი დატოვე. მითითებული დიაპაზონი ზოგადია — ენდე შენი
                ლაბორატორიის ბლანკზე დაბეჭდილ ნორმებს.
              </p>

              {CATEGORIES.map((category) => (
                <div key={category}>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {LAB_METRIC_CATEGORY_LABELS[category]}
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {LAB_METRIC_DEFS.filter(
                      (def) => def.category === category,
                    ).map((def) => (
                      <div key={def.key}>
                        <label className={fieldLabel} htmlFor={`lab-${def.key}`}>
                          {def.label}
                          {def.unit ? ` (${def.unit})` : ""}
                        </label>
                        <input
                          id={`lab-${def.key}`}
                          type="number"
                          inputMode="decimal"
                          step={def.decimals === 0 ? 1 : Math.pow(10, -def.decimals)}
                          value={values[def.key] ?? ""}
                          onChange={(event) =>
                            setValue(def.key, event.target.value)
                          }
                          placeholder={`${def.normalMin}–${def.normalMax}`}
                          className={`${textInput} mt-2`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <label className={fieldLabel} htmlFor="lab-note">
                  შენიშვნა
                </label>
                <input
                  id="lab-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="მაგ. პროფილაქტიკური შემოწმება"
                  className={`${textInput} mt-2`}
                />
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                type="button"
                onClick={() => void submit()}
                disabled={saving || filledCount === 0}
                className={`${addButton} cursor-pointer disabled:opacity-60`}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BadgeCheck className="h-4 w-4" />
                )}
                ჩანაწერის შენახვა
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SectionCard>
  );
}
