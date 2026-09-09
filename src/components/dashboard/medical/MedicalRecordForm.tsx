"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { TextChipInput, addButton, fieldLabel, textInput } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { useDashboardCopy } from "@/components/dashboard/useDashboardCopy";
import type { Pet } from "@/lib/dashboard";

export function MedicalRecordForm({ pet }: { pet: Pet }) {
  const { saveMedicalRecord } = useDashboard();
  const { d } = useDashboardCopy();
  const toast = useToast();

  const [chronicConditions, setChronicConditions] = useState<string[]>(
    pet.medicalRecord?.chronicConditions ?? [],
  );
  const [allergies, setAllergies] = useState<string[]>(pet.medicalRecord?.allergies ?? []);
  const [geneticRisks, setGeneticRisks] = useState<string[]>(
    pet.medicalRecord?.geneticRisks ?? [],
  );
  const [surgeriesAndTraumas, setSurgeriesAndTraumas] = useState(
    pet.medicalRecord?.surgeriesAndTraumas ?? "",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setBusy(true);
    setError(null);
    setSaved(false);

    const recordResult = await saveMedicalRecord(pet.id, {
      chronicConditions,
      allergies,
      geneticRisks,
      surgeriesAndTraumas,
    });
    setBusy(false);
    if (!recordResult.ok) {
      const message = recordResult.error ?? d.toast.saveFailed;
      setError(message);
      toast.error(message);
      return;
    }
    // Sticky · the label used to reset itself after 2s, which read as the save
    // having been undone. It now holds until the next edit is submitted.
    setSaved(true);
    toast.success(d.toast.saved);
  };

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label className={fieldLabel}>{d.medical.chronicConditions}</label>
        <TextChipInput
          value={chronicConditions}
          onChange={setChronicConditions}
          placeholder={d.medical.chipHint}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={fieldLabel}>{d.medical.allergies}</label>
        <TextChipInput
          value={allergies}
          onChange={setAllergies}
          placeholder={d.medical.allergiesPlaceholder}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={fieldLabel}>{d.medical.geneticRisks}</label>
        <TextChipInput
          value={geneticRisks}
          onChange={setGeneticRisks}
          placeholder={d.medical.chipHint}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={fieldLabel}>{d.medical.surgeries}</label>
        <textarea
          className={`${textInput} min-h-24 resize-none`}
          value={surgeriesAndTraumas}
          onChange={(e) => setSurgeriesAndTraumas(e.target.value)}
          placeholder={d.medical.surgeriesPlaceholder}
        />
      </div>

      <button
        type="button"
        className={`${addButton} self-start`}
        disabled={busy}
        onClick={() => void handleSave()}
      >
        <Check className="h-4 w-4" /> {saved ? d.common.saved : d.common.save}
      </button>
    </div>
  );
}
