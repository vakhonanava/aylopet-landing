import { getLeadCount } from "@/lib/leads/repository";
import { EARLY_ADOPTER_CAP } from "@/lib/constants/marketing";
import { ScarcityBarClient } from "@/components/sections/ScarcityBarClient";

export async function ScarcityBar() {
  const count = await getLeadCount();
  return <ScarcityBarClient count={count} cap={EARLY_ADOPTER_CAP} />;
}
