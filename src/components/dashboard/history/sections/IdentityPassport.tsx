"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Dog, IdCard, Loader2, Pencil, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { addButton, fieldLabel, textInput } from "@/components/dashboard/FormControls";
import { ImageLightbox } from "@/components/dashboard/ImageLightbox";
import { DataField, SectionCard } from "@/components/dashboard/history/ui";
import { useHistorySave } from "@/components/dashboard/history/useHistorySave";
import { formatDate, type Pet } from "@/lib/dashboard";
import { calculateAge, summariseWeight } from "@/lib/pet-history/calculations";
import { NEUTER_LABELS, SEX_LABELS } from "@/lib/pet-history/labels";
import type {
  NeuterStatus,
  ReproductiveStatus,
  Sex,
} from "@/lib/pet-history/types";

export function IdentityPassport({ pet }: { pet: Pet }) {
  const [editing, setEditing] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const { save, saving, error } = useHistorySave(pet.id);

  const reproductive = pet.history?.reproductive ?? null;
  const age = calculateAge(pet.birthDate);

  // Same source the weight & BCS log uses, so this card never shows a number
  // that disagrees with it — a plain `pet.weightKg` redisplay would.
  const weightSummary = useMemo(
    () => summariseWeight(pet.history?.weightLogs ?? []),
    [pet.history?.weightLogs],
  );
  const latestWeight = weightSummary.latest?.weightKg ?? pet.weightKg;
  const latestBcs = weightSummary.latest?.bcs ?? pet.bcsScore;

  const [sex, setSex] = useState<Sex>(reproductive?.sex ?? "male");
  const [status, setStatus] = useState<NeuterStatus>(
    reproductive?.status ?? "intact",
  );
  const [procedureDate, setProcedureDate] = useState(
    reproductive?.procedureDate ?? "",
  );

  const openEditor = () => {
    setSex(reproductive?.sex ?? "male");
    setStatus(reproductive?.status ?? "intact");
    setProcedureDate(reproductive?.procedureDate ?? "");
    setEditing(true);
  };

  const submit = async () => {
    const next: ReproductiveStatus = {
      sex,
      status,
      // A procedure date is meaningless on an intact animal — drop it rather
      // than persist a value the UI would never show.
      ...(status === "neutered" && procedureDate
        ? { procedureDate }
        : {}),
    };
    if (await save({ reproductive: next })) setEditing(false);
  };

  return (
    <SectionCard
      id="passport"
      icon={IdCard}
      title="პასპორტი და იდენტიფიკაცია"
      description="ძაღლის ძირითადი ბიოლოგიური მონაცემები."
      action={
        <button
          type="button"
          onClick={editing ? () => setEditing(false) : openEditor}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#e5e7eb] px-3.5 py-2 text-xs font-medium text-slate-500 transition-colors hover:border-[var(--brand-primary)]/30 hover:text-[var(--brand-primary)]"
        >
          {editing ? (
            <>
              <X className="h-3.5 w-3.5" /> გაუქმება
            </>
          ) : (
            <>
              <Pencil className="h-3.5 w-3.5" /> რედაქტირება
            </>
          )}
        </button>
      }
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
        <DataField
          label="დაბადების თარიღი"
          value={pet.birthDate ? formatDate(pet.birthDate) : "·"}
          hint={age?.label}
        />
        <DataField
          label="სქესი"
          value={reproductive ? SEX_LABELS[reproductive.sex] : "·"}
        />
        <DataField
          label="კასტრაცია / სტერილიზაცია"
          value={reproductive ? NEUTER_LABELS[reproductive.status] : "·"}
          hint={
            reproductive?.procedureDate
              ? `ჩატარდა ${formatDate(reproductive.procedureDate)}`
              : undefined
          }
        />
        <DataField
          label="წონა"
          value={
            <span className="inline-flex flex-wrap items-baseline gap-x-2">
              {latestWeight} კგ
              {latestBcs ? (
                <span className="text-xs font-normal text-slate-400">
                  BCS {latestBcs}/9
                </span>
              ) : null}
            </span>
          }
          hint={
            weightSummary.latest
              ? `ბოლო აწონვა ${formatDate(weightSummary.latest.recordedAt)}`
              : "პროფილის მონაცემი"
          }
        />
      </dl>

      <a
        href="#weight"
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-primary-hover)]"
      >
        <Plus className="h-3.5 w-3.5" />
        წონის განახლება
      </a>

      <AnimatePresence initial={false}>
        {editing ? (
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
                    {(["intact", "neutered"] as NeuterStatus[]).map((option) => (
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
                        {option === "intact" ? "არაკასტრირებული" : "კასტრირებული"}
                      </button>
                    ))}
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

              {error ? (
                <p className="text-sm text-red-600">{error}</p>
              ) : null}

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
                შენახვა
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ImageLightbox
        open={zoomOpen}
        src={pet.avatarUrl ?? null}
        alt={pet.name}
        onClose={() => setZoomOpen(false)}
      />
    </SectionCard>
  );
}
