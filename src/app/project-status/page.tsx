import { ProjectStatusContent } from "@/components/marketing/ProjectStatusContent";
import { getExpectationStats } from "@/lib/expectations/storage";
import { getLeadCount } from "@/lib/leads/repository";

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
