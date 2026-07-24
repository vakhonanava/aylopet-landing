"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { PawDecor } from "@/components/decor/PawDecor";
import { getAdopterSession } from "@/lib/adopter-session";
import type { Locale } from "@/lib/i18n";

const LANGUAGES: { id: Locale; label: string }[] = [
  { id: "ka", label: "GEO" },
  { id: "en", label: "ENG" },
];

function DarkLanguageToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex rounded-full border border-[var(--ob-border-strong)] bg-white/5 p-0.5 text-xs font-semibold"
    >
      {LANGUAGES.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setLocale(opt.id)}
          className={`min-h-[32px] cursor-pointer rounded-full px-3 py-1.5 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ob-accent)] ${
            locale === opt.id
              ? "bg-[var(--ob-accent)] text-white"
              : "text-[var(--ob-text-tertiary)] hover:text-[var(--ob-text-primary)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function OnboardingPageContent() {
  const { dict } = useLocale();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const meta = dict.onboarding.meta;
  const gate = dict.quizGate;

  useEffect(() => {
    queueMicrotask(() => {
      setAllowed(getAdopterSession() !== null);
      setChecking(false);
    });
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--ob-bg)] px-6 py-16 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 0%, rgba(223,106,65,0.10), transparent 45%), radial-gradient(circle at 90% 25%, rgba(143,160,106,0.09), transparent 45%)",
        }}
      />
      <PawDecor density="light" />
      <div className="relative z-[1] mx-auto flex max-w-3xl justify-end pb-4">
        <DarkLanguageToggle />
      </div>

      {checking ? (
        <div className="relative z-[1] mx-auto max-w-2xl animate-pulse rounded-3xl bg-white/5 p-12" />
      ) : !allowed ? (
        <div className="relative z-[1] mx-auto max-w-lg text-center">
          <h1 className="font-display text-3xl font-semibold text-[var(--ob-text-primary)]">
            {gate.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--ob-text-secondary)]">
            {gate.description}
          </p>
          <p className="mt-2 text-xs text-[var(--ob-text-tertiary)]">{gate.waitingNote}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/onboarding/platform"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--ob-accent)] px-8 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[var(--ob-accent)]/90"
            >
              {gate.ctaRegister}
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--ob-border-strong)] px-8 py-3.5 text-sm font-medium text-[var(--ob-text-secondary)] transition-colors duration-300 hover:text-[var(--ob-text-primary)]"
            >
              {gate.ctaHome}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="relative z-[1] mx-auto max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--ob-accent)]">
              {meta.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold text-[var(--ob-text-primary)] sm:text-4xl">
              {meta.title}
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm text-[var(--ob-text-secondary)]">
              {meta.description}
            </p>
          </div>
          <div className="relative z-[1] mx-auto mt-10 max-w-2xl">
            <OnboardingWizard />
          </div>
        </>
      )}
    </main>
  );
}
