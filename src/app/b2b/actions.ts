"use server";

import { sendB2BInquiryEmail } from "@/lib/b2b/email";
import { saveB2BInquiry } from "@/lib/b2b/storage";
import { b2bInquirySchema, type B2BInquiryInput } from "@/lib/b2b/types";

export type SubmitB2BResult =
  | { ok: true; emailed: boolean }
  | { ok: false; error: string };

function uid(): string {
  return `b2b_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function submitB2BInquiry(
  raw: B2BInquiryInput,
): Promise<SubmitB2BResult> {
  if (raw.website) {
    return { ok: false, error: "Submission rejected." };
  }

  const parsed = b2bInquirySchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Check your fields";
    return { ok: false, error: first };
  }

  try {
    const record = {
      ...parsed.data,
      id: uid(),
      createdAt: new Date().toISOString(),
    };

    await saveB2BInquiry(record);
    const { sent } = await sendB2BInquiryEmail(parsed.data);

    return { ok: true, emailed: sent };
  } catch {
    return { ok: false, error: "Could not submit inquiry. Please try again." };
  }
}
