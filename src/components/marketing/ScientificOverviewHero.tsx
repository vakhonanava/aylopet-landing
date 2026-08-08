"use client";

import { PageHero } from "@/components/marketing/PageHero";

export function ScientificOverviewHero({
  title,
  eyebrow,
}: {
  title: string;
  eyebrow: string;
}) {

  return (
    <PageHero
      title={title}
      eyebrow={eyebrow}
    />
  );
}
