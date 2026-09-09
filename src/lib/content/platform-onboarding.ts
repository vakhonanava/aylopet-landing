/**
 * Copy for the public waitlist flow at `/onboarding/platform`.
 *
 * This form had no English version at all — every label was an inline Georgian
 * literal, so switching the language in the header left the whole three-step
 * flow untranslated. The enum labels that used to live in `lib/platform/types`
 * are resolved here too, since those are display strings rather than data.
 */

import type {
  PetFileCategory,
  PetPrimaryGoal,
  WaitlistExpectation,
} from "@/lib/platform/types";

export interface PlatformOnboardingCopy {
  eyebrow: string;
  title: string;
  stepIndicator: string;

  counterSuffix: string;

  stepOneTitle: string;
  stepOneSubtitle: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  expectationsLabel: string;
  continueCta: string;
  alreadyHaveAccount: string;
  signIn: string;

  stepTwoTitle: string;
  ownerLine: string;
  dogName: string;
  breed: string;
  ageOrDob: string;
  weight: string;
  male: string;
  female: string;
  neutered: string;
  primaryGoal: string;
  medicalNotes: string;
  uploadDocumentsCta: string;

  stepThreeTitle: string;
  dropzone: string;
  uploadedOk: string;
  finishEditProfile: string;
  finishGoToDashboard: string;
  privacyNote: string;

  errors: {
    supabaseMissing: string;
    pickExpectation: string;
    alreadyOnWaitlist: string;
    accountNotCreated: string;
    petFieldsMissing: string;
    petCreateFailed: string;
    uploadFailed: string;
    invalidFileType: string;
    fileTooLarge: string;
  };

  expectationLabels: Record<WaitlistExpectation, string>;
  fileCategoryLabels: Record<PetFileCategory, string>;
  primaryGoalLabels: Record<PetPrimaryGoal, string>;
}

export const PLATFORM_ONBOARDING_KA: PlatformOnboardingCopy = {
  eyebrow: "Aylopet Platform Onboarding",
  title: "შექმენი პერსონალური პლატფორმა",
  stepIndicator: "ნაბიჯი {step} / 3, მონაცემები private-ია და დაცულია RLS-ით",

  counterSuffix: "Pet Parent უკვე მოლოდინის სიაშია",

  stepOneTitle: "ვეითლისტი & ანგარიში",
  stepOneSubtitle: "შეუერთდი waitlist-ს და შექმენი უსაფრთხო ანგარიში.",
  fullName: "სრული სახელი",
  email: "ელ. ფოსტა",
  phone: "ტელეფონი",
  password: "პაროლი",
  expectationsLabel: "რას ელოდები Aylopet-ისგან? (აირჩიე რამდენიმე)",
  continueCta: "გაგრძელება",
  alreadyHaveAccount: "უკვე გაქვს ანგარიში?",
  signIn: "შესვლა",

  stepTwoTitle: "პირადი & ძაღლის პროფილი",
  ownerLine: "მფლობელი",
  dogName: "ძაღლის სახელი",
  breed: "ჯიში",
  ageOrDob: "ასაკი / დაბ. თარიღი",
  weight: "წონა",
  male: "მამრობითი",
  female: "მდედრობითი",
  neutered: "კასტრაცია / სტერილიზაცია",
  primaryGoal: "მთავარი მიზანი",
  medicalNotes: "სამედიცინო შენიშვნები",
  uploadDocumentsCta: "დოკუმენტების ატვირთვა",

  stepThreeTitle: "ფაილების ატვირთვა",
  dropzone: "ჩააგდე ფაილები ან დააჭირე",
  uploadedOk: "წარმატებით აიტვირთა",
  finishEditProfile: "დასრულება, პროფილის რედაქტირება",
  finishGoToDashboard: "დასრულება, პანელში გადასვლა",
  privacyNote:
    "თქვენი მონაცემები დაცულია. ანალიზები გამოიყენება ექსკლუზიურად AylopetAI-ის მიერ დაავადებების პრევენციისა და ინდივიდუალური ველნეს გეგმის შესადგენად.",

  errors: {
    supabaseMissing: "Supabase არ არის კონფიგურირებული.",
    pickExpectation: "აირჩიე მინიმუმ ერთი მოლოდინი.",
    alreadyOnWaitlist:
      "თქვენ უკვე ხართ ჩვენს მოლოდინის სიაში! შეტყობინებას მოგივლენთ დაუყოვნებლივ გაშვებისთანავე.",
    accountNotCreated: "ანგარიში ვერ შეიქმნა.",
    petFieldsMissing: "შეავსე ძაღლის სახელი და ჯიში.",
    petCreateFailed: "ცხოველის პროფილი ვერ შეიქმნა.",
    uploadFailed: "ატვირთვა ვერ მოხერხდა.",
    invalidFileType: "დასაშვებია მხოლოდ PDF, JPEG ან PNG.",
    fileTooLarge: "მაქსიმუმ 10MB.",
  },

  expectationLabels: {
    ai_nutrition_plan: "AI ნუტრიციის გეგმა",
    genetic_health_screening: "გენეტიკური სკრინინგი",
    smart_collar_sync: "Smart Collar სინქრონიზაცია",
    vet_ai_assistant: "Vet AI ასისტენტი",
  },
  fileCategoryLabels: {
    vet_medical: "სამედიცინო ისტორია / ანალიზები",
    dna_genetic: "DNA ტესტის პასუხები",
    allergy_bloodwork: "ალერგია / სისხლის ტესტი",
    general: "სხვა დოკუმენტები",
  },
  primaryGoalLabels: {
    weight_management: "წონის მართვა",
    allergy_prevention: "ალერგიის პრევენცია",
    longevity_dna: "გრძელვადიანი ჯანმრთელობა & DNA",
    performance: "აქტიურობა & ფორმა",
  },
};

