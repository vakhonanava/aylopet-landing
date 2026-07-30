"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { TextChipInput, addButton, fieldLabel, textInput } from "@/components/dashboard/FormControls";
import type { Pet } from "@/lib/dashboard";

export function MedicalRecordForm({ pet }: { pet: Pet }) {
  const { updatePetIdentity, saveMedicalRecord } = useDashboard();

  const [birthDate, setBirthDate] = useState(pet.birthDate ?? "");
  const [bcsScore, setBcsScore] = useState(pet.bcsScore ? String(pet.bcsScore) : "");
  const [microchipId, setMicrochipId] = useState(pet.microchipId ?? "");
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

    const identityResult = await updatePetIdentity(pet.id, {
      birthDate: birthDate || null,
      bcsScore: bcsScore ? Number(bcsScore) : null,
      microchipId: microchipId || null,
    });
    if (!identityResult.ok) {
      setBusy(false);
      setError(identityResult.error ?? "ვერ შეინახა.");
      return;
    }

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

      <div>
        <h3 className="mb-3 text-sm font-semibold text-[var(--brand-primary)]">
          იდენტიფიკაცია & სხეულის მდგომარეობა
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel}>დაბადების თარიღი</label>
            <input
              type="date"
              className={textInput}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel}>BCS ქულა (1-9)</label>
            <input
              type="number"
              min={1}
              max={9}
              className={textInput}
              value={bcsScore}
              onChange={(e) => setBcsScore(e.target.value)}
              placeholder="მაგ. 5"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel}>მიკროჩიპის ნომერი</label>
            <input
              className={textInput}
              value={microchipId}
              onChange={(e) => setMicrochipId(e.target.value)}
              placeholder="15-ნიშნა კოდი"
            />
          </div>
        </div>
      </div>

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
