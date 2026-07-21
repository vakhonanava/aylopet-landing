"use client";

import { EarlyAdopterQuickForm } from "@/components/early-access/EarlyAdopterQuickForm";
import { PawDecor } from "@/components/decor/PawDecor";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function WaitlistSectionContent({ count }: { count: number }) {
  const { dict } = useLocale();
  const w = dict.landing.waitlist;
  const displayCount = count > 0 ? count : 10;
  const counterText =
    count > 0
      ? dict.common.joinPetParents.replace("{count}", String(displayCount))
      : dict.projectStatus.beAmongFirst;

  return (
    <section
      id="waitlist"
      className="relative scroll-mt-28 overflow-hidden bg-[var(--background-main)] py-16 sm:py-24"
    >
      <PawDecor density="light" />
      <div className="relative z-[1] mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-[var(--terracotta)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--terracotta)]">
            {w.badge}
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-[var(--forest-deep)] sm:text-4xl">
            {w.title}
          </h2>
          <p className="mt-3 text-base text-[var(--text-body)] sm:text-lg">
            {w.description}
          </p>
          <p className="mt-2 text-sm font-semibold text-[var(--brand-primary)]">
            {counterText}
          </p>
        </div>

        <div className="relative z-[1] mx-auto mt-10 max-w-xl">
          <EarlyAdopterQuickForm leadCount={count} />
        </div>
      </div>
    </section>
  );
}
