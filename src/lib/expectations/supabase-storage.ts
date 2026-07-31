import { createSupabaseAdmin } from "@/lib/supabase/server";
import {
  aggregateExpectationStats,
  type ExpectationOptionId,
  type ExpectationStats,
  type StoredExpectationVote,
} from "@/lib/expectations/types";

interface ExpectationRow {
  id: string;
  option_id: string;
  session_id: string;
  email: string | null;
  note: string | null;
  created_at: string;
}

function rowToVote(row: ExpectationRow): StoredExpectationVote {
  return {
    id: row.id,
    optionId: row.option_id as ExpectationOptionId,
    sessionId: row.session_id,
    email: row.email ?? undefined,
    note: row.note ?? undefined,
    createdAt: row.created_at,
  };
}

export async function readExpectationVotesFromSupabase(): Promise<
  StoredExpectationVote[]
> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("project_expectations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as ExpectationRow[]).map(rowToVote);
}

export async function saveExpectationVoteToSupabase(
  vote: StoredExpectationVote,
): Promise<ExpectationStats> {
  const supabase = createSupabaseAdmin();

  const { data: existingBySession } = await supabase
    .from("project_expectations")
    .select("id")
    .eq("session_id", vote.sessionId)
    .maybeSingle();

  let duplicate = !!existingBySession;
  if (!duplicate && vote.email) {
    const { data: existingByEmail } = await supabase
      .from("project_expectations")
      .select("id")
      .ilike("email", vote.email)
      .maybeSingle();
    duplicate = !!existingByEmail;
  }

  if (!duplicate) {
    const { error } = await supabase.from("project_expectations").insert({
      id: vote.id,
      option_id: vote.optionId,
      session_id: vote.sessionId,
      email: vote.email ?? null,
      note: vote.note ?? null,
      created_at: vote.createdAt,
    });
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      throw new Error(error.message);
    }
  }

  const votes = await readExpectationVotesFromSupabase();
  return aggregateExpectationStats(votes);
}
