"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { CommunityBar } from "@/components/marketing/CommunityBar";
import { PageHero } from "@/components/marketing/PageHero";
import { ProjectStatusPhases } from "@/components/marketing/ProjectStatusPhases";
import { UserExpectationsGraph } from "@/components/marketing/UserExpectationsGraph";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import type { ExpectationStats } from "@/lib/expectations/types";

export function ProjectStatusContent({
  expectationStats,
  waitlistCount,
}: {
  expectationStats: ExpectationStats;
  waitlistCount: number;
}) {
  const { dict } = useLocale();
  const t = dict.projectStatus;

  return (
    <>
      <main className="relative flex-1 overflow-hidden bg-[var(--background-main)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(107,143,113,0.12),transparent)]"
        />

        <PageHero
          title={t.title}
          subtitle={t.subtitle}
        />

        <CommunityBar initialCount={waitlistCount} />

        <UserExpectationsGraph initialStats={expectationStats} />

        <ProjectStatusPhases />
      </main>
      <SiteFooter />
    </>
  );
}
