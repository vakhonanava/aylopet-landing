"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Loader2,
  Minus,
  Plus,
  Scale,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { addButton, fieldLabel, textInput } from "@/components/dashboard/FormControls";
import { WeightTrendChart } from "@/components/dashboard/history/WeightTrendChart";
import {
  DataField,
  EmptyState,
  SectionCard,
} from "@/components/dashboard/history/ui";
import { useHistorySave } from "@/components/dashboard/history/useHistorySave";
import { formatDate, uid, type Pet } from "@/lib/dashboard";
import {
  estimateTargetRange,
  summariseWeight,
  weightAgainstTarget,
} from "@/lib/pet-history/calculations";
import { BCS_SCALE } from "@/lib/pet-history/labels";
import type { BcsScore, WeightLogEntry } from "@/lib/pet-history/types";

const TARGET_COPY: Record<string, { label: string; className: string }> = {
  below: {
    label: "სამიზნეზე დაბალი",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  within: {
    label: "სამიზნე დიაპაზონში",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  above: {
    label: "სამიზნეზე მაღალი",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  unknown: {
    label: "სამიზნე დაუყენებელი",
    className: "border-slate-200 bg-slate-50 text-slate-600",
  },
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function WeightBcsPanel({ pet }: { pet: Pet }) {
  const { save, saving, error } = useHistorySave(pet.id);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(today());
  const [weight, setWeight] = useState("");
  const [bcs, setBcs] = useState<BcsScore | undefined>(
    pet.bcsScore as BcsScore | undefined,
  );
  const [note, setNote] = useState("");

  const logs = useMemo(
    () => pet.history?.weightLogs ?? [],
    [pet.history?.weightLogs],
  );
  const summary = useMemo(() => summariseWeight(logs), [logs]);

  const latestWeight = summary.latest?.weightKg ?? pet.weightKg;
  const latestBcs = (summary.latest?.bcs ?? pet.bcsScore) as
    | BcsScore
    | undefined;

  // An explicit vet-set range wins; otherwise derive one from the latest BCS.
  const target =
    pet.history?.weightTarget ?? estimateTargetRange(latestWeight, latestBcs);
  const position = weightAgainstTarget(latestWeight, target);
  const targetTone = TARGET_COPY[position];

  const submit = async () => {
    const parsed = Number(weight);
    if (!Number.isFinite(parsed) || parsed <= 0) return;

    const entry: WeightLogEntry = {
      id: uid("wl"),
      recordedAt: date,
      weightKg: Number(parsed.toFixed(2)),
      ...(bcs ? { bcs } : {}),
      ...(note.trim() ? { note: note.trim() } : {}),
    };

    const ok = await save({ weightLogs: [...logs, entry] });
    if (ok) {
      setWeight("");
      setNote("");
      setOpen(false);
    }
  };

  const removeEntry = async (id: string) => {
    await save({ weightLogs: logs.filter((entry) => entry.id !== id) });
  };

  const TrendIcon =
    summary.trend === "up"
      ? TrendingUp
      : summary.trend === "down"
        ? TrendingDown
        : Minus;

  return (
    <SectionCard
      id="weight"
      icon={Scale}
      title="წონა და სხეულის კონდიცია"
      description="აწარმოე წონის ჟურნალი და თვალი ადევნე დინამიკას."
      action={
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[var(--brand-primary)] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
        >
          <Plus className="h-3.5 w-3.5" /> წონის დამატება
        </button>
      }
    >
      <dl className="grid gap-3 sm:grid-cols-3">
        <DataField
          label="მიმდინარე წონა"
          value={`${latestWeight} კგ`}
          hint={
            summary.latest
              ? `ბოლო ჩანაწერი ${formatDate(summary.latest.recordedAt)}`
              : "პროფილის მონაცემი"
          }
        />
        <DataField
          label="ცვლილება"
          value={
            summary.deltaKg === null ? (
              "—"
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <TrendIcon className="h-4 w-4" />
                {summary.deltaKg > 0 ? "+" : ""}
                {summary.deltaKg} კგ
              </span>
            )
          }
          hint={
            summary.deltaPercent === null
              ? "საჭიროა ორი ჩანაწერი"
              : `${summary.deltaPercent > 0 ? "+" : ""}${summary.deltaPercent.toFixed(1)}% წინა აწონვასთან`
          }
        />
        <DataField
          label="BCS"
          value={latestBcs ? `${latestBcs} / 9` : "—"}
          hint={
            latestBcs
              ? BCS_SCALE.find((item) => item.score === latestBcs)?.label
              : undefined
          }
        />
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${targetTone.className}`}
        >
          <Target className="h-3.5 w-3.5" />
          {targetTone.label}
        </span>
        {target ? (
          <span className="text-xs text-slate-400">
            {target.minKg}–{target.maxKg} კგ
            {pet.history?.weightTarget ? "" : ", შეფასებულია BCS-ის მიხედვით"}
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        {summary.sorted.length > 0 ? (
          <WeightTrendChart entries={summary.sorted} target={target} />
        ) : (
          <EmptyState
            icon={Scale}
            title="წონის ჩანაწერები ჯერ არ არის"
            body="დაამატე პირველი აწონვა, რომ გრაფიკმა დინამიკის ჩვენება დაიწყოს."
          />
        )}
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5 space-y-4 rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={fieldLabel} htmlFor="weight-date">
                    თარიღი
                  </label>
                  <input
                    id="weight-date"
                    type="date"
                    value={date}
                    max={today()}
                    onChange={(event) => setDate(event.target.value)}
                    className={`${textInput} mt-2`}
                  />
                </div>
                <div>
                  <label className={fieldLabel} htmlFor="weight-value">
                    წონა (კგ)
                  </label>
                  <input
                    id="weight-value"
                    type="number"
                    min="0.1"
                    step="0.1"
                    inputMode="decimal"
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                    placeholder="28.4"
                    className={`${textInput} mt-2`}
                  />
                </div>
              </div>

              <div>
                <span className={fieldLabel}>სხეულის კონდიცია (BCS 1–9)</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {BCS_SCALE.map((item) => (
                    <button
                      key={item.score}
                      type="button"
                      title={item.label}
                      onClick={() => setBcs(item.score as BcsScore)}
                      className={`h-10 w-10 cursor-pointer rounded-xl border text-sm font-semibold transition-colors ${
                        bcs === item.score
                          ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                          : "border-[#e5e7eb] bg-white text-slate-500 hover:border-[var(--brand-primary)]/30"
                      }`}
                    >
                      {item.score}
                    </button>
                  ))}
                </div>
                {bcs ? (
                  <p className="mt-2 text-xs text-slate-400">
                    {BCS_SCALE.find((item) => item.score === bcs)?.label}
                  </p>
                ) : null}
              </div>

              <div>
                <label className={fieldLabel} htmlFor="weight-note">
                  შენიშვნა
                </label>
                <input
                  id="weight-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="მაგ. აწონვა კლინიკაში"
                  className={`${textInput} mt-2`}
                />
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                type="button"
                onClick={() => void submit()}
                disabled={saving || weight.trim().length === 0}
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

      {summary.sorted.length > 0 ? (
        <ul className="mt-5 divide-y divide-[#f0eeea] rounded-2xl border border-[#e5e7eb]">
          {[...summary.sorted].reverse().slice(0, 6).map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--brand-primary)]">
                  {entry.weightKg} კგ
                  {entry.bcs ? (
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      BCS {entry.bcs}/9
                    </span>
                  ) : null}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {formatDate(entry.recordedAt)}
                  {entry.note ? `, ${entry.note}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void removeEntry(entry.id)}
                aria-label="ჩანაწერის წაშლა"
                className="cursor-pointer rounded-lg p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </SectionCard>
  );
}
