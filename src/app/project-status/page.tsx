import { ProjectStatusContent } from "@/components/marketing/ProjectStatusContent";
import { getExpectationStats } from "@/lib/expectations/storage";

export default async function ProjectStatusPage() {
  const expectationStats = await getExpectationStats();
  return <ProjectStatusContent expectationStats={expectationStats} />;
}
