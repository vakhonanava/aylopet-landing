"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Dog, IdCard, Loader2, Pencil } from "lucide-react";
import { useState, type ReactNode } from "react";
import { addButton, fieldLabel, textInput } from "@/components/dashboard/FormControls";
import { ImageLightbox } from "@/components/dashboard/ImageLightbox";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { SectionCard } from "@/components/dashboard/history/ui";
import { useHistorySave } from "@/components/dashboard/history/useHistorySave";
import { formatDate, type Pet } from "@/lib/dashboard";
import { calculateAge } from "@/lib/pet-history/calculations";
import { NEUTER_LABELS, SEX_LABELS } from "@/lib/pet-history/labels";
import type {
  NeuterStatus,
  ReproductiveStatus,
  Sex,
} from "@/lib/pet-history/types";

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
  const { save, saving, error } = useHistorySave(pet.id);
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
    if (await save({ reproductive: next })) setEditingField(null);
  };

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

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <button
                  type="button"
                  onClick={() => void submitReproductive()}
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
      </dl>

      <ImageLightbox
        open={zoomOpen}
        src={pet.avatarUrl ?? null}
        alt={pet.name}
        onClose={() => setZoomOpen(false)}
      />
    </SectionCard>
  );
}
