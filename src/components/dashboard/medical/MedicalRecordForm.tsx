"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { TextChipInput, addButton, fieldLabel, textInput } from "@/components/dashboard/FormControls";
import type { Pet } from "@/lib/dashboard";

export function MedicalRecordForm({ pet }: { pet: Pet }) {
  const { saveMedicalRecord } = useDashboard();

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
      setError(recordResult.error ?? "ვერ შეინახა.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label className={fieldLabel}>ქრონიკული დაავადებები</label>
        <TextChipInput
          value={chronicConditions}
          onChange={setChronicConditions}
          placeholder="დაწერე და დააჭირე Enter-ს"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={fieldLabel}>ალერგიები</label>
        <TextChipInput
          value={allergies}
          onChange={setAllergies}
          placeholder="საკვები / მედიკამენტოზური ალერგიები"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={fieldLabel}>გენეტიკური / ჯიშობრივი რისკები</label>
        <TextChipInput
          value={geneticRisks}
          onChange={setGeneticRisks}
          placeholder="დაწერე და დააჭირე Enter-ს"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={fieldLabel}>ოპერაციები / ტრავმები</label>
        <textarea
          className={`${textInput} min-h-24 resize-none`}
          value={surgeriesAndTraumas}
          onChange={(e) => setSurgeriesAndTraumas(e.target.value)}
          placeholder="აღწერე წარსული ოპერაციები ან ტრავმები"
        />
      </div>

      <button
        type="button"
        className={`${addButton} self-start`}
        disabled={busy}
        onClick={() => void handleSave()}
      >
        <Check className="h-4 w-4" /> {saved ? "შენახულია!" : "შენახვა"}
      </button>
    </div>
  );
}
