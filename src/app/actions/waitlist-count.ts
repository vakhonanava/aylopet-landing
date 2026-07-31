"use server";

import { getLeadCount } from "@/lib/leads/repository";

export async function fetchLiveWaitlistCount(): Promise<number> {
  return getLeadCount();
}
