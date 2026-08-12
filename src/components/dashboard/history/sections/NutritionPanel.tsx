"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Calculator,
  Flame,
  Loader2,
  Pencil,
  Scale,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { addButton, fieldLabel, textInput } from "@/components/dashboard/FormControls";
import {
  Chip,
  DataField,
  EmptyState,
  MetricTile,
  SectionCard,
} from "@/components/dashboard/history/ui";
import { useHistorySave } from "@/components/dashboard/history/useHistorySave";
import { formatDate, type Pet } from "@/lib/dashboard";
import {
  calculateAge,
  calculateCalorieTarget,
} from "@/lib/pet-history/calculations";
import { APPETITE_LABELS, DIET_LABELS } from "@/lib/pet-history/labels";
import type { DietProfile, DietType } from "@/lib/pet-history/types";

/** Groups feeding entries by day so intake can be compared with the target. */
function dailyIntake(pet: Pet) {
  const map = new Map<string, { grams: number; meals: number }>();
  for (const entry of pet.food) {
    const current = map.get(entry.date) ?? { grams: 0, meals: 0 };
    current.grams += entry.portionGrams;
    current.meals += 1;
    map.set(entry.date, current);
  }
  return [...map.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, 5)
    .map(([date, value]) => ({ date, ...value }));
}

