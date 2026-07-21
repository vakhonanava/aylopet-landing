"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useOnboardingQuiz } from "@/hooks/useOnboardingQuiz";
import { motionEase } from "@/lib/motion";
import {
  ACTIVITY_OPTIONS,
  APPETITE_OPTIONS,
  BODY_CONDITION_OPTIONS,
  BREED_SUGGESTIONS,
  CITY_SUGGESTIONS,
  CURRENT_DIET_OPTIONS,
  GENDER_ICONS,
  GOAL_OPTIONS,
  buildNutritionRecommendation,
  getQuizCopy,
  getStepCopy,
  type OnboardingQuizState,
} from "@/lib/onboarding/quiz-steps";

const inputClass =
  "w-full rounded-xl border border-[var(--ob-border)] bg-[var(--ob-surface-raised)] px-4 py-3 text-[15px] text-[var(--ob-text-primary)] outline-none transition-all duration-300 placeholder:text-[var(--ob-text-tertiary)] focus:border-[var(--ob-accent)]/60 focus:ring-2 focus:ring-[var(--ob-accent)]/15";

const errorInputClass = "border-[var(--ob-danger)]/70 focus:border-[var(--ob-danger)]";

export function OnboardingWizard() {
  const { locale, dict } = useLocale();
  const quiz = useOnboardingQuiz();
  const copy = getQuizCopy(locale);

  if (quiz.completed) {
    return <CompletionScreen state={quiz.state} onRestart={quiz.restart} />;
  }

  const stepCopy = getStepCopy(quiz.step, locale, quiz.state);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-widest text-[var(--ob-text-tertiary)]">
          <span>
            {copy.nav.stepLabel} {quiz.step} {copy.nav.ofLabel} {quiz.totalSteps}
          </span>
          <span>{Math.round(quiz.progress)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--ob-surface-raised)]">
          <motion.div
            className="h-full rounded-full bg-[var(--ob-accent)]"
            animate={{ width: `${quiz.progress}%` }}
            transition={{ duration: 0.45, ease: motionEase }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait" custom={quiz.direction} initial={false}>
        <motion.div
          key={quiz.step}
          custom={quiz.direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: motionEase }}
          className="rounded-3xl border border-[var(--ob-border)] bg-[var(--ob-surface)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8"
        >
          <h2 className="font-display text-xl font-semibold leading-snug text-[var(--ob-text-primary)] sm:text-2xl">
            {stepCopy.title}
          </h2>

          <div className="mt-7">
            <StepBody quiz={quiz} locale={locale} copy={copy} />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={quiz.back}
          disabled={quiz.step === 1}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-[var(--ob-text-secondary)] transition-colors duration-300 hover:text-[var(--ob-text-primary)] disabled:cursor-not-allowed disabled:opacity-25"
        >
          <ChevronLeft className="h-4 w-4" />
          {copy.nav.back}
        </button>
        <button
          type="button"
          onClick={quiz.next}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--ob-accent)] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--ob-accent)]/90 active:scale-[0.98]"
        >
          {quiz.step < quiz.totalSteps ? copy.nav.continue : copy.nav.finish}
          {quiz.step < quiz.totalSteps ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </button>
      </div>
      {quiz.touched && !quiz.canAdvance && (
        <p className="mt-3 text-center text-xs text-[var(--ob-danger)]">
          {copy.errors.required}
        </p>
      )}
      <p className="mt-6 text-center text-[11px] text-[var(--ob-text-tertiary)]">
        {dict.quizGate.waitingNote}
      </p>
    </div>
  );
}

