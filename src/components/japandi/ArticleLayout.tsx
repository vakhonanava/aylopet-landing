"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  label: string;
}

export function StickyArticleToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  return (
    <nav
      className="sticky top-32 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block"
      aria-label="სარჩევი"
    >
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
        სარჩევი
      </p>
      <ul className="space-y-1 border-l border-[var(--border-light)]">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block border-l-2 py-2 pl-4 text-sm transition-colors ${
                active === item.id
                  ? "border-[var(--brand-primary)] font-medium text-[var(--brand-primary)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function DigestibilityInfographic() {
  return (
    <div className="my-8 rounded-2xl border border-[var(--border-light)] bg-[var(--background-main)] p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
        Algya et al., 2018, University of Illinois
      </p>
      <div className="mt-4 flex items-end gap-4">
        <div className="flex-1">
          <div className="h-16 rounded-lg bg-[var(--background-muted)]" style={{ width: "62%" }} />
          <p className="mt-2 text-xs text-[var(--text-secondary)]">Extruded, ~62%</p>
        </div>
        <div className="flex-1">
          <div className="h-24 rounded-lg bg-[var(--brand-primary)]" style={{ width: "92%" }} />
          <p className="mt-2 text-xs font-semibold text-[var(--brand-primary)]">Fresh, 90%+</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-[var(--text-secondary)]">
        Cold-chain, -18°C, FDA
      </p>
    </div>
  );
}

export function ProsConsMatrix({
  pros,
  cons,
}: {
  pros: readonly string[];
  cons: readonly string[];
}) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-[var(--status-emerald)]/20 bg-[var(--brand-accent-soft)]/40 p-5">
        <h4 className="text-xs font-bold uppercase tracking-wide text-[var(--brand-primary)]">
          უპირატესობები
        </h4>
        <ul className="mt-3 space-y-2">
          {pros.map((p) => (
            <li key={p} className="flex gap-2 text-sm text-[var(--text-body)]">
              <span className="text-[var(--status-emerald)]">+</span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-5">
        <h4 className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
          შეზღუდვები
        </h4>
        <ul className="mt-3 space-y-2">
          {cons.map((c) => (
            <li key={c} className="flex gap-2 text-sm text-[var(--text-body)]">
              <span className="text-[var(--text-tertiary)]">−</span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
