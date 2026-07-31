import { promises as fs } from "fs";
import path from "path";
import type { StoredB2BInquiry } from "@/lib/b2b/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "b2b-inquiries.json");

async function readB2BInquiriesFromFile(): Promise<StoredB2BInquiry[]> {
  try {
    const raw = await fs.readFile(INQUIRIES_FILE, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredB2BInquiry[];
  } catch {
    return [];
  }
}

async function saveB2BInquiryToFile(inquiry: StoredB2BInquiry): Promise<void> {
  const inquiries = await readB2BInquiriesFromFile();
  inquiries.push(inquiry);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
}

export async function readB2BInquiries(): Promise<StoredB2BInquiry[]> {
  if (isSupabaseConfigured()) {
    const { readB2BInquiriesFromSupabase } = await import(
      "@/lib/b2b/supabase-storage"
    );
    return readB2BInquiriesFromSupabase();
  }
  return readB2BInquiriesFromFile();
}

export async function saveB2BInquiry(
  inquiry: StoredB2BInquiry,
): Promise<void> {
  if (isSupabaseConfigured()) {
    const { saveB2BInquiryToSupabase } = await import(
      "@/lib/b2b/supabase-storage"
    );
    return saveB2BInquiryToSupabase(inquiry);
  }
  return saveB2BInquiryToFile(inquiry);
}
