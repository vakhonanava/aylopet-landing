import { z } from "zod";

export const EXPECTATION_OPTION_IDS = [
  "fresh-food",
  "aylopet-ai",
  "dna",
  "smart-collar",
  "vet-consult",
  "other",
] as const;

export type ExpectationOptionId = (typeof EXPECTATION_OPTION_IDS)[number];

export const expectationVoteSchema = z.object({
  optionId: z.enum(EXPECTATION_OPTION_IDS),
  sessionId: z.string().min(8).max(64),
  email: z.string().email().optional().or(z.literal("")),
  note: z.string().max(300).optional().or(z.literal("")),
});

export type ExpectationVoteInput = z.infer<typeof expectationVoteSchema>;

export interface StoredExpectationVote {
  id: string;
  optionId: ExpectationOptionId;
  sessionId: string;
  email?: string;
  note?: string;
  createdAt: string;
}

export type ExpectationCounts = Record<ExpectationOptionId, number>;

export interface ExpectationStats {
  total: number;
  counts: ExpectationCounts;
  percentages: ExpectationCounts;
}

export function emptyExpectationCounts(): ExpectationCounts {
  return {
    "fresh-food": 0,
    "aylopet-ai": 0,
    dna: 0,
    "smart-collar": 0,
    "vet-consult": 0,
    other: 0,
  };
}

export function aggregateExpectationStats(
  votes: StoredExpectationVote[],
): ExpectationStats {
  const counts = emptyExpectationCounts();
  for (const vote of votes) {
    counts[vote.optionId] += 1;
  }

  const total = votes.length;
  const percentages = emptyExpectationCounts();
  for (const id of EXPECTATION_OPTION_IDS) {
    percentages[id] = total > 0 ? Math.round((counts[id] / total) * 100) : 0;
  }

  return { total, counts, percentages };
}
