"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { useToast } from "@/components/dashboard/Toast";
import { useDashboardCopy } from "@/components/dashboard/useDashboardCopy";
import { addButton, textInput } from "@/components/dashboard/FormControls";
import type { Pet } from "@/lib/dashboard";
import type { Medication } from "@/lib/medical";

export function MedicationsPanel({ pet }: { pet: Pet }) {
  const { addMedication, updateMedication, removeMedication } = useDashboard();
  const { d } = useDashboardCopy();
  const toast = useToast();
  const [nameError, setNameError] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setDosage("");
    setFrequency("");
    setEditingId(null);
    setNameError(undefined);
    setOpen(false);
    setError(null);
  };

  const startEdit = (m: Medication) => {
    setEditingId(m.id);
    setName(m.name);
    setDosage(m.dosage);
    setFrequency(m.frequency);
    setOpen(true);
    setError(null);
  };

  const submit = async () => {
    // Blank name used to abort with a bare `return`, leaving the form frozen
    // and the owner with no idea what was missing.
    if (!name.trim()) {
      setNameError(d.medical.medicationNameRequired);
      return;
    }
    setNameError(undefined);
    setBusy(true);
    setError(null);
    const existing = editingId ? pet.medications.find((m) => m.id === editingId) : null;
    const result = editingId
      ? await updateMedication(pet.id, {
          id: editingId,
          petId: pet.id,
          name,
          dosage,
          frequency,
          isActive: existing?.isActive ?? true,
        })
      : await addMedication(pet.id, { name, dosage, frequency, isActive: true });
    setBusy(false);
    if (!result.ok) {
      const message = result.error ?? d.medical.medicationSaveFailed;
      setError(message);
      toast.error(message);
      return;
    }
    toast.success(d.toast.saved);
    resetForm();
  };

  const toggleActive = async (m: Medication) => {
    setBusy(true);
    const result = await updateMedication(pet.id, { ...m, isActive: !m.isActive });
    setBusy(false);
    if (!result.ok) {
      const message = result.error ?? d.medical.updateFailed;
      setError(message);
      toast.error(message);
    }
  };

  const handleDelete = async (medicationId: string) => {
    setBusy(true);
    const result = await removeMedication(pet.id, medicationId);
    setBusy(false);
    if (!result.ok) {
      const message = result.error ?? d.toast.deleteFailed;
      setError(message);
      toast.error(message);
      return;
    }
    toast.success(d.toast.deleted);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">{d.medical.medicationsSubtitle}</p>
        <button
          type="button"
          className={addButton}
          onClick={() => {
            setEditingId(null);
            setOpen((o) => !o);
          }}
        >
          <Plus className="h-4 w-4" /> {d.common.add}
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {open && (
        <div className="mb-6 grid gap-3 rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <input
              className={textInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={d.medical.medicationName}
              aria-invalid={Boolean(nameError)}
            />
            {nameError ? (
              <p className="text-xs font-medium text-red-600">{nameError}</p>
            ) : null}
          </div>
          <input
            className={textInput}
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder={d.medical.medicationDose}
          />
          <input
            className={textInput}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder={d.medical.medicationFrequency}
          />
          <div className="flex items-center gap-2 sm:col-span-3">
            <button type="button" className={addButton} disabled={busy} onClick={() => void submit()}>
              <Check className="h-4 w-4" /> {editingId ? d.common.update : d.common.save}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={resetForm}
              className="rounded-full border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-slate-600"
            >
              {d.common.cancel}
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {pet.medications.length === 0 && (
          <p className="py-4 text-sm text-slate-400">{d.common.noEntries}</p>
        )}
        {pet.medications.map((m) => (
          <article
            key={m.id}
            className={`rounded-2xl border p-4 ${
              m.isActive
                ? "border-[var(--brand-accent)]/40 bg-[var(--brand-accent)]/[0.06]"
                : "border-[#e5e7eb] bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-semibold text-[var(--brand-primary)]">{m.name}</h4>
                <p className="mt-0.5 text-xs text-slate-400">
                  {m.dosage}, {m.frequency}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void toggleActive(m)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  m.isActive
                    ? "bg-[var(--brand-accent)] text-white"
                    : "border border-[#e5e7eb] text-slate-500"
                }`}
              >
                {m.isActive ? d.medical.medicationActive : d.medical.medicationPaused}
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(m)}
                className="rounded-full border border-[#e5e7eb] px-3 py-1 text-xs font-medium text-[var(--brand-primary)]"
              >
                {d.common.edit}
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(m.id)}
                className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600"
              >
                {d.common.remove}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
