import { WaitlistSectionContent } from "@/components/sections/WaitlistSectionContent";
import { getLeadCount } from "@/lib/leads/repository";

export async function WaitlistSection() {
  const count = await getLeadCount();
  return <WaitlistSectionContent count={count} />;
}
