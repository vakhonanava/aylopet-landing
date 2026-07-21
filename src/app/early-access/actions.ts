"use server";

import { saveLead } from "@/lib/leads/repository";
import {
  earlyAdopterQuickSchema,
  quickToFullLead,
  type EarlyAdopterQuickInput,
} from "@/lib/leads/quick-signup";
import { earlyAdopterSchema, type EarlyAdopterInput } from "@/lib/leads/types";

export type SubmitLeadResult =
  | { ok: true; id: string; position: number; isReturning: boolean }
  | { ok: false; error: string };

export async function submitQuickAdopter(
  raw: EarlyAdopterQuickInput,
): Promise<SubmitLeadResult> {
  const parsed = earlyAdopterQuickSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "შეამოწმე ველები";
    return { ok: false, error: first };
  }
  return submitEarlyAdopter(quickToFullLead(parsed.data));
}

export async function submitEarlyAdopter(
  raw: EarlyAdopterInput,
): Promise<SubmitLeadResult> {
  const parsed = earlyAdopterSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "შეამოწმე ველები";
    return { ok: false, error: first };
  }

  try {
    const existingBefore = await import("@/lib/leads/repository").then((m) =>
      m.getAllLeads(),
    );
    const wasExisting = existingBefore.some(
      (l) => l.email.toLowerCase() === parsed.data.email.toLowerCase(),
    );

    const lead = await saveLead(parsed.data);

    return {
      ok: true,
      id: lead.id,
      position: lead.position,
      isReturning: wasExisting,
    };
  } catch {
    return { ok: false, error: "შენახვა ვერ მოხერხდა. სცადე თავიდან." };
  }
}