export const PLATFORM_ONBOARDING_EN: PlatformOnboardingCopy = {
  eyebrow: "Aylopet Platform Onboarding",
  title: "Set up your personal platform",
  stepIndicator: "Step {step} of 3 · your data is private and protected by RLS",

  counterSuffix: "pet parents are already on the waitlist",

  stepOneTitle: "Waitlist & account",
  stepOneSubtitle: "Join the waitlist and create a secure account.",
  fullName: "Full name",
  email: "Email",
  phone: "Phone",
  password: "Password",
  expectationsLabel: "What do you expect from Aylopet? (pick any)",
  continueCta: "Continue",
  alreadyHaveAccount: "Already have an account?",
  signIn: "Sign in",

  stepTwoTitle: "Your profile & your dog",
  ownerLine: "Owner",
  dogName: "Dog's name",
  breed: "Breed",
  ageOrDob: "Age / date of birth",
  weight: "Weight",
  male: "Male",
  female: "Female",
  neutered: "Neutered / spayed",
  primaryGoal: "Primary goal",
  medicalNotes: "Medical notes",
  uploadDocumentsCta: "Upload documents",

  stepThreeTitle: "Upload files",
  dropzone: "Drop files here or click to choose",
  uploadedOk: "Uploaded successfully",
  finishEditProfile: "Finish and edit the profile",
  finishGoToDashboard: "Finish and open the dashboard",
  privacyNote:
    "Your data is protected. Lab results are used exclusively by AylopetAI to prevent disease and build an individual wellness plan.",

  errors: {
    supabaseMissing: "Supabase is not configured.",
    pickExpectation: "Pick at least one expectation.",
    alreadyOnWaitlist:
      "You're already on our waitlist! We'll notify you the moment we launch.",
    accountNotCreated: "The account could not be created.",
    petFieldsMissing: "Fill in your dog's name and breed.",
    petCreateFailed: "The pet profile could not be created.",
    uploadFailed: "Upload failed.",
    invalidFileType: "Only PDF, JPEG, or PNG are accepted.",
    fileTooLarge: "Maximum 10MB.",
  },

  expectationLabels: {
    ai_nutrition_plan: "AI nutrition plan",
    genetic_health_screening: "Genetic screening",
    smart_collar_sync: "Smart Collar sync",
    vet_ai_assistant: "Vet AI assistant",
  },
  fileCategoryLabels: {
    vet_medical: "Medical history / lab results",
    dna_genetic: "DNA test results",
    allergy_bloodwork: "Allergy / blood test",
    general: "Other documents",
  },
  primaryGoalLabels: {
    weight_management: "Weight management",
    allergy_prevention: "Allergy prevention",
    longevity_dna: "Long-term health & DNA",
    performance: "Activity & condition",
  },
};

export function getPlatformOnboardingCopy(
  locale: "ka" | "en",
): PlatformOnboardingCopy {
  return locale === "ka" ? PLATFORM_ONBOARDING_KA : PLATFORM_ONBOARDING_EN;
}
