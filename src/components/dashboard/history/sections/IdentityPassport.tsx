"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Dog,
  IdCard,
  Loader2,
  Minus,
  Pencil,
  Plus,
  Scale,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { addButton, fieldLabel, textInput } from "@/components/dashboard/FormControls";
import { ImageLightbox } from "@/components/dashboard/ImageLightbox";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { WeightTrendChart } from "@/components/dashboard/history/WeightTrendChart";
import { DataField, EmptyState, SectionCard } from "@/components/dashboard/history/ui";
import { useHistorySave } from "@/components/dashboard/history/useHistorySave";
import { formatDate, uid, type Pet } from "@/lib/dashboard";
import {
  calculateAge,
  estimateTargetRange,
  summariseWeight,
  weightAgainstTarget,
} from "@/lib/pet-history/calculations";
import { BCS_SCALE, NEUTER_LABELS, SEX_LABELS } from "@/lib/pet-history/labels";
import type {
  BcsScore,
  NeuterStatus,
  ReproductiveStatus,
  Sex,
  WeightLogEntry,
} from "@/lib/pet-history/types";

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

/** A DataField that opens its own editor in place when clicked, instead of a separate panel. */
function ClickableField({
  label,
  value,
  hint,
  active,
  onClick,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl px-4 py-3 text-left transition-colors ${
        active
          ? "bg-[var(--brand-primary)]/[0.08] ring-1 ring-[var(--brand-primary)]/30"
          : "bg-[#FAFAF8] hover:bg-[var(--brand-primary)]/[0.05]"
      }`}
    >
      <dt className="flex items-center justify-between gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
        <Pencil className="h-3 w-3 shrink-0 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
      </dt>
      <dd className="mt-1 text-sm font-semibold text-[var(--brand-primary)]">
        {value}
      </dd>
      {hint ? <p className="mt-0.5 text-xs text-slate-400">{hint}</p> : null}
    </button>
  );
}

/** Mirrors `SectionCard`'s header, for a second header nested inside one card. */
function SubsectionHeader({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof Scale;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-primary)]/[0.07] text-[var(--brand-primary)]">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-bold tracking-tight text-[var(--brand-primary)]">
            {title}
          </h3>
          {description ? (
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  );
}

export function IdentityPassport({ pet }: { pet: Pet }) {
  const { updatePetIdentity } = useDashboard();
  const [zoomOpen, setZoomOpen] = useState(false);
  const [editingField, setEditingField] = useState<
    "birthDate" | "reproductive" | null
  >(null);

  const reproductive = pet.history?.reproductive ?? null;
  const age = calculateAge(pet.birthDate);

  // Birth date · saved via the flat `pets.birth_date` column, so bcsScore and
  // microchipId are passed through untouched rather than cleared.
  const [birthDateInput, setBirthDateInput] = useState(pet.birthDate ?? "");
  const [savingBirthDate, setSavingBirthDate] = useState(false);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);

  const openBirthDateEditor = () => {
    setBirthDateInput(pet.birthDate ?? "");
    setBirthDateError(null);
    setEditingField("birthDate");
  };

  const submitBirthDate = async () => {
    setSavingBirthDate(true);
    setBirthDateError(null);
    const result = await updatePetIdentity(pet.id, {
      birthDate: birthDateInput || null,
      bcsScore: pet.bcsScore ?? null,
      microchipId: pet.microchipId ?? null,
    });
    setSavingBirthDate(false);
    if (!result.ok) {
      setBirthDateError(result.error ?? "შენახვა ვერ მოხერხდა.");
      return;
    }
    setEditingField(null);
  };

  // Reproductive status · saved via `pet.history` (sex + castration + procedure date).
  const {
    save: saveReproductive,
    saving: savingReproductive,
    error: reproductiveError,
  } = useHistorySave(pet.id);
  const [sex, setSex] = useState<Sex>(reproductive?.sex ?? "male");
  const [status, setStatus] = useState<NeuterStatus>(
    reproductive?.status ?? "intact",
  );
  const [procedureDate, setProcedureDate] = useState(
    reproductive?.procedureDate ?? "",
  );

  const openReproductiveEditor = () => {
    setSex(reproductive?.sex ?? "male");
    setStatus(reproductive?.status ?? "intact");
    setProcedureDate(reproductive?.procedureDate ?? "");
    setEditingField("reproductive");
  };

  const submitReproductive = async () => {
    const next: ReproductiveStatus = {
      sex,
      status,
      // A procedure date is meaningless on an intact animal — drop it rather
      // than persist a value the UI would never show.
      ...(status === "neutered" && procedureDate
        ? { procedureDate }
        : {}),
    };
    if (await saveReproductive({ reproductive: next })) setEditingField(null);
  };

  // Weight & BCS log — same section as the passport now, not a separate card.
  const {
    save: saveWeight,
    saving: savingWeight,
    error: weightError,
  } = useHistorySave(pet.id);
  const [weightFormOpen, setWeightFormOpen] = useState(false);
  const [weightDate, setWeightDate] = useState(today());
  const [weightValue, setWeightValue] = useState("");
  const [weightBcs, setWeightBcs] = useState<BcsScore | undefined>(
    pet.bcsScore as BcsScore | undefined,
  );
  const [weightNote, setWeightNote] = useState("");

  const logs = useMemo(
    () => pet.history?.weightLogs ?? [],
    [pet.history?.weightLogs],
  );
  const weightSummary = useMemo(() => summariseWeight(logs), [logs]);

  const latestWeight = weightSummary.latest?.weightKg ?? pet.weightKg;
  const latestBcs = (weightSummary.latest?.bcs ?? pet.bcsScore) as
    | BcsScore
    | undefined;

  // An explicit vet-set range wins; otherwise derive one from the latest BCS.
  const weightTarget =
    pet.history?.weightTarget ?? estimateTargetRange(latestWeight, latestBcs);
  const targetPosition = weightAgainstTarget(latestWeight, weightTarget);
  const targetTone = TARGET_COPY[targetPosition];

  const submitWeight = async () => {
    const parsed = Number(weightValue);
    if (!Number.isFinite(parsed) || parsed <= 0) return;

    const entry: WeightLogEntry = {
      id: uid("wl"),
      recordedAt: weightDate,
      weightKg: Number(parsed.toFixed(2)),
      ...(weightBcs ? { bcs: weightBcs } : {}),
      ...(weightNote.trim() ? { note: weightNote.trim() } : {}),
    };

    const ok = await saveWeight({ weightLogs: [...logs, entry] });
    if (ok) {
      setWeightValue("");
      setWeightNote("");
      setWeightFormOpen(false);
    }
  };

  const removeWeightEntry = async (id: string) => {
    await saveWeight({ weightLogs: logs.filter((entry) => entry.id !== id) });
  };

  const WeightTrendIcon =
    weightSummary.trend === "up"
      ? TrendingUp
      : weightSummary.trend === "down"
        ? TrendingDown
        : Minus;

  return (
    <SectionCard
      id="passport"
      icon={IdCard}
      title="პასპორტი და იდენტიფიკაცია"
      description="ძაღლის ძირითადი ბიოლოგიური მონაცემები."
    >
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-[var(--brand-primary)]/[0.06] to-transparent px-5 py-4">
        {pet.avatarUrl ? (
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            aria-label={`${pet.name} ფოტოს გადიდება`}
            className="flex h-14 w-14 shrink-0 cursor-zoom-in items-center justify-center overflow-hidden rounded-full bg-white shadow-sm transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pet.avatarUrl}
              alt={pet.name}
              className="h-full w-full object-cover"
            />
          </button>
        ) : (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-slate-400 shadow-sm">
            <Dog className="h-6 w-6" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-xl font-bold tracking-tight text-[var(--brand-primary)]">
            {pet.name}
          </p>
          <p className="truncate text-sm text-slate-500">{pet.breed}</p>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ClickableField
          label="დაბადების თარიღი"
          value={pet.birthDate ? formatDate(pet.birthDate) : "დაამატე"}
          hint={age?.label}
          active={editingField === "birthDate"}
          onClick={
            editingField === "birthDate"
              ? () => setEditingField(null)
              : openBirthDateEditor
          }
        />

        <AnimatePresence initial={false}>
          {editingField === "birthDate" ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden sm:col-span-2 lg:col-span-3"
            >
              <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-4">
                <div className="min-w-[10rem] flex-1">
                  <label className={fieldLabel} htmlFor="birth-date">
                    დაბადების თარიღი
                  </label>
                  <input
                    id="birth-date"
                    type="date"
                    value={birthDateInput}
                    max={today()}
                    onChange={(event) => setBirthDateInput(event.target.value)}
                    className={`${textInput} mt-2`}
                  />
                </div>
                {birthDateError ? (
                  <p className="w-full text-sm text-red-600">{birthDateError}</p>
                ) : null}
                <button
                  type="button"
                  onClick={() => void submitBirthDate()}
                  disabled={savingBirthDate}
                  className={`${addButton} cursor-pointer disabled:opacity-60`}
                >
                  {savingBirthDate ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <BadgeCheck className="h-4 w-4" />
                  )}
                  შენახვა
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <ClickableField
          label="სქესი"
          value={reproductive ? SEX_LABELS[reproductive.sex] : "დაამატე"}
          active={editingField === "reproductive"}
          onClick={
            editingField === "reproductive"
              ? () => setEditingField(null)
              : openReproductiveEditor
          }
        />
        <ClickableField
          label="კასტრაცია / სტერილიზაცია"
          value={reproductive ? NEUTER_LABELS[reproductive.status] : "დაამატე"}
          hint={
            reproductive?.procedureDate
              ? `ჩატარდა ${formatDate(reproductive.procedureDate)}`
              : undefined
          }
          active={editingField === "reproductive"}
          onClick={
            editingField === "reproductive"
              ? () => setEditingField(null)
              : openReproductiveEditor
          }
        />

        <AnimatePresence initial={false}>
          {editingField === "reproductive" ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden sm:col-span-2 lg:col-span-3"
            >
              <div className="space-y-4 rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <span className={fieldLabel}>სქესი</span>
                    <div className="mt-2 flex gap-2">
                      {(["male", "female"] as Sex[]).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSex(option)}
                          className={`flex-1 cursor-pointer rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                            sex === option
                              ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                              : "border-[#e5e7eb] bg-white text-slate-500 hover:border-[var(--brand-primary)]/30"
                          }`}
                        >
                          {SEX_LABELS[option]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className={fieldLabel}>რეპროდუქციული სტატუსი</span>
                    <div className="mt-2 flex gap-2">
                      {(["intact", "neutered"] as NeuterStatus[]).map(
                        (option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setStatus(option)}
                            className={`flex-1 cursor-pointer rounded-2xl border px-4 py-2.5 text-xs font-medium transition-colors ${
                              status === option
                                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                                : "border-[#e5e7eb] bg-white text-slate-500 hover:border-[var(--brand-primary)]/30"
                            }`}
                          >
                            {option === "intact"
                              ? "არაკასტრირებული"
                              : "კასტრირებული"}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {status === "neutered" ? (
                  <div>
                    <label className={fieldLabel} htmlFor="procedure-date">
                      ოპერაციის თარიღი
                    </label>
                    <input
                      id="procedure-date"
                      type="date"
                      value={procedureDate}
                      onChange={(event) => setProcedureDate(event.target.value)}
                      className={`${textInput} mt-2`}
                    />
                  </div>
                ) : null}

                {reproductiveError ? (
                  <p className="text-sm text-red-600">{reproductiveError}</p>
                ) : null}

                <button
                  type="button"
                  onClick={() => void submitReproductive()}
                  disabled={savingReproductive}
                  className={`${addButton} cursor-pointer disabled:opacity-60`}
                >
                  {savingReproductive ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <BadgeCheck className="h-4 w-4" />
                  )}
                  შენახვა
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </dl>

      <div id="weight" className="mt-8 scroll-mt-28 border-t border-[#eceae5] pt-6">
        <SubsectionHeader
          icon={Scale}
          title="წონა და სხეულის კონდიცია"
          description="აწარმოე წონის ჟურნალი და თვალი ადევნე დინამიკას."
          action={
            <button
              type="button"
              onClick={() => setWeightFormOpen((value) => !value)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[var(--brand-primary)] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
            >
              <Plus className="h-3.5 w-3.5" /> წონის დამატება
            </button>
          }
        />

        <dl className="grid gap-3 sm:grid-cols-3">
          <DataField
            label="მიმდინარე წონა"
            value={`${latestWeight} კგ`}
            hint={
              weightSummary.latest
                ? `ბოლო ჩანაწერი ${formatDate(weightSummary.latest.recordedAt)}`
                : "პროფილის მონაცემი"
            }
          />
          <DataField
            label="ცვლილება"
            value={
              weightSummary.deltaKg === null ? (
                "·"
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <WeightTrendIcon className="h-4 w-4" />
                  {weightSummary.deltaKg > 0 ? "+" : ""}
                  {weightSummary.deltaKg} კგ
                </span>
              )
            }
            hint={
              weightSummary.deltaPercent === null
                ? "საჭიროა ორი ჩანაწერი"
                : `${weightSummary.deltaPercent > 0 ? "+" : ""}${weightSummary.deltaPercent.toFixed(1)}% წინა აწონვასთან`
            }
          />
          <DataField
            label="BCS"
            value={latestBcs ? `${latestBcs} / 9` : "·"}
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
          {weightTarget ? (
            <span className="text-xs text-slate-400">
              {weightTarget.minKg}–{weightTarget.maxKg} კგ
              {pet.history?.weightTarget ? "" : ", შეფასებულია BCS-ის მიხედვით"}
            </span>
          ) : null}
        </div>

        <div className="mt-5">
          {weightSummary.sorted.length > 0 ? (
            <WeightTrendChart entries={weightSummary.sorted} target={weightTarget} />
          ) : (
            <EmptyState
              icon={Scale}
              title="წონის ჩანაწერები ჯერ არ არის"
              body="დაამატე პირველი აწონვა, რომ გრაფიკმა დინამიკის ჩვენება დაიწყოს."
            />
          )}
        </div>

        <AnimatePresence initial={false}>
          {weightFormOpen ? (
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
                      value={weightDate}
                      max={today()}
                      onChange={(event) => setWeightDate(event.target.value)}
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
                      value={weightValue}
                      onChange={(event) => setWeightValue(event.target.value)}
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
                        onClick={() => setWeightBcs(item.score as BcsScore)}
                        className={`h-10 w-10 cursor-pointer rounded-xl border text-sm font-semibold transition-colors ${
                          weightBcs === item.score
                            ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                            : "border-[#e5e7eb] bg-white text-slate-500 hover:border-[var(--brand-primary)]/30"
                        }`}
                      >
                        {item.score}
                      </button>
                    ))}
                  </div>
                  {weightBcs ? (
                    <p className="mt-2 text-xs text-slate-400">
                      {BCS_SCALE.find((item) => item.score === weightBcs)?.label}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className={fieldLabel} htmlFor="weight-note">
                    შენიშვნა
                  </label>
                  <input
                    id="weight-note"
                    value={weightNote}
                    onChange={(event) => setWeightNote(event.target.value)}
                    placeholder="მაგ. აწონვა კლინიკაში"
                    className={`${textInput} mt-2`}
                  />
                </div>

                {weightError ? (
                  <p className="text-sm text-red-600">{weightError}</p>
                ) : null}

                <button
                  type="button"
                  onClick={() => void submitWeight()}
                  disabled={savingWeight || weightValue.trim().length === 0}
                  className={`${addButton} cursor-pointer disabled:opacity-60`}
                >
                  {savingWeight ? (
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

        {weightSummary.sorted.length > 0 ? (
          <ul className="mt-5 divide-y divide-[#f0eeea] rounded-2xl border border-[#e5e7eb]">
            {[...weightSummary.sorted].reverse().slice(0, 6).map((entry) => (
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
                  onClick={() => void removeWeightEntry(entry.id)}
                  aria-label="ჩანაწერის წაშლა"
                  className="cursor-pointer rounded-lg p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <ImageLightbox
        open={zoomOpen}
        src={pet.avatarUrl ?? null}
        alt={pet.name}
        onClose={() => setZoomOpen(false)}
      />
    </SectionCard>
  );
}
