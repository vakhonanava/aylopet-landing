"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

const COPY = {
  ka: {
    title: "გვერდი ვერ მოიძებნა",
    body: "ბმული შეიძლება არასწორი იყოს, ან გვერდი აღარ არსებობს.",
    cta: "მთავარ გვერდზე დაბრუნება",
  },
  en: {
    title: "Page not found",
    body: "The link may be wrong, or the page no longer exists.",
    cta: "Back to the home page",
  },
} as const;

export default function NotFound() {
  const { locale } = useLocale();
  const c = COPY[locale];

  return (
    <main className="flex flex-1 items-center justify-center bg-[var(--background-main)] px-6 py-24">
      <div className="max-w-md text-center">
        <p className="font-display text-6xl font-semibold text-[var(--brand-primary)]">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-[var(--text-primary)]">
          {c.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          {c.body}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[44px] items-center rounded-full bg-[var(--brand-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
        >
          {c.cta}
        </Link>
      </div>
    </main>
  );
}
