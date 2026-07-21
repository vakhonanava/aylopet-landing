"use client";

import { CreditCard, Shield, Stethoscope } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";

const ICONS = [Stethoscope, CreditCard, Shield] as const;

export function TrustStrip() {
  const { dict } = useLocale();
  const items = dict.trustStrip.items;

  return (
    <section
      aria-label="Trust indicators"
      className="border-y border-[var(--border-light)] bg-white py-6"
    >
      <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-3 sm:gap-6 sm:px-6 lg:px-8">
        {items.map((item, i) => {
          const Icon = ICONS[i] ?? Shield;
          return (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-2xl border border-[var(--border-light)] bg-[var(--background-main)] px-4 py-3 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
            >
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]"
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--forest-deep)]">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
