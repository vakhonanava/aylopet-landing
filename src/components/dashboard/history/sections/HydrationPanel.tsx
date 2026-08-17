"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Droplets,
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
  STOOL_CONSISTENCY_LABELS,
  WATER_CHANGE_LABELS,
  hydrationEntryFlags,
  latestHydrationFlags,
  sortHydrationEntries,
} from "@/lib/pet-history/hydration";
import type {
  HydrationLogEntry,
  StoolConsistency,
  WaterChange,
} from "@/lib/pet-history/types";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const WATER_CHANGE_OPTIONS: WaterChange[] = ["decreased", "normal", "increased"];
const STOOL_OPTIONS: StoolConsistency[] = ["hard", "normal", "soft", "diarrhea"];

export function HydrationPanel({ pet }: { pet: Pet }) {
  const { save, saving, error } = useHistorySave(pet.id);
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [date, setDate] = useState(today());
  const [waterChange, setWaterChange] = useState<WaterChange | undefined>();
  const [waterMl, setWaterMl] = useState("");
  const [urinationCount, setUrinationCount] = useState("");
  const [urinationBlood, setUrinationBlood] = useState(false);
  const [urinationStraining, setUrinationStraining] = useState(false);
  const [stoolCount, setStoolCount] = useState("");
  const [stoolConsistency, setStoolConsistency] = useState<
    StoolConsistency | undefined
  >();
  const [stoolBlood, setStoolBlood] = useState(false);
  const [note, setNote] = useState("");

  const entries = useMemo(
    () => pet.history?.hydrationLogs ?? [],
    [pet.history?.hydrationLogs],
  );
  const sorted = useMemo(() => sortHydrationEntries(entries), [entries]);
  const flags = useMemo(() => latestHydrationFlags(entries), [entries]);

  const resetForm = () => {
    setDate(today());
    setWaterChange(undefined);
    setWaterMl("");
    setUrinationCount("");
    setUrinationBlood(false);
    setUrinationStraining(false);
    setStoolCount("");
    setStoolConsistency(undefined);
    setStoolBlood(false);
    setNote("");
  };

  const hasAnyValue =
    waterChange !== undefined ||
    waterMl.trim() !== "" ||
    urinationCount.trim() !== "" ||
    urinationBlood ||
    urinationStraining ||
    stoolCount.trim() !== "" ||
    stoolConsistency !== undefined ||
    stoolBlood;

  const submit = async () => {
    if (!hasAnyValue) return;

    const entry: HydrationLogEntry = {
      id: uid("hyd"),
      recordedAt: date,
      ...(waterChange ? { waterChange } : {}),
      ...(waterMl.trim() ? { waterMl: Number(waterMl) } : {}),
      ...(urinationCount.trim()
        ? { urinationCount: Number(urinationCount) }
        : {}),
      ...(urinationBlood ? { urinationBlood: true } : {}),
      ...(urinationStraining ? { urinationStraining: true } : {}),
      ...(stoolCount.trim() ? { stoolCount: Number(stoolCount) } : {}),
      ...(stoolConsistency ? { stoolConsistency } : {}),
      ...(stoolBlood ? { stoolBlood: true } : {}),
      ...(note.trim() ? { note: note.trim() } : {}),
    };

    const ok = await save({ hydrationLogs: [...entries, entry] });
    if (ok) {
      resetForm();
      setOpen(false);
    }
  };

  const removeEntry = async (id: string) => {
    await save({ hydrationLogs: entries.filter((e) => e.id !== id) });
  };

  return (
    <SectionCard
      id="hydration"
      icon={Droplets}
      title="წყალი და შარდვა/განავალი"
      description="ადრეული სიგნალები, რომლებსაც ვეტ-ვიზიტამდე ვერავინ შენს გარდა ვერ ამჩნევს."
      action={
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[var(--brand-primary)] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
        >
          <Plus className="h-3.5 w-3.5" /> ჩანაწერის დამატება
        </button>
      }
    >
      {flags.length > 0 ? (
        <div className="mb-5 flex flex-wrap gap-2">
          {flags.map((flag) => (
            <Chip
              key={flag.label}
              tone={flag.severity === "danger" ? "danger" : "warning"}
            >
              {flag.label}
            </Chip>
          ))}
        </div>
      ) : null}

      {sorted.length === 0 ? (
        <EmptyState
          icon={Droplets}
          title="ჩანაწერები ჯერ არ არის"
          body="დაამატე დღევანდელი დაკვირვება — წყლის მოხმარება, შარდვისა და განავლის სიხშირე თუ ხასიათი."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {[...sorted].reverse().map((entry) => {
            const expanded = expandedId === entry.id;
            const entryFlags = hydrationEntryFlags(entry);
            return (
              <li
                key={entry.id}
                className="rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--brand-primary)]">
                      {formatDate(entry.recordedAt)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {entryFlags.length > 0
                        ? entryFlags.map((f) => f.label).join(", ")
                        : "თავისებურებების გარეშე"}
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
                      <div className="mt-3 grid gap-2 border-t border-[#eceae5] pt-3 sm:grid-cols-2 lg:grid-cols-3 [&>*]:rounded-xl [&>*]:bg-white [&>*]:px-3 [&>*]:py-2 [&>*]:text-sm">
                        {entry.waterChange ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500">წყალი</span>
                            <span className="font-semibold text-[var(--brand-primary)]">
                              {WATER_CHANGE_LABELS[entry.waterChange]}
                            </span>
                          </div>
                        ) : null}
                        {entry.waterMl !== undefined ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500">წყალი (მლ)</span>
                            <span className="font-semibold text-[var(--brand-primary)]">
                              {entry.waterMl} მლ
                            </span>
                          </div>
                        ) : null}
                        {entry.urinationCount !== undefined ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500">შარდვა, დღეში</span>
                            <span className="font-semibold text-[var(--brand-primary)]">
                              {entry.urinationCount}
                            </span>
                          </div>
                        ) : null}
                        {entry.stoolCount !== undefined ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500">განავალი, დღეში</span>
                            <span className="font-semibold text-[var(--brand-primary)]">
                              {entry.stoolCount}
                            </span>
                          </div>
                        ) : null}
                        {entry.stoolConsistency ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500">კონსისტენცია</span>
                            <span className="font-semibold text-[var(--brand-primary)]">
                              {STOOL_CONSISTENCY_LABELS[entry.stoolConsistency]}
                            </span>
                          </div>
                        ) : null}
                      </div>
                      {entry.note ? (
                        <p className="mt-2 text-xs text-slate-400">
                          {entry.note}
                        </p>
                      ) : null}
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
              <div>
                <label className={fieldLabel} htmlFor="hyd-date">
                  თარიღი
                </label>
                <input
                  id="hyd-date"
                  type="date"
                  value={date}
                  max={today()}
                  onChange={(event) => setDate(event.target.value)}
                  className={`${textInput} mt-2 max-w-[12rem]`}
                />
              </div>

              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  წყლის მოხმარება
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <span className={fieldLabel}>ცვლილება, ჩვეულებრივთან შედარებით</span>
                    <div className="mt-2 flex gap-2">
                      {WATER_CHANGE_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setWaterChange(
                              waterChange === option ? undefined : option,
                            )
                          }
                          className={`flex-1 cursor-pointer rounded-2xl border px-3 py-2.5 text-xs font-medium transition-colors ${
                            waterChange === option
                              ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                              : "border-[#e5e7eb] bg-white text-slate-500 hover:border-[var(--brand-primary)]/30"
                          }`}
                        >
                          {WATER_CHANGE_LABELS[option]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={fieldLabel} htmlFor="hyd-water-ml">
                      მოცულობა (მლ, არასავალდებულო)
                    </label>
                    <input
                      id="hyd-water-ml"
                      type="number"
                      min="0"
                      inputMode="numeric"
                      value={waterMl}
                      onChange={(event) => setWaterMl(event.target.value)}
                      placeholder="მაგ. 700"
                      className={`${textInput} mt-2`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  შარდვა
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabel} htmlFor="hyd-urination-count">
                      სიხშირე, დღეში
                    </label>
                    <input
                      id="hyd-urination-count"
                      type="number"
                      min="0"
                      inputMode="numeric"
                      value={urinationCount}
                      onChange={(event) => setUrinationCount(event.target.value)}
                      placeholder="მაგ. 4"
                      className={`${textInput} mt-2`}
                    />
                  </div>
                  <div className="flex flex-col justify-end gap-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={urinationBlood}
                        onChange={(event) =>
                          setUrinationBlood(event.target.checked)
                        }
                        className="h-4 w-4 rounded border-[#e5e7eb] text-[var(--brand-primary)]"
                      />
                      სისხლი შარდში
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={urinationStraining}
                        onChange={(event) =>
                          setUrinationStraining(event.target.checked)
                        }
                        className="h-4 w-4 rounded border-[#e5e7eb] text-[var(--brand-primary)]"
                      />
                      გაძნელებული შარდვა
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  განავალი
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabel} htmlFor="hyd-stool-count">
                      სიხშირე, დღეში
                    </label>
                    <input
                      id="hyd-stool-count"
                      type="number"
                      min="0"
                      inputMode="numeric"
                      value={stoolCount}
                      onChange={(event) => setStoolCount(event.target.value)}
                      placeholder="მაგ. 2"
                      className={`${textInput} mt-2`}
                    />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 self-end pb-2.5 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={stoolBlood}
                      onChange={(event) => setStoolBlood(event.target.checked)}
                      className="h-4 w-4 rounded border-[#e5e7eb] text-[var(--brand-primary)]"
                    />
                    სისხლი განავალში
                  </label>
                </div>
                <div className="mt-3">
                  <span className={fieldLabel}>კონსისტენცია</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {STOOL_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setStoolConsistency(
                            stoolConsistency === option ? undefined : option,
                          )
                        }
                        className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                          stoolConsistency === option
                            ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                            : "border-[#e5e7eb] bg-white text-slate-500 hover:border-[var(--brand-primary)]/30"
                        }`}
                      >
                        {STOOL_CONSISTENCY_LABELS[option]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className={fieldLabel} htmlFor="hyd-note">
                  შენიშვნა
                </label>
                <input
                  id="hyd-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="დამატებითი დაკვირვება"
                  className={`${textInput} mt-2`}
                />
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                type="button"
                onClick={() => void submit()}
                disabled={saving || !hasAnyValue}
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
