import {
  aggregateExpectationStats,
  type ExpectationStats,
  type StoredExpectationVote,
} from "@/lib/expectations/types";

const BLOB_INDEX_PATH = "expectations/index.json";

function isBlobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readVotesFromBlob(): Promise<StoredExpectationVote[]> {
  if (!isBlobEnabled()) return [];

  try {
    const { head } = await import("@vercel/blob");
    const blob = await head(BLOB_INDEX_PATH);
    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) return [];

    const parsed: unknown = await response.json();
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredExpectationVote[];
  } catch {
    return [];
  }
}

async function writeVotesToBlob(votes: StoredExpectationVote[]): Promise<void> {
  if (!isBlobEnabled()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  const { put } = await import("@vercel/blob");
  await put(BLOB_INDEX_PATH, JSON.stringify(votes, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function readVotesFromFile(): Promise<StoredExpectationVote[]> {
  const { promises: fs } = await import("fs");
  const path = await import("path");

  const file = path.join(process.cwd(), "data", "expectations.json");
  try {
    const raw = await fs.readFile(file, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredExpectationVote[];
  } catch {
    return [];
  }
}

async function writeVotesToFile(votes: StoredExpectationVote[]): Promise<void> {
  const { promises: fs } = await import("fs");
  const path = await import("path");

  const dir = path.join(process.cwd(), "data");
  const file = path.join(dir, "expectations.json");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(file, JSON.stringify(votes, null, 2), "utf-8");
}

export async function readExpectationVotes(): Promise<StoredExpectationVote[]> {
  if (isBlobEnabled()) return readVotesFromBlob();
  return readVotesFromFile();
}

export async function writeExpectationVotes(
  votes: StoredExpectationVote[],
): Promise<void> {
  if (isBlobEnabled()) {
    await writeVotesToBlob(votes);
    return;
  }
  await writeVotesToFile(votes);
}

export async function getExpectationStats(): Promise<ExpectationStats> {
  const votes = await readExpectationVotes();
  return aggregateExpectationStats(votes);
}

export async function saveExpectationVote(
  vote: StoredExpectationVote,
): Promise<ExpectationStats> {
  const votes = await readExpectationVotes();

  const duplicate = votes.some(
    (v) =>
      v.sessionId === vote.sessionId ||
      (vote.email &&
        v.email &&
        v.email.toLowerCase() === vote.email.toLowerCase()),
  );

  if (duplicate) {
    return aggregateExpectationStats(votes);
  }

  votes.push(vote);
  await writeExpectationVotes(votes);
  return aggregateExpectationStats(votes);
}
