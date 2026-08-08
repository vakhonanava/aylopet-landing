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
  title: "Join the Ambassador waitlist first",
  description:
    "To access AylopetAI, register on the waitlist first. You and your dog get 40% off and a free consultation.",
  ctaRegister: "Join waitlist",
  ctaHome: "Back to home",
  waitingNote: "After registration, AylopetAI will unlock automatically.",
};

export const reviewsEn: ReviewsCopy = {
  title: "Reviews",
  description: "Real experiences from Ambassador families.",
  editTitle: "Your review",
  editSubtitle: "You can update your comment anytime.",
  formTitle: "Share your story",
  formSubtitle: "Tell us how Aylopet helps your dog — you can upload a photo too.",
  sectionHelper:
    "This space is yours: share your experience with Aylopet, tell us what your dog needs, suggest a feature, or simply ask a question — we read every comment and use it to shape the product.",
  writeCta: "Write a comment",
  closeForm: "Close",
  authRequired:
    "You need to be signed in to write a comment. It keeps every comment genuine.",
  authLoginCta: "Log in",
  authRegisterCta: "Register",
  nameLabel: "Name",
  namePlaceholder: "e.g. Nina",
  dogInfo: "Dog (name · breed)",
  dogInfoPlaceholder: "e.g. Bella · Golden Retriever",
  quote: "Your experience",
  quotePlaceholder: "Share what Aylopet changed for you...",
  rating: "Rating",
  save: "Save",
  saved: "Saved!",
  submitReview: "Share",
  photoLabel: "Photo",
  photoHint: "JPG, PNG or WebP · max 800 KB",
  addPhoto: "Upload",
  removePhoto: "Remove",
  photoTooLarge: "Photo is too large. Try a smaller file.",
  loginPrompt: "Register as an Ambassador to write a review.",
  loginCta: "Register",
  noReviews: "No reviews yet.",
};

export const dnaPortalEn: DnaPortalCopy = {
  badge: "Coming soon",
  title: "DNA portal coming soon",
  description:
    "We're building the genomic portal · sample tracking, breed composition, and genetic health guidance.",
  features: [
    "230,000+ genetic markers",
    "Breed chart and allergy risk flags",
    "Personalized feeding recommendations",
  ],
  ctaWaitlist: "Join waitlist",
  ctaNutrition: "AylopetAI",
  note: "Ambassadors will get access first.",
};
