"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import {
  ACTIVITY_OPTIONS,
  TEMPERAMENT_OPTIONS,
  searchDogBreeds,
  type ActivityLevel,
  type Temperament,
} from "@/lib/dashboard";

export const fieldLabel = "block text-sm font-medium text-[var(--brand-primary)]";
export const textInput =
  "w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[var(--brand-primary)] outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[var(--brand-primary)]/40 focus:ring-4 focus:ring-[var(--brand-primary)]/5";

/* ----------------------------- Breed Combobox ---------------------------- */

export function BreedCombobox({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => searchDogBreeds(query), [query]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-2xl border bg-white px-4 py-3 text-left text-sm outline-none transition-all duration-200 focus:ring-4 focus:ring-[var(--brand-primary)]/5 ${
          error ? "border-red-300" : "border-[#e5e7eb] focus:border-[var(--brand-primary)]/40"
        } ${value ? "text-[var(--brand-primary)]" : "text-slate-400"}`}
      >
        {value || "აირჩიე ჯიში"}
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="flex items-center gap-2 border-b border-[#e5e7eb] px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ძებნა..."
                className="w-full bg-transparent text-sm text-[var(--brand-primary)] outline-none placeholder:text-slate-400"
              />
            </div>
            <ul className="max-h-56 overflow-y-auto py-1">
              {filtered.length === 0 && (
                <li className="px-4 py-3 text-sm text-slate-400">
                  ვერ მოიძებნა
                </li>
              )}
              {filtered.map((breed) => (
                <li key={breed.en}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(breed.ka);
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-primary)]/[0.05]"
                  >
                    <span>
                      <span className="block">{breed.ka}</span>
                      <span className="block text-xs text-slate-400">{breed.en}</span>
                    </span>
                    {value === breed.ka && (
                      <Check className="h-4 w-4 shrink-0 text-[var(--brand-accent)]" />
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

/* --------------------------- Temperament Tags ---------------------------- */

export function TemperamentTags({
  value,
  onChange,
}: {
  value: Temperament[];
  onChange: (value: Temperament[]) => void;
}) {
  const toggle = (tag: Temperament) => {
    onChange(
      value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag],
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {TEMPERAMENT_OPTIONS.map((tag) => {
        const active = value.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
              active
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                : "border-[#e5e7eb] bg-white text-slate-600 hover:border-[var(--brand-primary)]/30 hover:text-[var(--brand-primary)]"
            }`}
          >
            {active && <Check className="h-3.5 w-3.5" />}
            {tag}
          </button>
        );
      })}
    </div>
  );
}
