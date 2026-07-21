"use client";

import Link from "next/link";
import { useState } from "react";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ReviewsList, UserReviewEditor } from "@/components/reviews/UserReviewEditor";
import { PawDecor } from "@/components/decor/PawDecor";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export function ReviewsPageContent() {
  const { dict } = useLocale();
  const copy = dict.reviews;
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <main className="relative flex-1 overflow-hidden bg-[var(--background-main)]">
        <PawDecor density="medium" className="z-0" />
        <section className="relative z-[1] border-b border-[var(--border-light)] bg-[var(--background-secondary)] px-6 py-12 lg:px-8">
          <div className="mx-auto flex max-w-4xl items-start justify-between gap-4">
            <div>
              <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand-primary)]">
                ← მთავარი
              </Link>
              <h1 className="mt-4 font-display text-3xl font-semibold text-[var(--text-primary)]">
                {copy.title}
              </h1>
              <p className="mt-2 max-w-xl text-[var(--text-body)]">{copy.description}</p>
            </div>
            <LanguageToggle className="shrink-0" />
          </div>
        </section>

        <section className="relative z-[1] mx-auto max-w-4xl space-y-10 px-6 py-12 lg:px-8">
          <UserReviewEditor onSaved={() => setRefreshKey((k) => k + 1)} />
          <ReviewsList key={refreshKey} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
