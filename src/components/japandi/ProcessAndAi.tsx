"use client";

import { useState } from "react";
import { Thermometer } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const STEPS: Record<"ka" | "en", { label: string; short: string; tooltip?: boolean }[]> = {
  ka: [
    { label: "ვარჩევთ პროდუქტებს", short: "1" },
    { label: "ვასუფთავებთ", short: "2" },
    { label: "ვაქცევთ ფარშად", short: "3" },
    { label: "ვფუთავთ", short: "4" },
    { label: "პასტერიზაცია", short: "5", tooltip: true },
    { label: "გაყინვა", short: "6" },
  ],
  en: [
    { label: "Select products", short: "1" },
    { label: "Clean", short: "2" },
    { label: "Mince", short: "3" },
    { label: "Package", short: "4" },
    { label: "Pasteurization", short: "5", tooltip: true },
    { label: "Freeze", short: "6" },
  ],
};

const PASTEURIZATION_TOOLTIP: Record<"ka" | "en", string> = {
  ka: "75 to 80°C, 1 to 6 სთ, სალმონელა, ლისტერია, ე. კოლი",
  en: "75 to 80°C, 1 to 6 hrs, Salmonella, Listeria, E. coli",
};

export function ProcessTimeline({ locale = "ka" }: { locale?: "ka" | "en" }) {
  const [activeTip, setActiveTip] = useState<number | null>(null);
  const steps = STEPS[locale];

  return (
    <RevealOnScroll className="mx-auto max-w-6xl overflow-x-auto px-6 pb-12 lg:px-8">
      <div className="relative flex min-w-[640px] items-start justify-between gap-2">
        <div className="absolute left-8 right-8 top-5 h-px bg-[var(--border-light)]" />
        {steps.map((step, i) => (
          <div key={step.label} className="relative flex flex-1 flex-col items-center text-center">
            <button
              type="button"
              onMouseEnter={() => "tooltip" in step && step.tooltip && setActiveTip(i)}
              onMouseLeave={() => setActiveTip(null)}
              onFocus={() => "tooltip" in step && step.tooltip && setActiveTip(i)}
              onBlur={() => setActiveTip(null)}
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 ${
                i === 4
                  ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-soft"
                  : "border-[var(--border-light)] bg-white text-[var(--brand-primary)] hover:border-[var(--brand-primary)]"
              }`}
            >
              {step.short}
            </button>
            <p className="mt-3 max-w-[88px] text-xs leading-snug text-[var(--text-secondary)]">
              {step.label}
            </p>
            {activeTip === i && (
              <div className="absolute top-14 z-20 w-48 rounded-xl border border-[var(--border-light)] bg-white p-3 text-left text-xs leading-relaxed text-[var(--text-body)] shadow-[var(--shadow-card-hover)]">
                {PASTEURIZATION_TOOLTIP[locale]}
              </div>
            )}
          </div>
        ))}
      </div>
    </RevealOnScroll>
  );
}

const PASTEURIZATION_TITLE: Record<"ka" | "en", string> = {
  ka: "პასტერიზაცია",
  en: "Pasteurization",
};

export function PasteurizationCard({
  text,
  locale = "ka",
}: {
  text: string;
  locale?: "ka" | "en";
}) {
  return (
    <RevealOnScroll className="mx-auto max-w-3xl px-6 pb-16 lg:px-8">
      <article className="rounded-[var(--radius-bento)] border border-[var(--brand-primary)]/15 bg-[var(--brand-accent-soft)] p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-white text-[var(--brand-primary)] shadow-soft">
            <Thermometer className="h-6 w-6" />
            <span className="mt-0.5 text-[10px] font-bold">75 to 80°C</span>
          </span>
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {PASTEURIZATION_TITLE[locale]}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-body)]">{text}</p>
          </div>
        </div>
      </article>
    </RevealOnScroll>
  );
}

export function GlassTeamPlaceholder({ status, body }: { status: string; body: string }) {
  return (
    <RevealOnScroll className="mx-auto max-w-2xl px-6 pb-24 lg:px-8">
      <div className="glass relative overflow-hidden rounded-[var(--radius-bento)] p-12 text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-[var(--brand-accent-soft)]/30" />
        <p className="relative text-lg font-semibold text-[var(--brand-primary)]">{status}</p>
        <p className="relative mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">{body}</p>
      </div>
    </RevealOnScroll>
  );
}

const DASHBOARD_ROWS: Record<"ka" | "en", string[]> = {
  ka: ["წონა, 12 kg", "აქტივობა, მაღალი", "ალერგია, არა"],
  en: ["Weight, 12 kg", "Activity, High", "Allergies, None"],
};

const DASHBOARD_PLAN_LABEL: Record<"ka" | "en", string> = {
  ka: "პერსონალური გეგმა მზადაა",
  en: "Personalized plan ready",
};

export function AiDashboardMock({ locale = "ka" }: { locale?: "ka" | "en" }) {
  return (
    <RevealOnScroll className="mx-auto max-w-lg px-6 lg:px-0">
      <div className="rounded-[var(--radius-bento)] border border-[var(--border-light)] bg-white p-6 shadow-[var(--shadow-diffuse)]">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            AylopetAI
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[var(--status-emerald)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-emerald)]" />
            Live
          </span>
        </div>
        <div className="space-y-3">
          {DASHBOARD_ROWS[locale].map((row) => (
            <div
              key={row}
              className="rounded-xl bg-[var(--background-main)] px-4 py-3 text-sm text-[var(--text-body)]"
            >
              {row}
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-dashed border-[var(--brand-primary)]/25 bg-[var(--brand-accent-soft)]/50 p-4">
          <p className="text-xs text-[var(--text-secondary)]">{DASHBOARD_PLAN_LABEL[locale]}</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full w-full rounded-full bg-[var(--brand-primary)]" />
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}
