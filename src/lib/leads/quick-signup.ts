import { z } from "zod";
import {
  primaryExpectationFromInterests,
  productInterests,
  type EarlyAdopterInput,
} from "@/lib/leads/types";

export const earlyAdopterQuickSchema = z.object({
  ownerName: z.string().min(2, "მიუთითე სახელი"),
  email: z.string().email("არასწორი ელ. ფოსტა"),
  phone: z
    .string()
    .min(9, "მიუთითე ტელეფონის ნომერი")
    .regex(/^[\d\s+()-]+$/, "არასწორი ტელეფონის ფორმატი"),
  city: z.string().optional(),
  dogName: z.string().optional(),
  productInterests: z
    .array(z.enum(productInterests))
    .min(1, "აირჩიე მინიმუმ ერთი პროდუქტი"),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "თანხმობა სავალდებულოა" }),
});

export type EarlyAdopterQuickInput = z.infer<typeof earlyAdopterQuickSchema>;

export function quickToFullLead(quick: EarlyAdopterQuickInput): EarlyAdopterInput {
  const dog = quick.dogName?.trim();
  return {
    ownerName: quick.ownerName.trim(),
    email: quick.email.trim().toLowerCase(),
    phone: quick.phone.trim(),
    city: quick.city?.trim() || "თბილისი",
    dogName: dog && dog.length > 0 ? dog : "·",
    breed: "·",
    ageMonths: 24,
    weightKg: 12,
    neutered: true,
    allergies: [],
    primaryGoal: "not-sure",
    productExpectation: primaryExpectationFromInterests(
      quick.productInterests,
    ),
    productInterests: quick.productInterests,
    featureExpectations: ["personalized-portions"],
    featureWishlist: dog
      ? `Quick signup · profile for ${dog} to be completed`
      : "Quick waitlist signup · full profile to be completed",
    referralSource: "other",
    notes: "quick-signup",
    wantsDnaKit: false,
    consent: true,
  };
}
