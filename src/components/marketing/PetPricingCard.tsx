"use client";

import { Dog, Lock, PawPrint, Users } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  ADDITIONAL_PET_PRICE_GEL,
  FIRST_PET_PRICE_GEL,
  petPlanTotalGel,
} from "@/lib/pricing/pets";

const price = (gel: number) => `${gel} ₾`;

/** Transparent per-dog pricing · first profile, add-on, and the family tag. */
export function PetPricingCard({ className = "" }: { className?: string }) {
  const { dict } = useLocale();
  const p = dict.petPricing;

  return (
    <section
      className={`rounded-[var(--radius-organic-xl)] border border-[var(--border-light)] bg-white p-6 shadow-soft sm:p-8 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--terracotta)]">
        {p.eyebrow}
      </p>
      <h3 className="mt-2 font-display text-2xl font-semibold text-[var(--forest-deep)]">
        {p.title}
      </h3>

      <ul className="mt-6 space-y-3">
        <li className="flex items-start gap-3 rounded-2xl border border-[var(--border-light)] bg-[var(--background-secondary)] px-4 py-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
            <Dog className="h-4 w-4" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-semibold text-[var(--forest-deep)]">
                {p.firstPetLabel}
              </span>
              <span className="font-display text-xl font-semibold text-[var(--brand-primary)]">
                {price(FIRST_PET_PRICE_GEL)}
              </span>
            </span>
            <span className="mt-0.5 block text-xs text-[var(--text-secondary)]">
              {p.firstPetNote}
            </span>
          </span>
        </li>

        <li className="flex items-start gap-3 rounded-2xl border border-[var(--border-light)] bg-[var(--background-secondary)] px-4 py-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
            <PawPrint className="h-4 w-4" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-semibold text-[var(--forest-deep)]">
                {p.secondPetLabel}
              </span>
              <span className="font-display text-xl font-semibold text-[var(--brand-primary)]">
                +{price(ADDITIONAL_PET_PRICE_GEL)}
              </span>
            </span>
            <span className="mt-0.5 block text-xs text-[var(--text-secondary)]">
              {p.secondPetNote}
            </span>
          </span>
        </li>
      </ul>

      <p className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-[var(--border-light)] pt-4">
        <span className="text-sm font-medium text-[var(--text-primary)]">
          {p.totalLabel}
        </span>
        <span className="font-display text-2xl font-semibold text-[var(--forest-deep)]">
          {price(petPlanTotalGel(2))}
        </span>
      </p>

      <p className="mt-4 flex items-start gap-2 rounded-2xl border border-dashed border-[var(--border-light)] px-4 py-3 text-xs leading-relaxed text-[var(--text-secondary)]">
        <Lock
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--brand-primary)]"
          aria-hidden
        />
        {p.lockedNote}
      </p>

      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--brand-accent-soft)] px-4 py-1.5 text-xs font-semibold text-[var(--brand-primary)]">
        <Users className="h-3.5 w-3.5" aria-hidden />
        {p.familySharingTag}
      </p>
    </section>
  );
}
