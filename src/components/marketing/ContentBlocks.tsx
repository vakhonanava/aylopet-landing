import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface Metric {
  value: string;
  label: string;
}

export function MetricBadges({ metrics }: { metrics: readonly Metric[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {metrics.map((m) => (
        <span
          key={m.label}
          className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-5 py-2.5 text-sm shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
        >
          <span className="font-bold text-[var(--brand-primary)]">{m.value}</span>
          <span className="text-slate-500">· {m.label}</span>
        </span>
      ))}
    </div>
  );
}

interface ScienceFact {
  title: string;
  body: string;
  cta: string;
  ctaHref: string;
}

export function ScienceFactCards({ facts }: { facts: readonly ScienceFact[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {facts.map((fact, i) => (
        <RevealOnScroll key={fact.title} y={20} delay={0.1 * i}>
          <article className="group flex h-full flex-col rounded-[2rem] border border-[#e5e7eb] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)]">
            <h3 className="text-xl font-bold tracking-tight text-[var(--brand-primary)]">
              {fact.title}
            </h3>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
              {fact.body}
            </p>
            <Link
              href={fact.ctaHref}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-primary)] transition-all group-hover:gap-2.5"
            >
              {fact.cta}
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </article>
        </RevealOnScroll>
      ))}
    </div>
  );
}

interface ProsConsSectionData {
  title: string;
  blocks?: readonly { label: string; text: string }[];
  pros?: readonly string[];
  cons?: readonly string[];
}

export function ProsConsSection({ section }: { section: ProsConsSectionData }) {
  return (
    <article id={section.title} className="scroll-mt-28">
      <h2 className="text-2xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-3xl">
        {section.title}
      </h2>
      {section.blocks?.map((b) => (
        <div key={b.label} className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--brand-accent)]">
            {b.label}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-slate-600">{b.text}</p>
        </div>
      ))}
      {(section.pros || section.cons) && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {section.pros && (
            <div className="rounded-2xl border border-[var(--brand-accent)]/20 bg-[var(--brand-accent)]/[0.04] p-6">
              <h3 className="text-sm font-semibold text-[var(--brand-primary)]">უპირატესობები</h3>
              <ul className="mt-3 space-y-2">
                {section.pros.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-[var(--brand-accent)]">+</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {section.cons && (
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
              <h3 className="text-sm font-semibold text-[var(--brand-primary)]">შეზღუდვები</h3>
              <ul className="mt-3 space-y-2">
                {section.cons.map((c) => (
                  <li key={c} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-slate-400">−</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export function ArticleCard({
  title,
  href,
  description,
}: {
  title: string;
  href: string;
  description?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-[2rem] border border-[#e5e7eb] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)]"
    >
      <h3 className="text-lg font-bold tracking-tight text-[var(--brand-primary)] group-hover:text-[var(--brand-accent)]">
        {title}
      </h3>
      {description && (
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      )}
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-primary)] transition-all group-hover:gap-2.5">
        წაიკითხე
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

export function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)]/[0.06] px-4 py-2 text-sm font-medium text-[var(--brand-primary)]">
      <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--brand-accent)]" />
      {label}
    </span>
  );
}
