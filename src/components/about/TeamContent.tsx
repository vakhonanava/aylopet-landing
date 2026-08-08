"use client";

import { GlassTeamPlaceholder } from "@/components/japandi/ProcessAndAi";
import { PageHero } from "@/components/marketing/PageHero";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAbout } from "@/lib/content/about";

export function TeamContent() {
  const { locale } = useLocale();
  const { team } = getAbout(locale);
  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <PageHero title={team.title} />
        <GlassTeamPlaceholder status={team.status} body={team.body} />
      </main>
      <SiteFooter />
    </>
  );
}
