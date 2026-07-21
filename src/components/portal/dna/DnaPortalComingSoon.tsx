"use client";

import Link from "next/link";
import { Dna, Sparkles } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";

export function DnaPortalComingSoon() {
  const { dict } = useLocale();
  const copy = dict.dnaPortal;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--forest-deep)] text-[var(--bone-alabaster)]">
            <Dna className="h-5 w-5" />
          </span>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
              <Sparkles className="h-3 w-3" aria-hidden />
              {copy.badge}
            </span>
            <h1 className="mt-2 font-display text-2xl font-semibold text-[var(--forest-deep)] sm:text-3xl">
              {copy.title}
            </h1>
          </div>
        </div>
        <LanguageToggle className="shrink-0" />
      </div>

      <p className="max-w-2xl text-sm leading-relaxed text-[var(--forest-deep)]/70">
        {copy.description}
      </p>

      <ul className="grid gap-3 sm:grid-cols-3">
        {copy.features.map((feature) => (
          <li
            key={feature}
            className="rounded-xl border border-[var(--oat-soft)] bg-white px-4 py-3 text-sm text-[var(--forest-deep)]"
          >
            {feature}
          </li>
        ))}
      </ul>

      <p className="text-xs text-[var(--forest-deep)]/50">{copy.note}</p>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/early-access"
          className="rounded-full bg-[var(--brand-primary)] px-6 py-3 text-sm font-medium text-white"
        >
          {copy.ctaWaitlist}
        </Link>
        <Link
          href="/products/aylopet-ai#chat"
          className="rounded-full border border-[var(--oat-soft)] bg-white px-6 py-3 text-sm font-medium text-[var(--forest-deep)]"
        >
          {copy.ctaNutrition}
        </Link>
      </div>
    </div>
  );
}
