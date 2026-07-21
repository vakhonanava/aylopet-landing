import type { Metadata } from "next";
import { GlassTeamPlaceholder } from "@/components/japandi/ProcessAndAi";
import { PageHero } from "@/components/marketing/PageHero";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { ABOUT } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "Aylopet · ჩვენი გუნდი",
  description: ABOUT.team.body,
};

export default function TeamPage() {
  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <PageHero
          title={ABOUT.team.title}
          backHref="/about/what-is-aylopet"
          backLabel="ჩვენს შესახებ"
        />
        <GlassTeamPlaceholder status={ABOUT.team.status} body={ABOUT.team.body} />
      </main>
      <SiteFooter />
    </>
  );
}
