"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  DigestibilityInfographic,
  ProsConsMatrix,
  StickyArticleToc,
} from "@/components/japandi/ArticleLayout";
import { Accordion } from "@/components/marketing/Accordion";
import { ProseSection } from "@/components/marketing/ProseSection";
import { ScientificOverviewHero } from "@/components/marketing/ScientificOverviewHero";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { getKnowledgeArticle } from "@/lib/content/knowledge";

export function ScientificOverviewContent() {
  const { locale } = useLocale();
  const article = getKnowledgeArticle(locale);
  const tocItems = article.sections.map((s) => ({ id: s.id, label: s.title }));

  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <ScientificOverviewHero title={article.title} eyebrow={article.eyebrow} />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 lg:grid-cols-[200px_1fr] lg:px-8">
          <StickyArticleToc items={tocItems} label={article.tocLabel} />
          <div>
            <ProseSection className="px-0 pb-12">
              <p className="text-lg">{article.introduction}</p>
            </ProseSection>

            <div className="space-y-20">
              {article.sections.map((section) => (
                <article key={section.id} id={section.id} className="scroll-mt-32">
                  <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
                    {section.title}
                  </h2>
                  {section.blocks.map((block) => (
                    <div key={block.label} className="mt-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--brand-accent)]">
                        {block.label}
                      </h3>
                      <p className="mt-2 text-base leading-relaxed text-[var(--text-body)]">
                        {block.text}
                      </p>
                    </div>
                  ))}
                  {section.id === "fresh" && <DigestibilityInfographic />}
                  {section.pros && section.cons && (
                    <ProsConsMatrix
                      pros={section.pros}
                      cons={section.cons}
                      prosLabel={article.prosLabel}
                      consLabel={article.consLabel}
                    />
                  )}
                </article>
              ))}
            </div>

            <section className="mt-20 border-t border-[var(--border-light)] pt-12">
              <h2 className="mb-6 text-xl font-bold text-[var(--text-primary)]">
                {article.sourcesHeading}
              </h2>
              <Accordion
                items={[
                  {
                    title: article.bibliographyLabel,
                    content: (
                      <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--text-body)]">
                        {article.bibliography.map((ref) => (
                          <li key={ref}>{ref}</li>
                        ))}
                      </ol>
                    ),
                  },
                ]}
              />
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
