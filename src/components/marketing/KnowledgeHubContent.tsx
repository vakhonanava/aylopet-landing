"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PageHero } from "@/components/marketing/PageHero";
import { ArticleCard } from "@/components/marketing/ContentBlocks";
import { SiteFooter } from "@/components/marketing/SiteFooter";

const CATEGORY_HREFS = [
  "/knowledge/scientific-overview",
  "/knowledge/preventive",
  "/knowledge/behavior",
  "/knowledge/grooming",
] as const;

const CATEGORY_LIVE = [true, false, false, false] as const;

export function KnowledgeHubContent() {
  const { dict } = useLocale();
  const k = dict.knowledgeHub;
  const categories = [
    k.categoryLabels.nutrition,
    k.categoryLabels.preventive,
    k.categoryLabels.behavior,
    k.categoryLabels.grooming,
  ];

  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <PageHero
          title={k.title}
          subtitle={k.subtext}
          backHref="/"
          backLabel={dict.common.backHome}
        />
        {/* Health & wellness guide · its own section, independent of the
            "Why fresh food?" article below. */}
        <section
          id="wellness-guide"
          className="mx-auto max-w-3xl px-6 pb-14 lg:px-8"
        >
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--terracotta)]">
              {k.categoriesTitle}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {categories.map((label, i) => (
                <li key={label}>
                  <Link
                    href={CATEGORY_HREFS[i] ?? "/knowledge"}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors ${
                      CATEGORY_LIVE[i]
                        ? "border-[var(--brand-primary)]/30 bg-[var(--brand-accent-soft)] text-[var(--forest-deep)] hover:border-[var(--brand-primary)]"
                        : "border-[var(--border-light)] bg-white text-[var(--text-secondary)]"
                    }`}
                  >
                    {label}
                    <span className="text-xs font-medium">
                      {CATEGORY_LIVE[i] ? k.readNow : k.comingSoon}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="why-fresh-food"
          className="border-t border-[var(--border-light)] bg-[var(--background-secondary)] py-14"
        >
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--terracotta)]">
              {dict.locale === "ka" ? "კვების მეცნიერება" : "Nutrition science"}
            </h2>
            <div className="mt-4">
              <ArticleCard
                title={
                  dict.locale === "ka"
                    ? "რატომ ცოცხალი საკვები?"
                    : "Why fresh food?"
                }
                href="/why-fresh-food"
                description={k.articleDescription}
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
