import { getLeadStorageMode as getBlobOrFileMode } from "@/lib/leads/blob-storage";
import type { EarlyAdopterInput, StoredLead } from "@/lib/leads/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";

function uid(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export type LeadStorageMode = "supabase" | "blob" | "file";

export function getLeadStorageMode(): LeadStorageMode {
  if (isSupabaseConfigured()) return "supabase";
  return getBlobOrFileMode();
}

async function readLeads(): Promise<StoredLead[]> {
  if (isSupabaseConfigured()) {
    const { readLeadsFromSupabase } = await import("@/lib/leads/supabase-storage");
    return readLeadsFromSupabase();
  }

  const { readLeadsFromStorage } = await import("@/lib/leads/blob-storage");
  return readLeadsFromStorage();
}

async function persistLead(input: EarlyAdopterInput): Promise<StoredLead> {
  if (isSupabaseConfigured()) {
    const { saveLeadToSupabase } = await import("@/lib/leads/supabase-storage");
    return saveLeadToSupabase(input);
  }

  const { readLeadsFromStorage, writeLeadsToStorage } = await import(
    "@/lib/leads/blob-storage"
  );
  const leads = await readLeadsFromStorage();

  const duplicateIndex = leads.findIndex(
    (lead) => lead.email.toLowerCase() === input.email.toLowerCase(),
  );
  if (duplicateIndex >= 0) {
    const existing = leads[duplicateIndex]!;
    const updated: StoredLead = {
      ...existing,
      ...input,
      id: existing.id,
      position: existing.position,
      status: existing.status,
      createdAt: existing.createdAt,
    };
    leads[duplicateIndex] = updated;
    await writeLeadsToStorage(leads);
    return updated;
  }

  const lead: StoredLead = {
    ...input,
    id: uid(),
    position: leads.length + 1,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  leads.push(lead);
  await writeLeadsToStorage(leads);
  return lead;
}

export async function saveLead(input: EarlyAdopterInput): Promise<StoredLead> {
  return persistLead(input);
}

export async function getAllLeads(): Promise<StoredLead[]> {
  const leads = await readLeads();
  return leads.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getLeadCount(): Promise<number> {
  if (isSupabaseConfigured()) {
    const { getPlatformSignupCount } = await import("@/lib/platform/admin");
    return getPlatformSignupCount();
  }
  const leads = await readLeads();
  return leads.length;
}
