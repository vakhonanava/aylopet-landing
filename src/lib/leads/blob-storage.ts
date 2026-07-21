import type { StoredLead } from "@/lib/leads/types";

const INDEX_PATH = "leads/index.json";

function isBlobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readIndex(): Promise<StoredLead[]> {
  if (!isBlobEnabled()) return [];

  try {
    const { head } = await import("@vercel/blob");
    const blob = await head(INDEX_PATH);
    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) return [];

    const parsed: unknown = await response.json();
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredLead[];
  } catch {
    return [];
  }
}

async function writeIndex(leads: StoredLead[]): Promise<void> {
  if (!isBlobEnabled()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  const { put } = await import("@vercel/blob");
  await put(INDEX_PATH, JSON.stringify(leads, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function readLeadsFromStorage(): Promise<StoredLead[]> {
  if (isBlobEnabled()) {
    return readIndex();
  }

  const { readLeadsFromFile } = await import("@/lib/leads/file-storage");
  return readLeadsFromFile();
}

export async function writeLeadsToStorage(leads: StoredLead[]): Promise<void> {
  if (isBlobEnabled()) {
    await writeIndex(leads);
    return;
  }

  const { writeLeadsToFile } = await import("@/lib/leads/file-storage");
  await writeLeadsToFile(leads);
}

export function getLeadStorageMode(): "blob" | "file" {
  return isBlobEnabled() ? "blob" : "file";
}
