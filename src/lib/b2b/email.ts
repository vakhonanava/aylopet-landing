import type { B2BInquiryInput } from "@/lib/b2b/types";
import { PARTNERSHIP_TYPE_LABELS } from "@/lib/b2b/types";

export async function sendB2BInquiryEmail(
  data: B2BInquiryInput,
): Promise<{ sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.B2B_INBOX_EMAIL ?? process.env.CONTACT_EMAIL;
  const from =
    process.env.B2B_FROM_EMAIL ?? "Aylopet B2B <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return { sent: false };
  }

  const partnership =
    PARTNERSHIP_TYPE_LABELS[data.partnershipType] ?? data.partnershipType;
  const custom = data.customType?.trim();
  const partnershipLine = custom
    ? `${partnership} · ${custom}`
    : partnership;

  const body = [
    `New B2B partnership inquiry`,
    ``,
    `Company: ${data.companyName}`,
    `Contact: ${data.contactName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Partnership type: ${partnershipLine}`,
    ``,
    `Message:`,
    data.message,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.email,
      subject: `[Aylopet B2B] ${data.companyName} · ${partnershipLine}`,
      text: body,
    }),
  });

  if (!response.ok) {
    return { sent: false };
  }

  return { sent: true };
}
