"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Dog, Loader2, Pencil, X } from "lucide-react";
import { useState } from "react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import {
  ActivityRadioCards,
  BreedCombobox,
  addButton,
  fieldLabel,
  textInput,
} from "@/components/dashboard/FormControls";
import type { Pet } from "@/lib/dashboard";
import { petToPayload, type PetProfilePayload } from "@/lib/platform/pet-persistence";

/**
 * Pet list entry with inline editing. The main dashboard is the pets list, so
 * quick fixes (a typo'd name, a fresh weigh-in) shouldn't require a trip to
 * the full profile page — the pencil button opens an editor in place.
 */
export function DashboardPetCard({ pet }: { pet: Pet }) {
  const { savePetProfile } = useDashboard();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<PetProfilePayload>(() => petToPayload(pet));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openEditor = () => {
    setDraft(petToPayload(pet));
    setError(null);
    setEditing(true);
  };

  const submit = async () => {
    if (!draft.name.trim() || !draft.breed.trim() || draft.weightKg <= 0) {
      setError("შეავსე სახელი, ჯიში და წონა.");
      return;
    }

    setSaving(true);
    setError(null);
    const result = await savePetProfile(pet.id, draft);
    setSaving(false);

    if (!result.ok) {
      setError(result.error ?? "შენახვა ვერ მოხერხდა.");
      return;
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="rounded-[2rem] border border-[var(--brand-primary)]/25 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[var(--brand-primary)]">
            {pet.name} · ინფორმაციის რედაქტირება
          </h3>
          <button
            type="button"
            onClick={() => setEditing(false)}
            aria-label="დახურვა"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-[var(--brand-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div>
            <label className={fieldLabel} htmlFor={`pet-name-${pet.id}`}>
              სახელი
            </label>
            <input
              id={`pet-name-${pet.id}`}
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({ ...current, name: event.target.value }))
              }
              className={`${textInput} mt-1.5`}
            />
          </div>

          <div>
            <span className={fieldLabel}>ჯიში</span>
            <div className="mt-1.5">
              <BreedCombobox
                value={draft.breed}
                onChange={(breed) => setDraft((current) => ({ ...current, breed }))}
              />
            </div>
          </div>

          <div>
            <label className={fieldLabel} htmlFor={`pet-weight-${pet.id}`}>
              წონა (კგ)
            </label>
            <input
              id={`pet-weight-${pet.id}`}
              type="number"
              min="0.5"
              step="0.1"
              inputMode="decimal"
              value={draft.weightKg || ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  weightKg: Number(event.target.value),
                }))
              }
              className={`${textInput} mt-1.5`}
            />
          </div>

          <div>
            <span className={fieldLabel}>ფიზიკური აქტივობა</span>
            <div className="mt-1.5">
              <ActivityRadioCards
                value={draft.activity}
                onChange={(activity) =>
                  setDraft((current) => ({ ...current, activity }))
                }
              />
            </div>
          </div>
        </div>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <div className="mt-4 flex gap-2">
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
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="cursor-pointer rounded-full border border-[#e5e7eb] px-5 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:text-[var(--brand-primary)]"
          >
            გაუქმება
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-[2rem] border border-[#e5e7eb] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)]">
      <Link
        href={`/dashboard/pets/${pet.id}`}
        className="flex items-center gap-4 p-5"
      >
        <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-400">
          {pet.avatarUrl ? (
            <Image
              src={pet.avatarUrl}
              alt={pet.name}
              width={64}
              height={64}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <Dog className="h-7 w-7" />
          )}
        </span>
        <div className="min-w-0 flex-1 pr-8">
          <h3 className="font-bold text-[var(--brand-primary)]">{pet.name}</h3>
          <p className="truncate text-sm text-slate-500">
            {pet.breed}, {pet.weightKg}kg
          </p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--brand-primary)]" />
      </Link>

      {/* Sibling to the Link, not nested inside it, so this click never
          triggers navigation. */}
      <button
        type="button"
        onClick={openEditor}
        aria-label={`${pet.name}, ინფორმაციის რედაქტირება`}
        className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-slate-300 shadow-sm ring-1 ring-[#e5e7eb] transition-colors hover:text-[var(--brand-primary)]"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