export function NutritionPanel({ pet }: { pet: Pet }) {
  const [editing, setEditing] = useState(false);
  const { save, saving, error } = useHistorySave(pet.id);

  const diet = pet.history?.diet ?? null;
  const [type, setType] = useState<DietType>(diet?.type ?? "aylopet_fresh");
  const [productName, setProductName] = useState(diet?.productName ?? "");
  const [mealsPerDay, setMealsPerDay] = useState(String(diet?.mealsPerDay ?? 2));
  const [kcalPer100g, setKcalPer100g] = useState(
    diet?.kcalPer100g ? String(diet.kcalPer100g) : "",
  );
  const [prescriptionReason, setPrescriptionReason] = useState(
    diet?.prescriptionReason ?? "",
  );

  const age = calculateAge(pet.birthDate);
  const latestWeight =
    pet.history?.weightLogs?.at(-1)?.weightKg ?? pet.weightKg;

  const target = useMemo(
    () =>
      calculateCalorieTarget({
        weightKg: latestWeight,
        activity: pet.activity,
        ageMonths: age?.totalMonths ?? null,
        neutered: pet.history?.reproductive?.status === "neutered",
        diet,
      }),
    [latestWeight, pet.activity, age?.totalMonths, pet.history?.reproductive?.status, diet],
  );

  const intake = useMemo(() => dailyIntake(pet), [pet]);

  const submit = async () => {
    const next: DietProfile = {
      type,
      mealsPerDay: Math.max(1, Number(mealsPerDay) || 2),
      ...(productName.trim() ? { productName: productName.trim() } : {}),
      ...(Number(kcalPer100g) > 0
        ? { kcalPer100g: Number(kcalPer100g) }
        : {}),
      ...(type === "prescription" && prescriptionReason.trim()
        ? { prescriptionReason: prescriptionReason.trim() }
        : {}),
      ...(diet?.startedAt ? { startedAt: diet.startedAt } : {}),
    };
    if (await save({ diet: next })) setEditing(false);
  };

  return (
    <SectionCard
      id="nutrition"
      icon={UtensilsCrossed}
      title="კვება და რაციონი"
      description="დიეტის პროფილი, დღიური კალორაჟი და კვების ჟურნალი."
      action={
        <button
          type="button"
          onClick={() => setEditing((value) => !value)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#e5e7eb] px-3.5 py-2 text-xs font-medium text-slate-500 transition-colors hover:border-[var(--brand-primary)]/30 hover:text-[var(--brand-primary)]"
        >
          {editing ? (
            <>
              <X className="h-3.5 w-3.5" /> გაუქმება
            </>
          ) : (
            <>
              <Pencil className="h-3.5 w-3.5" /> რაციონის რედაქტირება
            </>
          )}
        </button>
      }
    >
      <dl className="grid gap-3 sm:grid-cols-3">
        <DataField
          label="მიმდინარე დიეტა"
          value={diet ? DIET_LABELS[diet.type] : "·"}
          hint={diet?.productName}
        />
        <DataField
          label="კვების სიხშირე"
          value={diet ? `დღეში ${diet.mealsPerDay}-ჯერ` : "·"}
        />
        <DataField
          label="ენერგეტიკული სიმკვრივე"
          value={diet?.kcalPer100g ? `${diet.kcalPer100g} kcal` : "·"}
          hint={diet?.kcalPer100g ? "100 გრამზე" : "საჭიროა გრამების გამოსათვლელად"}
        />
      </dl>

      {diet?.type === "prescription" && diet.prescriptionReason ? (
        <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          სამკურნალო დიეტა, {diet.prescriptionReason}
        </p>
      ) : null}

      <div className="mt-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)]">
          <Calculator className="h-4 w-4" /> დღიური კალორაჟი და პორცია
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile
            icon={Flame}
            label="დღიური ენერგია"
            value={target.merKcal}
            unit="kcal"
            sub={target.factorLabel}
          />
          <MetricTile
            icon={Flame}
            label="მოსვენების ენერგია"
            value={target.rerKcal}
            unit="kcal"
            sub={`RER × ${target.factor}`}
          />
          <MetricTile
            icon={Scale}
            label="დღიური პორცია"
            value={target.gramsPerDay ?? "·"}
            unit={target.gramsPerDay ? "გ" : undefined}
            sub={target.gramsPerDay ? undefined : "მიუთითე kcal/100გ"}
          />
          <MetricTile
            icon={UtensilsCrossed}
            label="ერთ კვებაზე"
            value={target.gramsPerMeal ?? "·"}
            unit={target.gramsPerMeal ? "გ" : undefined}
            sub={diet ? `დღეში ${diet.mealsPerDay}-ჯერ` : "დღეში 2-ჯერ"}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          გაანგარიშება ეყრდნობა RER = 70 × წონა(კგ)^0.75 ფორმულას, {latestWeight}{" "}
          კგ წონისა და აქტივობის გათვალისწინებით. საბოლოო რაციონი შეათანხმე
          ვეტერინართან.
        </p>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-[var(--brand-primary)]">
          კვების და მადის ჟურნალი
        </h3>
        {pet.food.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="კვების ჩანაწერები ჯერ არ არის"
            body="ჩანაწერები ემატება ჟურნალის „კვება“ ჩანართიდან."
          />
        ) : (
          <>
            <ul className="space-y-2">
              {intake.map((day) => {
                const ratio = target.gramsPerDay
                  ? day.grams / target.gramsPerDay
                  : null;
                return (
                  <li
                    key={day.date}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#FAFAF8] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--brand-primary)]">
                        {day.grams} გ, {day.meals} კვება
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDate(day.date)}
                      </p>
                    </div>
                    {ratio !== null ? (
                      <Chip
                        tone={
                          ratio < 0.8
                            ? "warning"
                            : ratio > 1.2
                              ? "danger"
                              : "success"
                        }
                      >
                        სამიზნის {Math.round(ratio * 100)}%
                      </Chip>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            <ul className="mt-3 space-y-2">
              {pet.food
                .filter((entry) => entry.appetite || entry.digestiveResponse)
                .slice(0, 4)
                .map((entry) => (
                  <li
                    key={entry.id}
                    className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#eceae5] px-4 py-2.5 text-xs text-slate-500"
                  >
                    <span className="font-medium text-[var(--brand-primary)]">
                      {formatDate(entry.date)}
                    </span>
                    {entry.appetite ? (
                      <Chip
                        tone={
                          entry.appetite === "refused" || entry.appetite === "poor"
                            ? "warning"
                            : "neutral"
                        }
                      >
                        მადა, {APPETITE_LABELS[entry.appetite]}
                      </Chip>
                    ) : null}
                    {entry.digestiveResponse ? (
                      <span className="min-w-0 truncate">
                        {entry.digestiveResponse}
                      </span>
                    ) : null}
                  </li>
                ))}
            </ul>
          </>
        )}
      </div>

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
              <div>
                <span className={fieldLabel}>დიეტის ტიპი</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(Object.keys(DIET_LABELS) as DietType[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setType(option)}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                        type === option
                          ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                          : "border-[#e5e7eb] bg-white text-slate-500 hover:border-[var(--brand-primary)]/30"
                      }`}
                    >
                      {DIET_LABELS[option]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={fieldLabel} htmlFor="diet-product">
                    პროდუქტის სახელი
                  </label>
                  <input
                    id="diet-product"
                    value={productName}
                    onChange={(event) => setProductName(event.target.value)}
                    placeholder="Aylopet Chicken & Rice"
                    className={`${textInput} mt-2`}
                  />
                </div>
                <div>
                  <label className={fieldLabel} htmlFor="diet-meals">
                    კვება დღეში
                  </label>
                  <input
                    id="diet-meals"
                    type="number"
                    min="1"
                    max="6"
                    value={mealsPerDay}
                    onChange={(event) => setMealsPerDay(event.target.value)}
                    className={`${textInput} mt-2`}
                  />
                </div>
                <div>
                  <label className={fieldLabel} htmlFor="diet-kcal">
                    kcal / 100 გრამი
                  </label>
                  <input
                    id="diet-kcal"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={kcalPer100g}
                    onChange={(event) => setKcalPer100g(event.target.value)}
                    placeholder="145"
                    className={`${textInput} mt-2`}
                  />
                </div>
              </div>

              {type === "prescription" ? (
                <div>
                  <label className={fieldLabel} htmlFor="diet-reason">
                    დანიშნულების მიზეზი
                  </label>
                  <input
                    id="diet-reason"
                    value={prescriptionReason}
                    onChange={(event) =>
                      setPrescriptionReason(event.target.value)
                    }
                    placeholder="მაგ. თირკმლის მხარდაჭერა"
                    className={`${textInput} mt-2`}
                  />
                </div>
              ) : null}

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

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
    </SectionCard>
  );
}
