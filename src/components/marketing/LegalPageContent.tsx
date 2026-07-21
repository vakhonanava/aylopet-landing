"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { PageHero } from "@/components/marketing/PageHero";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { getLegalContent, type LegalPageKey } from "@/lib/content/legal";

export function LegalPageContent({ page }: { page: LegalPageKey }) {
  const { dict, locale } = useLocale();
  const copy = getLegalContent(locale);
  const doc = copy[page];

  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <PageHero
          title={doc.title}
          subtitle={`${copy.lastUpdatedLabel}: ${doc.lastUpdated}`}
          backHref="/"
          backLabel={dict.common.backHome}
        />

        <section className="mx-auto max-w-3xl px-6 pb-24 lg:px-8">
          <RevealOnScroll>
            <div className="space-y-10">
              {doc.sections.map((section, i) => (
                <article
                  key={section.heading ?? `intro-${i}`}
                  className={i > 0 ? "border-t border-[var(--border-light)] pt-8" : ""}
                >
                  {section.heading && (
                    <h2 className="font-display text-xl font-semibold text-[var(--forest-deep)] sm:text-2xl">
                      {section.heading}
                    </h2>
                  )}
                  {section.paragraphs?.map((p, pi) => (
                    <p
                      key={pi}
                      className={`text-sm leading-relaxed text-[var(--text-body)] sm:text-base ${
                        section.heading || pi > 0 ? "mt-4" : ""
                      }`}
                    >
                      {p}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="mt-4 space-y-2.5">
                      {section.list.map((item, li) => (
                        <li
                          key={li}
                          className="flex gap-3 text-sm leading-relaxed text-[var(--text-body)] sm:text-base"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--terracotta)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </RevealOnScroll>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
