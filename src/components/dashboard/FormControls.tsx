"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import {
  ACTIVITY_OPTIONS,
  searchDogBreeds,
  type ActivityLevel,
} from "@/lib/dashboard";

export const fieldLabel = "block text-sm font-medium text-[var(--brand-primary)]";
export const textInput =
  "w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[var(--brand-primary)] outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[var(--brand-primary)]/40 focus:ring-4 focus:ring-[var(--brand-primary)]/5";
export const addButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)]";

/* ----------------------------- Breed Combobox ---------------------------- */

export function BreedCombobox({
  value,
  onChange,
  onBlur,
  error,
  variant = "light",
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  variant?: "light" | "dark";
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => searchDogBreeds(query), [query]);

  const isDark = variant === "dark";

  const triggerClass = isDark
    ? `border-white/10 bg-[#111827]/80 focus:border-cyan-300/40 focus:ring-cyan-300/15 ${
        error ? "border-red-400/50" : ""
      } ${value ? "text-white" : "text-white/40"}`
    : `bg-white focus:ring-[var(--brand-primary)]/5 ${
        error ? "border-red-300" : "border-[#e5e7eb] focus:border-[var(--brand-primary)]/40"
      } ${value ? "text-[var(--brand-primary)]" : "text-slate-400"}`;

  const panelClass = isDark
    ? "border-white/10 bg-[#111827] shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
    : "border-[#e5e7eb] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)]";

  const searchBorderClass = isDark ? "border-white/10" : "border-[#e5e7eb]";
  const searchIconClass = isDark ? "text-white/40" : "text-slate-400";
  const searchInputClass = isDark
    ? "text-white placeholder:text-white/35"
    : "text-[var(--brand-primary)] placeholder:text-slate-400";
  const itemClass = isDark
    ? "text-white hover:bg-cyan-300/10"
    : "text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/[0.05]";
  const subtitleClass = isDark ? "text-white/40" : "text-slate-400";
  const emptyClass = isDark ? "text-white/40" : "text-slate-400";
  const chevronClass = isDark ? "text-white/40" : "text-slate-400";

  const close = () => {
    setOpen(false);
    onBlur?.();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => {
          if (!open) onBlur?.();
        }}
        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm outline-none transition-all duration-200 focus:ring-4 ${triggerClass}`}
      >
        {value || "აირჩიე ჯიში"}
        <ChevronDown
          className={`h-4 w-4 ${chevronClass} transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={close} aria-hidden />
          <div className={`absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border ${panelClass}`}>
            <div className={`flex items-center gap-2 border-b px-3 py-2 ${searchBorderClass}`}>
              <Search className={`h-4 w-4 ${searchIconClass}`} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ძებნა..."
                className={`w-full bg-transparent text-sm outline-none ${searchInputClass}`}
              />
            </div>
            <ul className="max-h-56 overflow-y-auto py-1">
              {filtered.length === 0 && (
                <li className={`px-4 py-3 text-sm ${emptyClass}`}>ვერ მოიძებნა</li>
              )}
              {filtered.map((breed) => (
                <li key={breed.en}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(breed.ka);
                      setOpen(false);
                      setQuery("");
                      onBlur?.();
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${itemClass}`}
                  >
                    <span>
                      <span className="block">{breed.ka}</span>
                      <span className={`block text-xs ${subtitleClass}`}>{breed.en}</span>
                    </span>
                    {value === breed.ka && (
                      <Check
                        className={`h-4 w-4 shrink-0 ${isDark ? "text-cyan-300" : "text-[var(--brand-accent)]"}`}
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* --------------------------- Activity Radio Cards ------------------------- */

export function ActivityRadioCards({
  value,
  onChange,
}: {
  value: ActivityLevel | "";
  onChange: (value: ActivityLevel) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {ACTIVITY_OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-col gap-1 rounded-2xl border p-4 text-left transition-all duration-200 ${
              active
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                : "border-[#e5e7eb] bg-white hover:border-[var(--brand-primary)]/30"
            }`}
          >
            <span className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--brand-primary)]">
                {opt.label}
              </span>
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                  active ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]" : "border-slate-300"
                }`}
              >
                {active && <Check className="h-2.5 w-2.5 text-white" />}
              </span>
            </span>
            <span className="text-xs leading-snug text-slate-500">
              {opt.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------- Text Chip Input ------------------------------ */

export function TextChipInput({
  value,
  onChange,
  placeholder,
  variant = "light",
}: {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  variant?: "light" | "dark";
}) {
  const [draft, setDraft] = useState("");
  const isDark = variant === "dark";

  const commit = () => {
    const trimmed = draft.trim();
    setDraft("");
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
  };

  const remove = (chip: string) => onChange(value.filter((c) => c !== chip));

  return (
    <div
      className={`flex flex-wrap items-center gap-2 rounded-2xl border px-3 py-2.5 transition-all duration-200 focus-within:ring-4 ${
        isDark
          ? "border-white/10 bg-[#111827]/80 focus-within:border-cyan-300/40 focus-within:ring-cyan-300/15"
          : "border-[#e5e7eb] bg-white focus-within:border-[var(--brand-primary)]/40 focus-within:ring-[var(--brand-primary)]/5"
      }`}
    >
      {value.map((chip) => (
        <span
          key={chip}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-primary)] bg-[var(--brand-primary)] px-3 py-1 text-sm font-medium text-white"
        >
          {chip}
          <button
            type="button"
            onClick={() => remove(chip)}
            className="rounded-full transition-opacity hover:opacity-70"
            aria-label={`${chip} წაშლა`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          } else if (e.key === "Backspace" && !draft && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : ""}
        className={`min-w-[8rem] flex-1 bg-transparent text-sm outline-none ${
          isDark
            ? "text-white placeholder:text-white/35"
            : "text-[var(--brand-primary)] placeholder:text-slate-400"
        }`}
      />
    </div>
  );
}
