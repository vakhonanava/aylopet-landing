import type { OnboardingCopy, QuizGateCopy, ReviewsCopy, DnaPortalCopy } from "@/lib/i18n/types";

export const onboardingKa: OnboardingCopy = {
  meta: {
    eyebrow: "AylopetAI-ის გაცნობა",
    title: "გავიცნოთ თქვენი ძაღლი",
    description:
      "17-ნაბიჯიანი ინტერაქტიული ქვიზი · AylopetAI თქვენი პასუხების საფუძველზე ამზადებს პერსონალურ კვების პროფილს.",
  },
};

export const quizGateKa: QuizGateCopy = {
  title: "ჯერ შემოუერთდი Early Adopter სიას",
  description:
    "AylopetAI-ზე წვდომისთვის ჯერ დარეგისტრირდი მოლოდინის სიაში. შენ და შენი ძაღლი მიიღებთ 40% ფასდაკლებას და უფასო კონსულტაციას.",
  ctaRegister: "რეგისტრაცია სიაში",
  ctaHome: "მთავარი გვერდი",
  waitingNote: "რეგისტრაციის შემდეგ AylopetAI ავტომატურად გაიხსნება.",
};

export const reviewsKa: ReviewsCopy = {
  title: "შეფასებები",
  description: "რეალური გამოცდილებები Early Adopter მეგობრებისგან.",
  editTitle: "შენი შეფასება",
  editSubtitle: "შეგიძლია განაახლო შენი კომენტარი ნებისმიერ დროს.",
  formTitle: "გაგვიზიარე შენი ისტორია",
  formSubtitle:
    "დაწერე როგორ ეხმარება Aylopet შენს ოთხფეხა მეგობარს — შეგიძლია ფოტოსაც ატვირთო.",
  nameLabel: "სახელი",
  namePlaceholder: "მაგ. ნინო",
  dogInfo: "ძაღლი (სახელი · ჯიში)",
  dogInfoPlaceholder: "მაგ. ბელი · Golden Retriever",
  quote: "შენი გამოცდილება",
  quotePlaceholder: "გაგვიზიარე რა შეცვალა Aylopet-მა...",
  rating: "რეიტინგი",
  save: "შენახვა",
  saved: "შენახულია!",
  submitReview: "გაზიარება",
  photoLabel: "ფოტო",
  photoHint: "JPG, PNG ან WebP · მაქს. 800 KB",
  addPhoto: "ატვირთვა",
  removePhoto: "წაშლა",
  photoTooLarge: "ფოტო ძალიან დიდია. სცადე უფრო პატარა ფაილი.",
  loginPrompt: "შეფასების დასაწერად ჯერ დარეგისტრირდი Early Adopter პროგრამაში.",
  loginCta: "რეგისტრაცია",
  noReviews: "ჯერ არ არის შეფასებები.",
};

export const dnaPortalKa: DnaPortalCopy = {
  badge: "მალე",
  title: "DNA პორტალი მალე იქნება ხელმისაწვდომი",
  description:
    "ვმუშაობთ გენომური ანალიზის პორტალზე · ნიმუშის ტრეკინგი, ჯიშის შემადგენლობა და გენეტიკური ჯანმრთელობის რჩევები.",
  features: [
    "200,000+ გენეტიკური მარკერი",
    "ჯიშის დიაგრამა და ალერგიის რისკები",
    "პერსონალური კვების რეკომენდაციები",
  ],
  ctaWaitlist: "შემოუერთდი სიას",
  ctaNutrition: "AylopetAI",
  note: "Early Adopter-ებმა პირველებმა მიიღებენ წვდომას.",
};
