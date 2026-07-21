"use client";

import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { scrollToWaitlist } from "@/lib/navigation";

export function PromoBanner() {
  const { dict } = useLocale();

  return (
    <div className="bg-[var(--forest-deep)] text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2.5 px-4 py-2.5 sm:flex-row sm:gap-4 sm:py-2">
        <p className="text-center text-sm font-semibold tracking-wide sm:text-[0.8125rem]">
          {dict.common.promoText}
        </p>
        <button
          type="button"
          onClick={scrollToWaitlist}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[var(--forest-deep)] transition-all duration-200 hover:bg-[var(--soft-cream)] active:scale-[0.98]"
        >
          {dict.common.joinWaitlist}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
