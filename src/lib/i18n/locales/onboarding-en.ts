import type { OnboardingCopy, QuizGateCopy, ReviewsCopy, DnaPortalCopy } from "@/lib/i18n/types";

export const onboardingEn: OnboardingCopy = {
  meta: {
    eyebrow: "AylopetAI Onboarding",
    title: "Let's get to know your dog",
    description:
      "A quick 17-step interactive quiz · AylopetAI uses your answers to build a personalized nutrition profile.",
  },
};

export const quizGateEn: QuizGateCopy = {
  title: "Join the Early Adopter waitlist first",
  description:
    "To access AylopetAI, register on the waitlist first. You and your dog get 40% off and a free consultation.",
  ctaRegister: "Join waitlist",
  ctaHome: "Back to home",
  waitingNote: "After registration, AylopetAI will unlock automatically.",
};

export const reviewsEn: ReviewsCopy = {
  title: "Reviews",
  description: "Real experiences from Early Adopter families.",
  editTitle: "Your review",
  editSubtitle: "You can update your comment anytime.",
  dogInfo: "Dog (name · breed)",
  dogInfoPlaceholder: "e.g. Bella · Golden Retriever",
  quote: "Your experience",
  quotePlaceholder: "Share what Aylopet changed for you...",
  rating: "Rating",
  save: "Save",
  saved: "Saved!",
  loginPrompt: "Register as an Early Adopter to write a review.",
  loginCta: "Register",
  noReviews: "No reviews yet.",
};

export const dnaPortalEn: DnaPortalCopy = {
  badge: "Coming soon",
  title: "DNA portal coming soon",
  description:
    "We're building the genomic portal · sample tracking, breed composition, and genetic health guidance.",
  features: [
    "200,000+ genetic markers",
    "Breed chart and allergy risk flags",
    "Personalized feeding recommendations",
  ],
  ctaWaitlist: "Join waitlist",
  ctaNutrition: "AylopetAI",
  note: "Early Adopters will get access first.",
};
