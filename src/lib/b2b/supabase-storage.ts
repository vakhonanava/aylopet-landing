import { createSupabaseAdmin } from "@/lib/supabase/server";
import type { StoredB2BInquiry } from "@/lib/b2b/types";

interface B2BRow {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  partnership_type: string;
  custom_type: string | null;
  message: string;
  created_at: string;
}

function rowToInquiry(row: B2BRow): StoredB2BInquiry {
  return {
    id: row.id,
    companyName: row.company_name,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone,
    partnershipType: row.partnership_type as StoredB2BInquiry["partnershipType"],
    customType: row.custom_type ?? undefined,
    message: row.message,
    createdAt: row.created_at,
  };
}

export async function readB2BInquiriesFromSupabase(): Promise<StoredB2BInquiry[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("b2b_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as B2BRow[]).map(rowToInquiry);
}

export async function saveB2BInquiryToSupabase(
  inquiry: StoredB2BInquiry,
): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("b2b_requests").insert({
    id: inquiry.id,
    company_name: inquiry.companyName,
    contact_name: inquiry.contactName,
    email: inquiry.email.toLowerCase(),
    phone: inquiry.phone,
    partnership_type: inquiry.partnershipType,
    custom_type: inquiry.customType ?? null,
    message: inquiry.message,
    created_at: inquiry.createdAt,
  });

  if (error) throw new Error(error.message);
}