const slideVariants = {
  enter: (dir: 1 | -1) => ({ opacity: 0, x: dir * 24 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: 1 | -1) => ({ opacity: 0, x: dir * -24 }),
};

function StepBody({
  quiz,
  locale,
  copy,
}: {
  quiz: ReturnType<typeof useOnboardingQuiz>;
  locale: "ka" | "en";
  copy: ReturnType<typeof getQuizCopy>;
}) {
  const { step, state, patch, touched, canAdvance } = quiz;
  const showError = touched && !canAdvance;

  switch (step) {
    case 1:
      return (
        <TextInput
          value={state.userName}
          onChange={(v) => patch({ userName: v })}
          placeholder={copy.fields.namePlaceholder}
          error={showError}
          autoFocus
        />
      );
    case 2:
      return (
        <div className="flex flex-col gap-4">
          <Field label={copy.fields.emailLabel}>
            <input
              type="email"
              className={`${inputClass} ${showError ? errorInputClass : ""}`}
              value={state.email}
              onChange={(e) => patch({ email: e.target.value })}
              placeholder={copy.fields.emailPlaceholder}
              autoFocus
            />
          </Field>
          <Field label={copy.fields.phoneLabel}>
            <input
              type="tel"
              className={`${inputClass} ${showError ? errorInputClass : ""}`}
              value={state.phone}
              onChange={(e) => patch({ phone: e.target.value })}
              placeholder={copy.fields.phonePlaceholder}
            />
          </Field>
          {showError && (
            <p className="text-xs text-[var(--ob-danger)]">
              {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())
                ? copy.errors.email
                : copy.errors.phone}
            </p>
          )}
        </div>
      );
    case 3:
      return (
        <AutocompleteInput
          value={state.city}
          onChange={(v) => patch({ city: v })}
          placeholder={copy.fields.cityPlaceholder}
          suggestions={CITY_SUGGESTIONS[locale]}
          error={showError}
        />
      );
    case 4:
      return (
        <Counter
          value={state.dogCount}
          onChange={(v) => patch({ dogCount: v })}
          min={1}
          max={12}
          unitLabel={copy.fields.dogsLabel}
        />
      );
    case 5:
      return (
        <TextInput
          value={state.dogName}
          onChange={(v) => patch({ dogName: v })}
          placeholder={copy.fields.dogNamePlaceholder}
          error={showError}
          autoFocus
        />
      );
    case 6:
      return (
        <div className="grid grid-cols-2 gap-4">
          <Field label={copy.fields.yearsLabel}>
            <input
              type="number"
              min={0}
              max={30}
              className={`${inputClass} ${showError ? errorInputClass : ""}`}
              value={state.ageYears ?? ""}
              onChange={(e) =>
                patch({ ageYears: e.target.value === "" ? null : Number(e.target.value) })
              }
            />
          </Field>
          <Field label={copy.fields.monthsLabel}>
            <input
              type="number"
              min={0}
              max={11}
              className={`${inputClass} ${showError ? errorInputClass : ""}`}
              value={state.ageMonths ?? ""}
              onChange={(e) =>
                patch({ ageMonths: e.target.value === "" ? null : Number(e.target.value) })
              }
            />
          </Field>
        </div>
      );
    case 7:
      return (
        <BinaryCards
          selected={state.gender}
          onSelect={(v) => patch({ gender: v })}
          options={[
            { value: "male" as const, label: copy.gender.male, icon: GENDER_ICONS.male },
            { value: "female" as const, label: copy.gender.female, icon: GENDER_ICONS.female },
          ]}
        />
      );
    case 8:
      return (
        <BinaryCards
          selected={state.neutered}
          onSelect={(v) => patch({ neutered: v })}
          options={[
            { value: "yes" as const, label: copy.yesNo.yes, icon: Check },
            { value: "no" as const, label: copy.yesNo.no, icon: Minus },
          ]}
        />
      );
    case 9:
      return (
        <AutocompleteInput
          value={state.breed}
          onChange={(v) => patch({ breed: v })}
          placeholder={copy.fields.breedPlaceholder}
          suggestions={BREED_SUGGESTIONS}
          error={showError}
        />
      );
    case 10:
      return (
        <div className="relative">
          <input
            type="number"
            min={0.5}
            step={0.1}
            className={`${inputClass} pr-14 ${showError ? errorInputClass : ""}`}
            value={state.weightKg ?? ""}
            onChange={(e) =>
              patch({ weightKg: e.target.value === "" ? null : Number(e.target.value) })
            }
            placeholder={copy.fields.weightPlaceholder}
            autoFocus
          />
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-[var(--ob-text-tertiary)]">
            {copy.fields.weightUnit}
          </span>
        </div>
      );
    case 11:
      return (
        <OptionGrid
          selected={state.bodyCondition}
          onSelect={(v) => patch({ bodyCondition: v })}
          options={BODY_CONDITION_OPTIONS.map((o) => ({
            value: o.value,
            icon: o.icon,
            label: copy.bodyCondition[o.value],
          }))}
        />
      );
    case 12:
      return (
        <OptionGrid
          selected={state.activity}
          onSelect={(v) => patch({ activity: v })}
          options={ACTIVITY_OPTIONS.map((o) => ({
            value: o.value,
            icon: o.icon,
            label: copy.activity[o.value],
          }))}
        />
      );
    case 13:
      return (
        <OptionGrid
          selected={state.appetite}
          onSelect={(v) => patch({ appetite: v })}
          options={APPETITE_OPTIONS.map((o) => ({
            value: o.value,
            icon: o.icon,
            label: copy.appetite[o.value],
          }))}
        />
      );
    case 14:
      return (
        <OptionGrid
          selected={state.currentDiet}
          onSelect={(v) => patch({ currentDiet: v })}
          options={CURRENT_DIET_OPTIONS.map((o) => ({
            value: o.value,
            icon: o.icon,
            label: copy.currentDiet[o.value],
          }))}
        />
      );
    case 15:
      return (
        <div>
          <TextInput
            value={state.brand}
            onChange={(v) => patch({ brand: v })}
            placeholder={copy.fields.brandPlaceholder}
            autoFocus
          />
          <span className="mt-2 inline-block rounded-full bg-[var(--ob-surface-raised)] px-2.5 py-1 text-[11px] font-medium text-[var(--ob-text-tertiary)]">
            {copy.fields.optionalBadge}
          </span>
        </div>
      );
    case 16:
      return (
        <div>
          <textarea
            className={`${inputClass} min-h-[110px] resize-y`}
            value={state.healthNotes}
            onChange={(e) => patch({ healthNotes: e.target.value })}
            placeholder={copy.fields.healthPlaceholder}
            autoFocus
          />
          <span className="mt-2 inline-block rounded-full bg-[var(--ob-surface-raised)] px-2.5 py-1 text-[11px] font-medium text-[var(--ob-text-tertiary)]">
            {copy.fields.optionalBadge}
          </span>
        </div>
      );
    case 17:
      return (
        <OptionGrid
          selected={state.primaryGoal}
          onSelect={(v) => patch({ primaryGoal: v })}
          options={GOAL_OPTIONS.map((o) => ({
            value: o.value,
            icon: o.icon,
            label: copy.goal[o.value],
          }))}
        />
      );
    default:
      return null;
  }
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--ob-text-tertiary)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  error,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <input
      type="text"
      autoFocus={autoFocus}
      className={`${inputClass} ${error ? errorInputClass : ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function AutocompleteInput({
  value,
  onChange,
  placeholder,
  suggestions,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  suggestions: readonly string[];
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return suggestions.slice(0, 6);
    return suggestions.filter((s) => s.toLowerCase().includes(q)).slice(0, 6);
  }, [value, suggestions]);

  return (
    <div className="relative">
      <input
        type="text"
        autoFocus
        autoComplete="off"
        className={`${inputClass} ${error ? errorInputClass : ""}`}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        placeholder={placeholder}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-xl border border-[var(--ob-border-strong)] bg-[var(--ob-surface-raised)] shadow-lg">
          {filtered.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className="block w-full cursor-pointer px-4 py-2.5 text-left text-sm text-[var(--ob-text-secondary)] transition-colors duration-150 hover:bg-[var(--ob-accent)]/10 hover:text-[var(--ob-text-primary)]"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Counter({
  value,
  onChange,
  min,
  max,
  unitLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unitLabel: string;
}) {
  return (
    <div className="flex items-center justify-center gap-6">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--ob-border-strong)] text-[var(--ob-text-primary)] transition-colors duration-200 hover:border-[var(--ob-accent)]/60 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className="flex min-w-[88px] flex-col items-center">
        <span className="font-display text-4xl font-semibold text-[var(--ob-text-primary)]">
          {value}
        </span>
        <span className="mt-1 text-xs uppercase tracking-wide text-[var(--ob-text-tertiary)]">
          {unitLabel}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--ob-border-strong)] text-[var(--ob-text-primary)] transition-colors duration-200 hover:border-[var(--ob-accent)]/60 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function BinaryCards<T extends string>({
  selected,
  onSelect,
  options,
}: {
  selected: T | null;
  onSelect: (v: T) => void;
  options: { value: T; label: string; icon: ComponentType<{ className?: string }> }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`flex flex-col items-center gap-3 rounded-2xl border px-4 py-6 text-center transition-all duration-300 ${
              isSelected
                ? "border-[var(--ob-accent)] bg-[var(--ob-accent-soft)] shadow-[0_8px_28px_rgba(223,106,65,0.18)]"
                : "border-[var(--ob-border)] bg-[var(--ob-surface-raised)] hover:border-[var(--ob-border-strong)]"
            }`}
          >
            <Icon
              className={`h-6 w-6 ${isSelected ? "text-[var(--ob-accent)]" : "text-[var(--ob-text-tertiary)]"}`}
            />
            <span
              className={`text-sm font-semibold ${isSelected ? "text-[var(--ob-text-primary)]" : "text-[var(--ob-text-secondary)]"}`}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function OptionGrid<T extends string>({
  selected,
  onSelect,
  options,
}: {
  selected: T | null;
  onSelect: (v: T) => void;
  options: { value: T; label: string; icon: ComponentType<{ className?: string }> }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
              isSelected
                ? "border-[var(--ob-accent)] bg-[var(--ob-accent-soft)] shadow-[0_8px_28px_rgba(223,106,65,0.18)]"
                : "border-[var(--ob-border)] bg-[var(--ob-surface-raised)] hover:border-[var(--ob-border-strong)]"
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isSelected ? "bg-[var(--ob-accent)]/20" : "bg-white/5"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${isSelected ? "text-[var(--ob-accent)]" : "text-[var(--ob-text-tertiary)]"}`}
              />
            </span>
            <span
              className={`text-sm font-semibold leading-snug ${isSelected ? "text-[var(--ob-text-primary)]" : "text-[var(--ob-text-secondary)]"}`}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CompletionScreen({
  state,
  onRestart,
}: {
  state: OnboardingQuizState;
  onRestart: () => void;
}) {
  const { locale } = useLocale();
  const copy = getQuizCopy(locale);
  useEffect(() => {
    try {
      window.localStorage.setItem(
        "aylopet-onboarding-quiz.v1",
        JSON.stringify({ ...state, completedAt: new Date().toISOString() }),
      );
    } catch {
      // ignore storage errors
    }
  }, [state]);

  const summary: { label: string; value: string }[] = [
    { label: copy.complete.dogLabel, value: state.dogName },
    { label: copy.complete.breedLabel, value: state.breed },
    {
      label: copy.complete.weightLabel,
      value: state.weightKg ? `${state.weightKg} ${copy.fields.weightUnit}` : "·",
    },
    { label: copy.complete.goalLabel, value: state.primaryGoal ? copy.goal[state.primaryGoal] : "·" },
  ];

  const recommendation = buildNutritionRecommendation(state, locale);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: motionEase }}
      className="mx-auto w-full max-w-lg rounded-3xl border border-[var(--ob-border)] bg-[var(--ob-surface)] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-10"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ob-accent-soft)]">
        <Check className="h-7 w-7 text-[var(--ob-accent)]" />
      </span>
      <h2 className="mt-5 font-display text-2xl font-semibold text-[var(--ob-text-primary)] sm:text-3xl">
        {copy.complete.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ob-text-secondary)]">
        {copy.complete.subtitle}
      </p>

      <div className="mt-7 rounded-2xl border border-[var(--ob-border)] bg-[var(--ob-surface-raised)] p-5 text-left">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--ob-text-tertiary)]">
          {copy.complete.summaryTitle}
        </p>
        <dl className="grid grid-cols-2 gap-3">
          {summary.map((item) => (
            <div key={item.label}>
              <dt className="text-[11px] uppercase tracking-wide text-[var(--ob-text-tertiary)]">
                {item.label}
              </dt>
              <dd className="mt-0.5 truncate text-sm font-medium text-[var(--ob-text-primary)]">
                {item.value || "·"}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--ob-accent)]/25 bg-[var(--ob-accent-soft)] p-5 text-left">
        <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--ob-accent)]">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {copy.complete.recommendationTitle}
        </p>
        <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--ob-text-secondary)]">
          {recommendation}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/products/aylopet-ai#chat"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[var(--ob-accent)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--ob-accent)]/90"
        >
          {copy.complete.ctaChat}
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--ob-border-strong)] px-6 py-3 text-sm font-medium text-[var(--ob-text-secondary)] transition-colors duration-300 hover:text-[var(--ob-text-primary)]"
        >
          {copy.complete.ctaHome}
        </Link>
      </div>
      <button
        type="button"
        onClick={onRestart}
        className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ob-text-tertiary)] transition-colors duration-300 hover:text-[var(--ob-text-primary)]"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        {copy.complete.restart}
      </button>
    </motion.div>
  );
}
