"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { PawDecor } from "@/components/decor/PawDecor";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Button } from "@/components/ui/Button";

export function WaitlistSectionContent({ count }: { count: number }) {
  const { dict } = useLocale();
  const w = dict.landing.waitlist;
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
        </div>

        <div className="relative z-[1] mx-auto mt-10 max-w-xl text-center">
          <div className="rounded-[2rem] border border-[var(--border-light)] bg-white p-8 shadow-soft">
            <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
              <ShieldCheck className="h-4 w-4" />
              Secure Supabase onboarding
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-body)]">
              ერთი უსაფრთხო რეგისტრაცია — waitlist, ანგარიში, ძაღლის პროფილი და
              სამედიცინო დოკუმენტების ატვირთვა.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button href="/onboarding/platform" showArrow>
                {dict.common.joinWaitlist}
              </Button>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-[var(--brand-primary)] transition hover:bg-[var(--brand-primary)]/5"
              >
                უკვე გაქვს ანგარიში?
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
