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
import { fieldLabel, textInput } from "@/components/dashboard/FormControls";
import {
  MOOD_SCALE,
  daysUntil,
  formatDate,
  type MealType,
  type Pet,
} from "@/lib/dashboard";

const tabTrigger =
  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition-colors data-[state=active]:bg-[var(--brand-primary)] data-[state=active]:text-white";

const addButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)]";

export function LogbookTabs({ pet }: { pet: Pet }) {
  return (
    <section className="rounded-[2rem] border border-[#e5e7eb] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-7">
      <h2 className="mb-5 text-lg font-bold tracking-tight text-[var(--brand-primary)]">
        ჯანმრთელობა & კეთილდღეობა
      </h2>

      <Tabs.Root defaultValue="vaccines">
        <Tabs.List className="mb-6 flex flex-wrap gap-1.5 rounded-full border border-[#e5e7eb] bg-[#FAFAF8] p-1.5">
          <Tabs.Trigger value="vaccines" className={tabTrigger}>
            <Syringe className="h-4 w-4" /> ვაქცინები
          </Tabs.Trigger>
          <Tabs.Trigger value="supplements" className={tabTrigger}>
            <Pill className="h-4 w-4" /> დანამატები
          </Tabs.Trigger>
          <Tabs.Trigger value="food" className={tabTrigger}>
            <UtensilsCrossed className="h-4 w-4" /> საკვები
          </Tabs.Trigger>
          <Tabs.Trigger value="mood" className={tabTrigger}>
            <Activity className="h-4 w-4" /> ხასიათი
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
  const { addVaccine } = useDashboard();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [administered, setAdministered] = useState("");
  const [nextDue, setNextDue] = useState("");

  const submit = () => {
    if (!name || !administered) return;
    addVaccine(pet.id, { name, administered, nextDue });
    setName("");
    setAdministered("");
    setNextDue("");
    setOpen(false);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">ვაქცინაციის ისტორია და გრაფიკი</p>
        <button className={addButton} onClick={() => setOpen((o) => !o)}>
          <Plus className="h-4 w-4" /> დამატება
        </button>
      </div>

      {open && (
        <div className="mb-6 grid gap-3 rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5 sm:col-span-3">
            <label className={fieldLabel}>ვაქცინის სახელი</label>
            <input
              className={textInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="მაგ. ცოფის ვაქცინა"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel}>ჩატარების თარიღი</label>
            <input
              type="date"
              className={textInput}
              value={administered}
              onChange={(e) => setAdministered(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel}>შემდეგი თარიღი</label>
            <input
              type="date"
              className={textInput}
              value={nextDue}
              onChange={(e) => setNextDue(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button className={addButton} onClick={submit}>
              <Check className="h-4 w-4" /> შენახვა
            </button>
          </div>
        </div>
      )}

      {/* Vertical timeline */}
      <ol className="relative ml-3 border-l border-[#e5e7eb]">
        {pet.vaccines.length === 0 && (
          <li className="ml-6 py-4 text-sm text-slate-400">
            ჯერ არ არის ჩანაწერი.
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
                    <h4 className="font-semibold text-[var(--brand-primary)]">{v.name}</h4>
                    <p className="mt-0.5 text-xs text-slate-400">
                      ჩატარდა: {formatDate(v.administered)}
                    </p>
                  </div>
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
                        ? `ვადაგადაცილებული · ${formatDate(v.nextDue)}`
                        : soon
                          ? `მალე (${due} დღე) · ${formatDate(v.nextDue)}`
                          : `შემდეგი: ${formatDate(v.nextDue)}`}
                    </span>
                  )}
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
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");

  const submit = () => {
    if (!name) return;
    addSupplement(pet.id, { name, dosage, frequency, givenToday: false });
    setName("");
    setDosage("");
    setFrequency("");
    setOpen(false);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">ყოველდღიური დანამატების ჩეკლისტი</p>
        <button className={addButton} onClick={() => setOpen((o) => !o)}>
          <Plus className="h-4 w-4" /> დამატება
        </button>
      </div>

      {open && (
        <div className="mb-6 grid gap-3 rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-4 sm:grid-cols-3">
          <input
            className={textInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="დანამატის სახელი"
          />
          <input
            className={textInput}
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="დოზა (მაგ. 1 აბი, 5ml)"
          />
          <input
            className={textInput}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder="სიხშირე"
          />
          <div className="sm:col-span-3">
            <button className={addButton} onClick={submit}>
              <Check className="h-4 w-4" /> შენახვა
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {pet.supplements.length === 0 && (
          <p className="py-4 text-sm text-slate-400">ჯერ არ არის ჩანაწერი.</p>
        )}
        {pet.supplements.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => toggleSupplement(pet.id, s.id)}
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
                {s.dosage} · {s.frequency}
              </span>
            </span>
            <span
              className={`text-xs font-medium ${s.givenToday ? "text-[var(--brand-accent)]" : "text-slate-400"}`}
            >
              {s.givenToday ? "მიცემულია" : "დღეს?"}
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
  const [open, setOpen] = useState(false);
  const [mealType, setMealType] = useState<MealType>("morning");
  const [brand, setBrand] = useState("Aylopet");
  const [isAylopet, setIsAylopet] = useState(true);
  const [portion, setPortion] = useState("");
  const [response, setResponse] = useState("");

  const submit = () => {
    if (!portion) return;
    addFood(pet.id, {
      date: new Date().toISOString().slice(0, 10),
      mealType,
      brand: isAylopet ? "Aylopet" : brand || "სხვა",
      isAylopet,
      portionGrams: Number(portion),
      digestiveResponse: response || undefined,
    });
    setPortion("");
    setResponse("");
    setOpen(false);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">კვების ჩანაწერები</p>
        <button className={addButton} onClick={() => setOpen((o) => !o)}>
          <Plus className="h-4 w-4" /> დამატება
        </button>
      </div>

      {open && (
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className={fieldLabel}>კვების ტიპი</label>
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
                    {m === "morning" ? "დილა" : "საღამო"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={fieldLabel}>პორცია (გრამი)</label>
              <input
                type="number"
                className={textInput}
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel}>ბრენდი</label>
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
                სხვა
              </button>
            </div>
            {!isAylopet && (
              <input
                className={`${textInput} mt-2`}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="ბრენდის სახელი"
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel}>
              საჭმლის მონელება (არასავალდებულო)
            </label>
            <textarea
              className={`${textInput} min-h-20 resize-none`}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="მაგ. ნორმალური განავალი, კუჭის აშლილობა..."
            />
          </div>

          <button className={addButton} onClick={submit}>
            <Check className="h-4 w-4" /> შენახვა
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {pet.food.length === 0 && (
          <p className="py-4 text-sm text-slate-400">ჯერ არ არის ჩანაწერი.</p>
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
                    {f.mealType === "morning" ? "დილის კვება" : "საღამოს კვება"}
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
                  {f.portionGrams}გ
                </span>
              </div>
            </div>
            {f.digestiveResponse && (
              <p className="mt-3 rounded-xl bg-[#FAFAF8] px-3 py-2 text-sm text-slate-600">
                <span className="font-medium text-[var(--brand-primary)]">მონელება:</span>{" "}
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
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(50);
  const [notes, setNotes] = useState("");

  const submit = () => {
    addMood(pet.id, {
      date: new Date().toISOString().slice(0, 10),
      mood,
      energy,
      notes: notes || undefined,
    });
    setMood(3);
    setEnergy(50);
    setNotes("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Daily check-in card */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-gradient-to-br from-[#FAFAF8] to-white p-5 sm:p-6">
        <h3 className="text-base font-bold text-[var(--brand-primary)]">დღევანდელი ჩექ-ინი</h3>
        <p className="mt-1 text-sm text-slate-500">როგორ გრძნობს თავს {pet.name}?</p>

        {/* Mood scale */}
        <div className="mt-5">
          <label className={fieldLabel}>განწყობა</label>
          <div className="mt-2 flex justify-between gap-2">
            {MOOD_SCALE.map((m) => (
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
            <label className={fieldLabel}>ენერგიის დონე</label>
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
              aria-label="ენერგია"
            />
          </Slider.Root>
        </div>

        {/* Notes */}
        <div className="mt-6 flex flex-col gap-1.5">
          <label className={fieldLabel}>შენიშვნები</label>
          <textarea
            className={`${textInput} min-h-20 resize-none`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="მაგ. დღეს უჩვეულოდ ლეთარგიული იყო"
          />
        </div>

        <button className={`${addButton} mt-4`} onClick={submit}>
          <Check className="h-4 w-4" /> ჩექ-ინის შენახვა
        </button>
      </div>

      {/* History */}
      <div className="flex flex-col gap-3">
        {pet.moods.map((entry) => {
          const m = MOOD_SCALE.find((x) => x.value === entry.mood);
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
                  <span className="text-xs text-slate-400">ენერგია</span>
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
