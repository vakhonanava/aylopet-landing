import { promises as fs } from "fs";
import path from "path";
import type { StoredB2BInquiry } from "@/lib/b2b/types";

const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "b2b-inquiries.json");

export async function readB2BInquiries(): Promise<StoredB2BInquiry[]> {
  try {
    const raw = await fs.readFile(INQUIRIES_FILE, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredB2BInquiry[];
  } catch {
    return [];
  }
}

export async function saveB2BInquiry(
  inquiry: StoredB2BInquiry,
): Promise<void> {
  const inquiries = await readB2BInquiries();
  inquiries.push(inquiry);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
}
