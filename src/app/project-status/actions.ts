"use server";

import { saveExpectationVote } from "@/lib/expectations/storage";
import {
  expectationVoteSchema,
  type ExpectationStats,
  type ExpectationVoteInput,
} from "@/lib/expectations/types";

export type SubmitExpectationResult =
  | { ok: true; stats: ExpectationStats; alreadyVoted: boolean }
  | { ok: false; error: string };

function uid(): string {
  return `exp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function submitExpectationVote(
  raw: ExpectationVoteInput,
): Promise<SubmitExpectationResult> {
  const parsed = expectationVoteSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "შეამოწმე ველები";
    return { ok: false, error: first };
  }

  const email = parsed.data.email?.trim() || undefined;
  const note = parsed.data.note?.trim() || undefined;

  try {
    const existing = await import("@/lib/expectations/storage").then((m) =>
      m.readExpectationVotes(),
    );
    const alreadyVoted = existing.some(
      (v) =>
        v.sessionId === parsed.data.sessionId ||
        (email && v.email && v.email.toLowerCase() === email.toLowerCase()),
    );

    const stats = await saveExpectationVote({
      id: uid(),
      optionId: parsed.data.optionId,
      sessionId: parsed.data.sessionId,
      email,
      note,
      createdAt: new Date().toISOString(),
    });

    return { ok: true, stats, alreadyVoted };
  } catch {
    return { ok: false, error: "ხმის მიცემა ვერ მოხერხდა. სცადე თავიდან." };
  }
}
