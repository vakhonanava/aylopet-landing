"use client";

import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import {
  ValueLineIcon,
  type IconType,
} from "@/components/japandi/LineArtIcons";

interface ValueCard {
  title: string;
  body: string;
  icon: IconType;
}

const ICON_MAP: Record<string, IconType> = {
  პერსონალიზაცია: "personalize",
  "მეცნიერული გამჭვირვალობა": "science",
  "უპირობო ერთგულება": "loyalty",
};

export function ValueCardsInteractive({
  items,
}: {
  items: readonly { title: string; body: string }[];
}) {
  const cards: ValueCard[] = items.map((item) => ({
    ...item,
    icon: ICON_MAP[item.title] ?? "personalize",
  }));

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 lg:px-8">
      <div className="grid gap-5 md:grid-cols-3">
        {cards.map((item, i) => (
          <RevealOnScroll key={item.title} y={20} delay={0.08 * i}>
            <article className="card-hover group h-full rounded-[var(--radius-bento)] border border-[var(--border-light)] bg-white p-8 shadow-soft">
              <ValueLineIcon type={item.icon} />
              <h3 className="mt-6 text-lg font-bold tracking-tight text-[var(--text-primary)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-body)]">
                {item.body}
              </p>
            </article>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
