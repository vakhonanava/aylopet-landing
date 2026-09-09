"use client";

import { FileDown } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

/**
 * Both research cards sit in the same grid row, so they share a height. Laying
 * each one out as a flex column with an `mt-auto` CTA keeps the two download
 * links on the same baseline instead of leaving one floating mid-card, and the
 * fixed-height visual header keeps the headings aligned across the pair.
 */
const cardClass =
  "card-hover group flex h-full flex-col rounded-[var(--radius-bento)] border border-[var(--border-light)] bg-white p-6 shadow-soft sm:p-8";

const ctaClass =
  "mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-accent)]";

interface ResearchCardProps {
  title: string;
  body: string;
  cta: string;
  /** Path to the study PDF under `public/`. Empty means "not published yet". */
  ctaHref: string;
  /** Shown in place of the download link while no document is attached. */
  ctaPending: string;
}

/**
 * The study PDFs are served as static files, so the link needs an explicit
 * `download` plus a new tab — an `href="#"` placeholder simply swallowed the
 * click. When no document is configured the CTA degrades to plain text rather
 * than rendering a dead link.
 */
function ResearchLink({
  cta,
  ctaHref,
  ctaPending,
}: Pick<ResearchCardProps, "cta" | "ctaHref" | "ctaPending">) {
  if (!ctaHref) {
    return (
      <p className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-[var(--text-tertiary)]">
        <FileDown className="h-4 w-4 shrink-0" aria-hidden />
        {ctaPending}
      </p>
    );
  }

  return (
    <a
      href={ctaHref}
      download
      target="_blank"
      rel="noopener noreferrer"
      className={ctaClass}
    >
      <FileDown className="h-4 w-4 shrink-0" aria-hidden />
      {cta}
    </a>
  );
}

export function LifespanCard({
  title,
  body,
  cta,
  ctaHref,
  ctaPending,
}: ResearchCardProps) {
  return (
    <RevealOnScroll className="h-full">
      <article className={cardClass}>
        <div className="flex h-32 flex-col justify-center">
          <p className="text-5xl font-bold leading-none tracking-tight text-[var(--brand-primary)]">
            +32%
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">
            სიცოცხლის ხანგრძლივობის ზრდა
          </p>
        </div>
        <h3 className="mt-6 text-lg font-bold text-[var(--text-primary)]">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-body)]">
          {body}
        </p>
        <div className="mt-auto">
          <ResearchLink cta={cta} ctaHref={ctaHref} ctaPending={ctaPending} />
        </div>
      </article>
    </RevealOnScroll>
  );
}

export function DigestionCompareCard({
  title,
  body,
  cta,
  ctaHref,
  ctaPending,
}: ResearchCardProps) {
  return (
    <RevealOnScroll className="h-full" delay={0.1}>
      <article className={cardClass}>
        {/* Each column reserves enough width for its caption — the bars are
            narrower than the labels under them, so sizing the column to the
            bar made "Gently Cooked" wrap mid-word. */}
        <div className="flex h-32 justify-center gap-8">
          <div className="flex w-[6.5rem] shrink-0 flex-col">
            <div className="flex flex-1 items-end justify-center">
              <div className="h-12 w-12 rounded-t-lg bg-[var(--background-muted)]" />
            </div>
            <p className="mt-2 text-center text-xs text-[var(--text-tertiary)]">
              Kibble
            </p>
            <p className="text-center text-xs font-medium text-[var(--text-secondary)]">
              ~10% ტენი
            </p>
          </div>
          <div className="flex w-[6.5rem] shrink-0 flex-col">
            <div className="flex flex-1 items-end justify-center">
              <div className="h-20 w-12 rounded-t-lg bg-[var(--brand-accent-soft)] ring-2 ring-[var(--brand-primary)]/20" />
            </div>
            <p className="mt-2 text-center text-xs font-medium text-[var(--brand-primary)]">
              Gently Cooked
            </p>
            <p className="text-center text-xs font-semibold text-[var(--status-emerald)]">
              ~70% ტენი
            </p>
          </div>
        </div>
        <h3 className="mt-6 text-lg font-bold text-[var(--text-primary)]">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-body)]">
          {body}
        </p>
        <div className="mt-auto">
          <ResearchLink cta={cta} ctaHref={ctaHref} ctaPending={ctaPending} />
        </div>
      </article>
    </RevealOnScroll>
  );
}
