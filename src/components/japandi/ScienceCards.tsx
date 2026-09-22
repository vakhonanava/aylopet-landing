"use client";

import Link from "next/link";
import { FileDown } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

/** A study link that goes nowhere is worse than none · render it only once real. */
function StudyLink({ href, label }: { href: string; label: string }) {
  if (!href || href === "#") return null;
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-accent)]"
    >
      <FileDown className="h-4 w-4" />
      {label}
    </Link>
  );
}

export function LifespanCard({
  title,
  body,
  cta,
  ctaHref,
  statLabel,
}: {
  title: string;
  body: string;
  cta: string;
  ctaHref: string;
  statLabel: string;
}) {
  return (
    <RevealOnScroll>
      <article className="card-hover group h-full rounded-[var(--radius-bento)] border border-[var(--border-light)] bg-white p-8 shadow-soft">
        <p className="text-5xl font-bold tracking-tight text-[var(--brand-primary)]">
          +32%
        </p>
        <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">
          {statLabel}
        </p>
        <h3 className="mt-6 text-lg font-bold text-[var(--text-primary)]">{title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-body)]">{body}</p>
        <StudyLink href={ctaHref} label={cta} />
      </article>
    </RevealOnScroll>
  );
}

export function DigestionCompareCard({
  title,
  body,
  cta,
  ctaHref,
  moistureLabel,
}: {
  title: string;
  body: string;
  cta: string;
  ctaHref: string;
  moistureLabel: string;
}) {
  return (
    <RevealOnScroll delay={0.1}>
      <article className="card-hover group h-full rounded-[var(--radius-bento)] border border-[var(--border-light)] bg-white p-8 shadow-soft">
        <div className="mb-6 flex items-end justify-center gap-6">
          <div className="text-center">
            <div className="mx-auto h-24 w-14 rounded-t-lg bg-[var(--background-muted)]" />
            <p className="mt-2 text-xs text-[var(--text-tertiary)]">Kibble</p>
            <p className="text-xs font-medium text-[var(--text-secondary)]">~10% {moistureLabel}</p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-32 w-14 rounded-t-lg bg-[var(--brand-accent-soft)] ring-2 ring-[var(--brand-primary)]/20" />
            <p className="mt-2 text-xs font-medium text-[var(--brand-primary)]">Gently Cooked</p>
            <p className="text-xs font-semibold text-[var(--status-emerald)]">~70% {moistureLabel}</p>
          </div>
        </div>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-body)]">{body}</p>
        <StudyLink href={ctaHref} label={cta} />
      </article>
    </RevealOnScroll>
  );
}
