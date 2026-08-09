"use client";

import { BadgeCheck, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { addButton, fieldLabel, textInput } from "@/components/dashboard/FormControls";
import { useHistorySave } from "@/components/dashboard/history/useHistorySave";
import { uid, type Pet } from "@/lib/dashboard";
import {
  GENETIC_CATEGORY_LABELS,
  GENETIC_LEVEL,
} from "@/lib/pet-history/labels";
import type {
  AncestrySegment,
  GeneticRiskCategory,
  GeneticRiskLevel,
  GeneticRiskMarker,
  OwnerDnaRecord,
} from "@/lib/pet-history/types";

interface OwnerDnaFormProps {
  pet: Pet;
  onDone: () => void;
}

type RiskDraft = GeneticRiskMarker;

/**
 * Manual entry for DNA results the owner already holds from another lab.
 * Rows are edited in local drafts and only committed on save, so a half-typed
 * breed row never reaches the persisted record.
 */
export function OwnerDnaForm({ pet, onDone }: OwnerDnaFormProps) {
  const existing = pet.history?.dna ?? null;
  const { save, saving, error } = useHistorySave(pet.id);

  const [provider, setProvider] = useState(existing?.provider ?? "");
  const [testedAt, setTestedAt] = useState(existing?.testedAt ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [ancestry, setAncestry] = useState<AncestrySegment[]>(
    existing?.ancestry.length ? existing.ancestry : [{ breed: "", percentage: 0 }],
  );
  const [risks, setRisks] = useState<RiskDraft[]>(existing?.risks ?? []);

  const totalPercent = ancestry.reduce(
    (sum, segment) => sum + (Number(segment.percentage) || 0),
    0,
  );

  const updateAncestry = (index: number, patch: Partial<AncestrySegment>) => {
    setAncestry((prev) =>
      prev.map((segment, i) => (i === index ? { ...segment, ...patch } : segment)),
    );
  };

  const updateRisk = (index: number, patch: Partial<RiskDraft>) => {
    setRisks((prev) =>
      prev.map((risk, i) => (i === index ? { ...risk, ...patch } : risk)),
    );
  };

  const submit = async () => {
    const cleanedAncestry = ancestry
      .filter((segment) => segment.breed.trim() && Number(segment.percentage) > 0)
      .map((segment) => ({
        breed: segment.breed.trim(),
        percentage: Number(segment.percentage),
        ...(segment.group?.trim() ? { group: segment.group.trim() } : {}),
      }));

    const cleanedRisks = risks
      .filter((risk) => risk.condition.trim())
      .map((risk) => ({
        ...risk,
        condition: risk.condition.trim(),
        gene: risk.gene.trim(),
        summary: risk.summary.trim(),
      }));

    const record: OwnerDnaRecord = {
      provider: provider.trim() || "სხვა ლაბორატორია",
      testedAt: testedAt || null,
      ancestry: cleanedAncestry,
      risks: cleanedRisks,
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    };

    if (await save({ dna: record })) onDone();
  };

  return (
    <div className="mt-5 space-y-5 rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={fieldLabel} htmlFor="dna-provider">
            ლაბორატორია / ტესტი
          </label>
          <input
            id="dna-provider"
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
            placeholder="Embark, Wisdom Panel, კლინიკა..."
            className={`${textInput} mt-2`}
          />
        </div>
        <div>
          <label className={fieldLabel} htmlFor="dna-date">
            ტესტის თარიღი
          </label>
          <input
            id="dna-date"
            type="date"
            value={testedAt}
            onChange={(event) => setTestedAt(event.target.value)}
            className={`${textInput} mt-2`}
          />
        </div>
      </div>

      {/* Ancestry rows */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={fieldLabel}>ჯიშური წარმომავლობა</span>
          <span
            className={`text-xs font-medium ${
              Math.abs(totalPercent - 100) < 0.5
                ? "text-emerald-600"
                : "text-amber-600"
            }`}
          >
            ჯამი {totalPercent.toFixed(1)}%
          </span>
        </div>

        <div className="mt-2 space-y-2">
          {ancestry.map((segment, index) => (
            // `textInput` already sets `w-full`, so widths are controlled by
            // wrappers rather than by competing width utilities on the input.
            <div key={index} className="flex gap-2">
              <div className="min-w-0 flex-1">
                <input
                  value={segment.breed}
                  onChange={(event) =>
                    updateAncestry(index, { breed: event.target.value })
                  }
                  placeholder="ჯიში"
                  className={textInput}
                  aria-label={`ჯიში ${index + 1}`}
                />
              </div>
              <div className="w-24 shrink-0">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  inputMode="decimal"
                  value={segment.percentage || ""}
                  onChange={(event) =>
                    updateAncestry(index, {
                      percentage: Number(event.target.value),
                    })
                  }
                  placeholder="%"
                  className={textInput}
                  aria-label={`პროცენტი ${index + 1}`}
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setAncestry((prev) => prev.filter((_, i) => i !== index))
                }
                aria-label="მწკრივის წაშლა"
                className="shrink-0 cursor-pointer rounded-xl px-3 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setAncestry((prev) => [...prev, { breed: "", percentage: 0 }])
          }
          className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[var(--brand-primary)] hover:underline"
        >
          <Plus className="h-3.5 w-3.5" /> ჯიშის დამატება
        </button>
      </div>

      {/* Risk rows */}
      <div>
        <span className={fieldLabel}>გენეტიკური რისკები</span>

        <div className="mt-2 space-y-3">
          {risks.map((risk, index) => (
            <div
              key={risk.id}
              className="space-y-2 rounded-2xl border border-[#e5e7eb] bg-white p-3"
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1">
                  <input
                    value={risk.condition}
                    onChange={(event) =>
                      updateRisk(index, { condition: event.target.value })
                    }
                    placeholder="მდგომარეობა"
                    className={textInput}
                    aria-label={`მდგომარეობა ${index + 1}`}
                  />
                </div>
                <div className="w-32 shrink-0">
                  <input
                    value={risk.gene}
                    onChange={(event) =>
                      updateRisk(index, { gene: event.target.value })
                    }
                    placeholder="გენი"
                    className={`${textInput} font-mono`}
                    aria-label={`გენი ${index + 1}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setRisks((prev) => prev.filter((_, i) => i !== index))
                  }
                  aria-label="რისკის წაშლა"
                  className="shrink-0 cursor-pointer rounded-xl px-3 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-start gap-2">
                <select
                  value={risk.category}
                  onChange={(event) =>
                    updateRisk(index, {
                      category: event.target.value as GeneticRiskCategory,
                    })
                  }
                  className={`${textInput} min-w-40 flex-1 cursor-pointer`}
                  aria-label={`კატეგორია ${index + 1}`}
                >
                  {(
                    Object.keys(GENETIC_CATEGORY_LABELS) as GeneticRiskCategory[]
                  ).map((category) => (
                    <option key={category} value={category}>
                      {GENETIC_CATEGORY_LABELS[category]}
                    </option>
                  ))}
                </select>

                <div className="flex gap-1.5">
                  {(["clear", "carrier", "at_risk"] as GeneticRiskLevel[]).map(
                    (level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => updateRisk(index, { level })}
                        className={`cursor-pointer rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                          risk.level === level
                            ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                            : "border-[#e5e7eb] bg-white text-slate-500"
                        }`}
                      >
                        {GENETIC_LEVEL[level].label}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <input
                value={risk.summary}
                onChange={(event) =>
                  updateRisk(index, { summary: event.target.value })
                }
                placeholder="მოკლე აღწერა (არასავალდებულო)"
                className={textInput}
                aria-label={`აღწერა ${index + 1}`}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setRisks((prev) => [
              ...prev,
              {
                id: uid("risk"),
                condition: "",
                gene: "",
                category: "metabolic",
                level: "clear",
                summary: "",
              },
            ])
          }
          className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[var(--brand-primary)] hover:underline"
        >
          <Plus className="h-3.5 w-3.5" /> რისკის დამატება
        </button>
      </div>

      <div>
        <label className={fieldLabel} htmlFor="dna-notes">
          შენიშვნა
        </label>
        <textarea
          id="dna-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="დამატებითი ინფორმაცია ტესტის შესახებ..."
          className={`${textInput} mt-2 min-h-20 resize-none`}
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
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
          onClick={onDone}
          className="cursor-pointer rounded-full border border-[#e5e7eb] px-5 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:text-[var(--brand-primary)]"
        >
          გაუქმება
        </button>
      </div>
    </div>
  );
}
