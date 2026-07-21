import { promises as fs } from "fs";
import path from "path";
import type { StoredLead } from "@/lib/leads/types";

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

export async function readLeadsFromFile(): Promise<StoredLead[]> {
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredLead[];
  } catch {
    return [];
  }
}

export async function writeLeadsToFile(leads: StoredLead[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
}
