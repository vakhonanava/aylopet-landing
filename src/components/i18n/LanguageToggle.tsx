"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n";

const options: { id: Locale; label: string }[] = [
  { id: "ka", label: "GEO" },
  { id: "en", label: "ENG" },
];

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label="Language"
      className={`inline-flex rounded-full border border-[var(--border-light)] bg-white/80 p-0.5 text-xs font-semibold ${className}`}
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setLocale(opt.id)}
          className={`min-h-[32px] cursor-pointer rounded-full px-3 py-1.5 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--brand-primary)] ${
            locale === opt.id
              ? "bg-[var(--brand-primary)] text-white"
              : "text-[var(--text-secondary)] hover:text-[var(--brand-primary)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
