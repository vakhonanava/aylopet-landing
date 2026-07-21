import { z } from "zod";

export const b2bPartnershipTypes = [
  "vet-clinic",
  "retail",
  "corporate",
  "breeder",
  "manufacturer",
  "other",
] as const;

export const b2bInquirySchema = z.object({
  companyName: z.string().min(2, "Enter company name"),
  contactName: z.string().min(2, "Enter contact name"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(9, "Enter a valid phone number")
    .regex(/^[\d\s+()-]+$/, "Invalid phone format"),
  partnershipType: z.enum(b2bPartnershipTypes),
  message: z.string().min(20, "Tell us more about your partnership goals"),
  website: z.string().max(0).optional(),
});

export type B2BInquiryInput = z.infer<typeof b2bInquirySchema>;

export interface StoredB2BInquiry extends B2BInquiryInput {
  id: string;
  createdAt: string;
}

export const PARTNERSHIP_TYPE_LABELS: Record<
  (typeof b2bPartnershipTypes)[number],
  string
> = {
  "vet-clinic": "Veterinary clinic / hospital",
  retail: "Pet retail or e-commerce",
  corporate: "Corporate employee benefits",
  breeder: "Breeder or kennel",
  manufacturer: "Manufacturer / supplier",
  other: "Other partnership",
};
