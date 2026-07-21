"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { PageHero } from "@/components/marketing/PageHero";

export function ScientificOverviewHero({
  title,
  eyebrow,
}: {
  title: string;
  eyebrow: string;
}) {
  const { dict } = useLocale();

  return (
    <PageHero
      title={title}
      eyebrow={eyebrow}
      backHref="/knowledge"
      backLabel={dict.knowledgeHub.title}
    />
  );
}
