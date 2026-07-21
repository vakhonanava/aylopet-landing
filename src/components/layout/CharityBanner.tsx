"use client";

import { Heart } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { scrollToWaitlist } from "@/lib/navigation";

export function CharityBanner() {
  const { dict } = useLocale();

  return (
    <button
      type="button"
      onClick={scrollToWaitlist}
      className="w-full cursor-pointer border-b border-[var(--terracotta)]/15 bg-gradient-to-r from-[var(--terracotta)]/8 via-[var(--brand-accent-soft)] to-[var(--terracotta)]/8 transition-colors hover:from-[var(--terracotta)]/12 hover:to-[var(--terracotta)]/12"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 px-4 py-2 text-center">
        <span
          aria-hidden
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/90 text-[var(--terracotta)] shadow-sm"
        >
          <Heart className="h-3.5 w-3.5 fill-current" />
        </span>
        <p className="text-xs font-semibold text-[var(--forest-deep)] sm:text-sm">
          {dict.common.charityMessage}
        </p>
      </div>
    </button>
  );
}
