"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { ToneClasses } from "@/lib/pet-history/labels";

/** Entrance transition shared by every section card. */
export const sectionMotion = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

interface SectionCardProps {
  id: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
}

export function SectionCard({
  id,
  title,
  description,
  icon: Icon,
  action,
  children,
}: SectionCardProps) {
  return (
    <motion.section
      id={id}
      // Offsets the sticky section nav so anchor jumps don't hide the heading.
      className="scroll-mt-28 rounded-[2rem] border border-[#e5e7eb] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-7"
      {...sectionMotion}
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-primary)]/[0.07] text-[var(--brand-primary)]">
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-bold tracking-tight text-[var(--brand-primary)]">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-sm text-slate-500">{description}</p>
            ) : null}
          </div>
        </div>
        {action}
      </header>
      {children}
    </motion.section>
  );
}

/**
 * Page-level heading for a thematic cluster of SectionCards (e.g. "Health
 * monitoring"). One level louder than a SectionCard's own header — solid
 * icon badge and ink-colored title, rather than the card's tinted badge and
 * brand-colored title — so the two hierarchy levels stay visually distinct.
 */
export function GroupHeader({
  id,
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  id: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      id={id}
      {...sectionMotion}
      className="scroll-mt-28 border-b border-[#eceae5] px-1 pb-5"
    >
      <div className="flex items-start gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-primary)] text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
            სექცია {eyebrow}
          </p>
          <h2 className="mt-0.5 text-xl font-bold tracking-tight text-[#1c1c1c] sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function StatusPill({
  tone,
  label,
}: {
  tone: ToneClasses;
  label?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${tone.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dotClass}`} />
      {label ?? tone.label}
    </span>
  );
}

/** Label/value row used across the passport and detail grids. */
export function DataField({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-[#FAFAF8] px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-[var(--brand-primary)]">
        {value}
      </dd>
      {hint ? <p className="mt-0.5 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

export function MetricTile({
  icon: Icon,
  label,
  value,
  unit,
  sub,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#eceae5] bg-white px-4 py-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--brand-primary)]">
        {value}
        {unit ? (
          <span className="ml-1 text-sm font-medium text-slate-400">{unit}</span>
        ) : null}
      </p>
      {sub ? <p className="mt-0.5 text-xs text-slate-400">{sub}</p> : null}
    </div>
  );
}

/**
 * Shown wherever a feed has no data yet. Deliberately explicit — an empty
 * collar or DNA panel must read as "nothing connected", never as zeroes that
 * could be mistaken for real measurements.
 */
export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#e0ddd6] bg-[#FAFAF8] px-6 py-10 text-center">
      <Icon className="h-8 w-8 text-slate-300" />
      <div>
        <p className="text-sm font-semibold text-slate-600">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-400">{body}</p>
      </div>
      {action}
    </div>
  );
}

export function Chip({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "danger" | "warning" | "success";
}) {
  const classes = {
    neutral: "border-slate-200 bg-slate-50 text-slate-600",
    danger: "border-red-200 bg-red-50 text-red-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  }[tone];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${classes}`}
    >
      {children}
    </span>
  );
}
