"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Slider from "@radix-ui/react-slider";
import {
  Activity,
  AlertTriangle,
  CalendarClock,
  Check,
  Pill,
  Plus,
  Syringe,
  UtensilsCrossed,
} from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { addButton, fieldLabel, textInput } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { useDashboardCopy } from "@/components/dashboard/useDashboardCopy";
import {
  daysUntil,
  formatDate,
  getCareTypeLabels,
  getCareTypeOptions,
  getMoodScale,
  type CareType,
  type MealType,
  type Pet,
} from "@/lib/dashboard";
import { getAppetiteLabels } from "@/lib/pet-history/labels";
import type { AppetiteLevel } from "@/lib/pet-history/types";

/** Field-level validation shown under the input it belongs to. */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-medium text-red-600">{message}</p>;
}

const tabTrigger =
  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition-colors data-[state=active]:bg-[var(--brand-primary)] data-[state=active]:text-white";

export function LogbookTabs({ pet }: { pet: Pet }) {
  const { d } = useDashboardCopy();

  return (
    <section
      id="logbook-vaccines"
      className="rounded-[2rem] border border-[#e5e7eb] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-7"
    >
      <h2 className="mb-5 text-lg font-bold tracking-tight text-[var(--brand-primary)]">
        {d.logbook.title}
      </h2>

      <Tabs.Root defaultValue="vaccines">
        <Tabs.List className="mb-6 flex flex-wrap gap-1.5 rounded-full border border-[#e5e7eb] bg-[#FAFAF8] p-1.5">
          <Tabs.Trigger value="vaccines" className={tabTrigger}>
            <Syringe className="h-4 w-4" /> {d.logbook.tabVaccines}
          </Tabs.Trigger>
          <Tabs.Trigger value="supplements" className={tabTrigger}>
            <Pill className="h-4 w-4" /> {d.logbook.tabSupplements}
          </Tabs.Trigger>
          <Tabs.Trigger value="food" className={tabTrigger}>
            <UtensilsCrossed className="h-4 w-4" /> {d.logbook.tabFood}
          </Tabs.Trigger>
          <Tabs.Trigger value="mood" className={tabTrigger}>
            <Activity className="h-4 w-4" /> {d.logbook.tabMood}
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="vaccines" className="outline-none">
          <VaccinesTab pet={pet} />
        </Tabs.Content>
        <Tabs.Content value="supplements" className="outline-none">
          <SupplementsTab pet={pet} />
        </Tabs.Content>
        <Tabs.Content value="food" className="outline-none">
          <FoodTab pet={pet} />
        </Tabs.Content>
        <Tabs.Content value="mood" className="outline-none">
          <MoodTab pet={pet} />
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
}

/* ------------------------------ Tab A: Vaccines --------------------------- */

function VaccinesTab({ pet }: { pet: Pet }) {
  const { addVaccine, updateVaccine, removeVaccine } = useDashboard();
  const { d, locale } = useDashboardCopy();
  const toast = useToast();
  const careTypeLabels = getCareTypeLabels(locale);
  const careTypeOptions = getCareTypeOptions(locale);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    administered?: string;
  }>({});
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [careType, setCareType] = useState<CareType>("vaccine");
  const [administered, setAdministered] = useState("");
  const [nextDue, setNextDue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const resetForm = () => {
    setName("");
    setCareType("vaccine");
    setAdministered("");
    setNextDue("");
    setEditingId(null);
    setOpen(false);
    setError(null);
    setFieldErrors({});
  };

  const startEdit = (v: (typeof pet.vaccines)[number]) => {
    setEditingId(v.id);
    setName(v.name);
    setCareType(v.careType);
    setAdministered(v.administered);
    setNextDue(v.nextDue);
    setOpen(true);
    setError(null);
    setFieldErrors({});
  };

  const submit = async () => {
    const nextErrors: { name?: string; administered?: string } = {};
    if (!name.trim()) nextErrors.name = d.logbook.vaccineNameRequired;
    if (!administered) nextErrors.administered = d.logbook.vaccineDateRequired;
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setBusy(true);
    setError(null);

    const result = editingId
      ? await updateVaccine(pet.id, {
          id: editingId,
          name,
          careType,
          administered,
          nextDue,
        })
      : await addVaccine(pet.id, { name, careType, administered, nextDue });

    setBusy(false);
    if (!result.ok) {
      const message = result.error ?? d.logbook.vaccineSaveFailed;
      setError(message);
      toast.error(message);
      return;
    }
    toast.success(d.toast.saved);
    resetForm();
  };

  const handleDelete = async (vaccineId: string) => {
    setBusy(true);
    setError(null);
    const result = await removeVaccine(pet.id, vaccineId);
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
        <p className="text-sm text-slate-500">{d.logbook.vaccinesSubtitle}</p>
        <button className={addButton} onClick={() => { setEditingId(null); setOpen((o) => !o); }}>
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
          <div className="flex flex-col gap-1.5 sm:col-span-3">
            <label className={fieldLabel}>{d.logbook.vaccineType}</label>
            <div className="flex flex-wrap gap-2">
              {careTypeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCareType(opt.value)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    careType === opt.value
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                      : "border-[#e5e7eb] bg-white text-slate-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-3">
            <label className={fieldLabel}>{d.logbook.vaccineName}</label>
            <input
              className={textInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={d.logbook.vaccineNamePlaceholder}
              aria-invalid={Boolean(fieldErrors.name)}
            />
            <FieldError message={fieldErrors.name} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel}>{d.logbook.administeredOn}</label>
            <input
              type="date"
              className={textInput}
              value={administered}
              onChange={(e) => setAdministered(e.target.value)}
              aria-invalid={Boolean(fieldErrors.administered)}
            />
            <FieldError message={fieldErrors.administered} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel}>{d.logbook.nextDue}</label>
            <input
              type="date"
              className={textInput}
              value={nextDue}
              onChange={(e) => setNextDue(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-2">
            <button className={addButton} disabled={busy} onClick={() => void submit()}>
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

      {/* Vertical timeline */}
      <ol className="relative ml-3 border-l border-[#e5e7eb]">
        {pet.vaccines.length === 0 && (
          <li className="ml-6 py-4 text-sm text-slate-400">
            {d.common.noEntries}
          </li>
        )}
        {pet.vaccines.map((v) => {
          const due = v.nextDue ? daysUntil(v.nextDue) : null;
          const overdue = due !== null && due < 0;
          const soon = due !== null && due >= 0 && due <= 30;

          const badge = overdue
            ? "bg-red-50 text-red-600 border-red-200"
            : soon
              ? "bg-amber-50 text-amber-600 border-amber-200"
              : "bg-[var(--brand-primary)]/[0.05] text-[var(--brand-primary)] border-transparent";

          return (
            <li key={v.id} className="mb-5 ml-6">
              <span
                className={`absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-white ${
                  overdue
                    ? "bg-red-500"
                    : soon
                      ? "bg-amber-500"
                      : "bg-[var(--brand-accent)]"
                }`}
              />
              <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-[var(--brand-primary)]">{v.name}</h4>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                        {careTypeLabels[v.careType]}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {d.logbook.administeredLabel}: {formatDate(v.administered)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {v.nextDue && (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${badge}`}
                      >
                        {overdue ? (
                          <AlertTriangle className="h-3.5 w-3.5" />
                        ) : (
                          <CalendarClock className="h-3.5 w-3.5" />
                        )}
                        {overdue
                          ? `${d.logbook.overdue}, ${formatDate(v.nextDue)}`
                          : soon
                            ? `${d.logbook.dueSoon.replace("{days}", String(due))}, ${formatDate(v.nextDue)}`
                            : `${d.logbook.nextLabel}: ${formatDate(v.nextDue)}`}
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => startEdit(v)}
                      className="rounded-full border border-[#e5e7eb] px-3 py-1 text-xs font-medium text-[var(--brand-primary)]"
                    >
                      {d.common.edit}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleDelete(v.id)}
                      className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600"
                    >
                      {d.common.remove}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------------------------- Tab B: Supplements -------------------------- */

function SupplementsTab({ pet }: { pet: Pet }) {
  const { toggleSupplement, addSupplement } = useDashboard();
  const { d } = useDashboardCopy();
  const toast = useToast();
  const [nameError, setNameError] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!name.trim()) {
      setNameError(d.logbook.supplementRequired);
      return;
    }
    setNameError(undefined);
    setBusy(true);
    setError(null);
    const result = await addSupplement(pet.id, {
      name,
      dosage,
      frequency,
      givenToday: false,
    });
    setBusy(false);
    if (!result.ok) {
      const message = result.error ?? d.toast.saveFailed;
      setError(message);
      toast.error(message);
      return;
    }
    toast.success(d.toast.saved);
    setName("");
    setDosage("");
    setFrequency("");
    setOpen(false);
  };

  const handleToggle = async (supplementId: string) => {
    const result = await toggleSupplement(pet.id, supplementId);
    if (!result.ok) {
      const message = result.error ?? d.medical.updateFailed;
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">{d.logbook.supplementsSubtitle}</p>
        <button className={addButton} onClick={() => setOpen((o) => !o)}>
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
              placeholder={d.logbook.supplementNamePlaceholder}
              aria-invalid={Boolean(nameError)}
            />
            <FieldError message={nameError} />
          </div>
          <input
            className={textInput}
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder={d.logbook.supplementDoseHint}
          />
          <input
            className={textInput}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder={d.logbook.supplementFrequencyPlaceholder}
          />
          <div className="sm:col-span-3">
            <button className={addButton} disabled={busy} onClick={() => void submit()}>
              <Check className="h-4 w-4" /> {d.common.save}
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {pet.supplements.length === 0 && (
          <p className="py-4 text-sm text-slate-400">{d.common.noEntries}</p>
        )}
        {pet.supplements.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => void handleToggle(s.id)}
            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
              s.givenToday
                ? "border-[var(--brand-accent)]/40 bg-[var(--brand-accent)]/[0.06]"
                : "border-[#e5e7eb] bg-white hover:border-[var(--brand-primary)]/20"
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                s.givenToday
                  ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {s.givenToday && <Check className="h-4 w-4" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-[var(--brand-primary)]">
                {s.name}
              </span>
              <span className="block text-xs text-slate-400">
                {s.dosage}, {s.frequency}
              </span>
            </span>
            <span
              className={`text-xs font-medium ${s.givenToday ? "text-[var(--brand-accent)]" : "text-slate-400"}`}
            >
              {s.givenToday ? d.logbook.givenToday : d.logbook.givenTodayQuestion}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Tab C: Food ------------------------------ */

function FoodTab({ pet }: { pet: Pet }) {
  const { addFood } = useDashboard();
  const { d, locale } = useDashboardCopy();
  const toast = useToast();
  const appetiteLabels = getAppetiteLabels(locale);
  const [portionError, setPortionError] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [mealType, setMealType] = useState<MealType>("morning");
  const [brand, setBrand] = useState("Aylopet");
  const [isAylopet, setIsAylopet] = useState(true);
  const [portion, setPortion] = useState("");
  const [response, setResponse] = useState("");
  const [appetite, setAppetite] = useState<AppetiteLevel>("normal");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    // Portion is mandatory, but the form used to bail out silently and leave
    // the owner staring at an unchanged panel with no idea why.
    const grams = Number(portion);
    if (!portion.trim()) {
      setPortionError(d.logbook.portionRequired);
      return;
    }
    if (!Number.isFinite(grams) || grams <= 0) {
      setPortionError(d.logbook.portionInvalid);
      return;
    }
    setPortionError(undefined);

    setBusy(true);
    setError(null);
    const result = await addFood(pet.id, {
      date: new Date().toISOString().slice(0, 10),
      mealType,
      brand: isAylopet ? "Aylopet" : brand || d.common.other,
      isAylopet,
      portionGrams: grams,
      digestiveResponse: response || undefined,
      appetite,
    });
    setBusy(false);
    if (!result.ok) {
      const message = result.error ?? d.toast.saveFailed;
      setError(message);
      toast.error(message);
      return;
    }
    toast.success(d.toast.saved);
    setPortion("");
    setResponse("");
    setAppetite("normal");
    setOpen(false);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">{d.logbook.foodSubtitle}</p>
        <button className={addButton} onClick={() => setOpen((o) => !o)}>
          <Plus className="h-4 w-4" /> {d.common.add}
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {open && (
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className={fieldLabel}>{d.logbook.mealType}</label>
              <div className="flex gap-2">
                {(["morning", "evening"] as MealType[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMealType(m)}
                    className={`flex-1 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                      mealType === m
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                        : "border-[#e5e7eb] bg-white text-slate-600"
                    }`}
                  >
                    {m === "morning" ? d.logbook.morning : d.logbook.evening}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={fieldLabel} htmlFor="food-portion">
                {d.logbook.portionGrams}
              </label>
              <input
                id="food-portion"
                type="number"
                min="1"
                inputMode="numeric"
                className={textInput}
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                placeholder="0"
                required
                aria-invalid={Boolean(portionError)}
                aria-describedby={portionError ? "food-portion-error" : undefined}
              />
              <span id="food-portion-error">
                <FieldError message={portionError} />
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel}>{d.logbook.brand}</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAylopet(true)}
                className={`flex-1 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  isAylopet
                    ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                    : "border-[#e5e7eb] bg-white text-slate-600"
                }`}
              >
                Aylopet
              </button>
              <button
                type="button"
                onClick={() => setIsAylopet(false)}
                className={`flex-1 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  !isAylopet
                    ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                    : "border-[#e5e7eb] bg-white text-slate-600"
                }`}
              >
                {d.common.other}
              </button>
            </div>
            {!isAylopet && (
              <input
                className={`${textInput} mt-2`}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder={d.logbook.brandPlaceholder}
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel}>{d.logbook.appetite}</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(appetiteLabels) as AppetiteLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setAppetite(level)}
                  className={`flex-1 rounded-2xl border px-3 py-2.5 text-xs font-medium transition-colors ${
                    appetite === level
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                      : "border-[#e5e7eb] bg-white text-slate-600"
                  }`}
                >
                  {appetiteLabels[level]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel}>
              {d.logbook.digestion} ({d.common.optional})
            </label>
            <textarea
              className={`${textInput} min-h-20 resize-none`}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder={d.logbook.digestionPlaceholder}
            />
          </div>

          <button className={addButton} disabled={busy} onClick={() => void submit()}>
            <Check className="h-4 w-4" /> {d.common.save}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {pet.food.length === 0 && (
          <p className="py-4 text-sm text-slate-400">{d.common.noEntries}</p>
        )}
        {pet.food.map((f) => (
          <article
            key={f.id}
            className="rounded-2xl border border-[#e5e7eb] bg-white p-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-primary)]/[0.06] text-[var(--brand-primary)]">
                  <UtensilsCrossed className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-semibold text-[var(--brand-primary)]">
                    {f.mealType === "morning" ? d.logbook.morningMeal : d.logbook.eveningMeal}
                  </h4>
                  <p className="text-xs text-slate-400">{formatDate(f.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    f.isAylopet
                      ? "bg-[var(--brand-accent)]/10 text-[var(--brand-accent)]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {f.brand}
                </span>
                <span className="rounded-full bg-[var(--brand-primary)]/[0.05] px-3 py-1 text-xs font-semibold text-[var(--brand-primary)]">
                  {f.portionGrams}
                  {d.logbook.gramsShort}
                </span>
              </div>
            </div>
            {f.digestiveResponse && (
              <p className="mt-3 rounded-xl bg-[#FAFAF8] px-3 py-2 text-sm text-slate-600">
                <span className="font-medium text-[var(--brand-primary)]">{d.logbook.digestionLabel}</span>{" "}
                {f.digestiveResponse}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Tab D: Mood ------------------------------ */

function MoodTab({ pet }: { pet: Pet }) {
  const { addMood } = useDashboard();
  const { d, locale } = useDashboardCopy();
  const toast = useToast();
  const moodScale = getMoodScale(locale);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(50);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    const result = await addMood(pet.id, {
      date: new Date().toISOString().slice(0, 10),
      mood,
      energy,
      notes: notes || undefined,
    });
    setBusy(false);
    if (!result.ok) {
      const message = result.error ?? d.toast.saveFailed;
      setError(message);
      toast.error(message);
      return;
    }
    toast.success(d.toast.saved);
    setMood(3);
    setEnergy(50);
    setNotes("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Daily check-in card */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-gradient-to-br from-[#FAFAF8] to-white p-5 sm:p-6">
        <h3 className="text-base font-bold text-[var(--brand-primary)]">{d.logbook.checkInTitle}</h3>
        <p className="mt-1 text-sm text-slate-500">
          {d.logbook.checkInQuestion.replace("{name}", pet.name)}
        </p>

        {/* Mood scale */}
        <div className="mt-5">
          <label className={fieldLabel}>{d.logbook.moodLabel}</label>
          <div className="mt-2 flex justify-between gap-2">
            {moodScale.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border p-3 transition-all duration-200 ${
                  mood === m.value
                    ? "border-[var(--brand-primary)] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                    : "border-transparent bg-white/50 hover:border-[#e5e7eb]"
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span
                  className={`text-[11px] font-medium ${mood === m.value ? "text-[var(--brand-primary)]" : "text-slate-400"}`}
                >
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Energy slider */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <label className={fieldLabel}>{d.logbook.energyLabel}</label>
            <span className="text-sm font-semibold text-[var(--brand-primary)]">{energy}%</span>
          </div>
          <Slider.Root
            className="relative flex h-5 w-full touch-none items-center"
            value={[energy]}
            onValueChange={([v]) => setEnergy(v)}
            max={100}
            step={1}
          >
            <Slider.Track className="relative h-2 grow rounded-full bg-[#e5e7eb]">
              <Slider.Range className="absolute h-full rounded-full bg-[var(--brand-primary)]" />
            </Slider.Track>
            <Slider.Thumb
              className="block h-5 w-5 rounded-full border-2 border-[var(--brand-primary)] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] outline-none focus:ring-4 focus:ring-[var(--brand-primary)]/15"
              aria-label={d.logbook.energy}
            />
          </Slider.Root>
        </div>

        {/* Notes */}
        <div className="mt-6 flex flex-col gap-1.5">
          <label className={fieldLabel}>{d.logbook.notes}</label>
          <textarea
            className={`${textInput} min-h-20 resize-none`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={d.logbook.notesPlaceholder}
          />
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          className={`${addButton} mt-4`}
          disabled={busy}
          onClick={() => void submit()}
        >
          <Check className="h-4 w-4" /> {d.logbook.saveCheckIn}
        </button>
      </div>

      {/* History */}
      <div className="flex flex-col gap-3">
        {pet.moods.map((entry) => {
          const m = moodScale.find((x) => x.value === entry.mood);
          return (
            <article
              key={entry.id}
              className="flex items-start gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-4"
            >
              <span className="text-3xl">{m?.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-semibold text-[var(--brand-primary)]">{m?.label}</h4>
                  <span className="text-xs text-slate-400">
                    {formatDate(entry.date)}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-slate-400">{d.logbook.energy}</span>
                  <span className="h-2 w-28 overflow-hidden rounded-full bg-[#e5e7eb]">
                    <span
                      className="block h-full rounded-full bg-[var(--brand-accent)]"
                      style={{ width: `${entry.energy}%` }}
                    />
                  </span>
                  <span className="text-xs font-medium text-[var(--brand-primary)]">
                    {entry.energy}%
                  </span>
                </div>
                {entry.notes && (
                  <p className="mt-2 text-sm text-slate-600">{entry.notes}</p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
