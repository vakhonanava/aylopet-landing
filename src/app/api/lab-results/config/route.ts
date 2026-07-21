import { isSupabaseConfigured } from "@/lib/supabase/env";

export type LabStorageMode = "supabase" | "blob";

export function getLabStorageMode(): LabStorageMode {
  return isSupabaseConfigured() ? "supabase" : "blob";
}

export async function GET() {
  return Response.json({ mode: getLabStorageMode() });
}
