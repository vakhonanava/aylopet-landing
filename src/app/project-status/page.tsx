import { ProjectStatusContent } from "@/components/marketing/ProjectStatusContent";
import { getExpectationStats } from "@/lib/expectations/storage";
import { getLeadCount } from "@/lib/leads/repository";

// Waitlist and poll counters are read per request; prerendering would freeze
// them at build time.
export const dynamic = "force-dynamic";

export default async function ProjectStatusPage() {
  const [expectationStats, waitlistCount] = await Promise.all([
    getExpectationStats(),
    getLeadCount(),
  ]);
  return (
    <ProjectStatusContent
      expectationStats={expectationStats}
      waitlistCount={waitlistCount}
    />
  );
}
