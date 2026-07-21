"use client";

import { ChevronDown, Search, SearchX, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PageHero } from "@/components/marketing/PageHero";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import {
  formatQuestionCount,
  getFaqContent,
  type FaqCategoryKey,
  type FaqItem,
} from "@/lib/content/faq";
import { fadeUp, staggerContainer } from "@/lib/motion";

type ActiveCategory = "all" | FaqCategoryKey;

/** Escapes regex-special characters so raw search input is safe to embed in a RegExp. */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Wraps every case-insensitive occurrence of `query` inside `text` in a <mark>. */
function highlightMatches(text: string, query: string): ReactNode {
  const trimmed = query.trim();
  if (!trimmed) return text;

  const parts = text.split(new RegExp(`(${escapeRegExp(trimmed)})`, "gi"));
  if (parts.length <= 1) return text;

  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark
        key={i}
        className="rounded-sm bg-[var(--terracotta)]/20 px-0.5 text-[var(--forest-deep)]"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function FaqAccordionRow({
  item,
  query,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  query: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-panel-${item.id}`;
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-soft transition-colors duration-200 hover:border-[var(--brand-primary)]/25">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-[var(--forest-deep)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 hover:bg-[var(--background-secondary)] sm:text-[15px]"
      >
        <span className="pr-2">{highlightMatches(item.question, query)}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--text-secondary)] transition-transform duration-300 ${
            isOpen ? "rotate-180 text-[var(--brand-primary)]" : ""
          }`}
          aria-hidden
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--border-light)] px-5 py-4 text-sm leading-relaxed text-[var(--text-body)]">
              <p>{highlightMatches(item.answer, query)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqPageContent() {
  const { dict, locale } = useLocale();
  const copy = getFaqContent(locale);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("all");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const normalizedQuery = query.trim().toLowerCase();

  const matchesQuery = (item: FaqItem) => {
    if (!normalizedQuery) return true;
    return (
      item.question.toLowerCase().includes(normalizedQuery) ||
      item.answer.toLowerCase().includes(normalizedQuery)
    );
  };

  const searchMatches = useMemo(
    () => copy.items.filter(matchesQuery),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [copy.items, normalizedQuery],
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map<FaqCategoryKey, number>();
    for (const item of searchMatches) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }
    return counts;
  }, [searchMatches]);

  const filteredItems = useMemo(
    () =>
      activeCategory === "all"
        ? searchMatches
        : searchMatches.filter((item) => item.category === activeCategory),
    [searchMatches, activeCategory],
  );

  const groups = useMemo(() => {
    if (activeCategory !== "all") {
      return [{ key: activeCategory, label: null, items: filteredItems }];
    }
    return copy.categories
      .map((cat) => ({
        key: cat.key,
        label: cat.label,
        items: filteredItems.filter((item) => item.category === cat.key),
      }))
      .filter((group) => group.items.length > 0);
  }, [activeCategory, filteredItems, copy.categories]);

  const toggleItem = (id: string) =>
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <PageHero
          title={copy.title}
          subtitle={copy.subtitle}
          backHref="/"
          backLabel={dict.common.backHome}
        />

        <section className="mx-auto max-w-3xl px-6 pb-24 lg:px-8">
          <motion.div
            key={locale}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Search */}
            <motion.div variants={fadeUp} className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]"
                aria-hidden
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={copy.searchPlaceholder}
                aria-label={copy.searchAriaLabel}
                className="w-full rounded-full border border-[var(--border-light)] bg-white py-3.5 pl-11 pr-11 text-sm text-[var(--text-primary)] shadow-soft outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label={copy.clearSearchAriaLabel}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--background-secondary)] hover:text-[var(--forest-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </motion.div>

            {/* Category tabs */}
            <motion.div
              variants={fadeUp}
              className="mt-5 flex gap-2 overflow-x-auto rounded-full border border-[var(--border-light)] bg-[var(--oat-soft)] p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label={copy.searchAriaLabel}
            >
              <CategoryTab
                active={activeCategory === "all"}
                onClick={() => setActiveCategory("all")}
                label={copy.allLabel}
                count={searchMatches.length}
              />
              {copy.categories.map((cat) => (
                <CategoryTab
                  key={cat.key}
                  active={activeCategory === cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  label={cat.label}
                  count={categoryCounts.get(cat.key) ?? 0}
                />
              ))}
            </motion.div>

            {/* Results */}
            <motion.div variants={fadeUp} className="mt-8">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[var(--border-light)] bg-white/60 px-6 py-16 text-center">
                  <SearchX
                    className="h-8 w-8 text-[var(--text-tertiary)]"
                    aria-hidden
                  />
                  <p className="font-display text-lg font-semibold text-[var(--forest-deep)]">
                    {copy.noResultsTitle}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {copy.noResultsBody}
                  </p>
                </div>
              ) : (
                <div className="space-y-10">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {groups.map((group) => (
                      <motion.div
                        key={group.key}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {group.label && (
                          <div className="mb-4 flex items-end justify-between gap-4 border-b border-[var(--border-light)] pb-3">
                            <h2 className="font-display text-lg font-semibold text-[var(--forest-deep)] sm:text-xl">
                              {group.label}
                            </h2>
                            <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                              {formatQuestionCount(copy, group.items.length)}
                            </span>
                          </div>
                        )}
                        <div className="space-y-3">
                          {group.items.map((item) => (
                            <motion.div key={item.id} layout>
                              <FaqAccordionRow
                                item={item}
                                query={normalizedQuery}
                                isOpen={Boolean(openIds[item.id])}
                                onToggle={() => toggleItem(item.id)}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </motion.div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function CategoryTab({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] ${
        active
          ? "text-white"
          : "text-[var(--text-secondary)] hover:text-[var(--forest-deep)]"
      }`}
    >
      {active && (
        <motion.span
          layoutId="faq-tab-pill"
          className="absolute inset-0 rounded-full bg-[var(--forest-deep)]"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {label}
        <span
          className={`text-xs tabular-nums ${
            active ? "text-white/70" : "text-[var(--text-tertiary)]"
          }`}
        >
          {count}
        </span>
      </span>
    </button>
  );
}
