export type NutritionStepId =
  | "greeting"
  | "contact"
  | "location"
  | "dogCount"
  | "dogName"
  | "age"
  | "gender"
  | "reproductive"
  | "breed"
  | "weight"
  | "bodyCondition"
  | "activity"
  | "eatingHabits"
  | "currentDiet"
  | "brand"
  | "healthIssues"
  | "primaryGoal"
  | "complete";

export interface NutritionProfile {
  userName: string;
  email: string;
  phone: string;
  city: string;
  dogCount: string;
  dogName: string;
  age: string;
  gender: string;
  reproductive: string;
  breed: string;
  weightKg: string;
  bodyCondition: string;
  activity: string;
  eatingHabits: string;
  currentDiet: string;
  brand: string;
  healthIssues: string;
  primaryGoal: string;
}

export const EMPTY_PROFILE: NutritionProfile = {
  userName: "",
  email: "",
  phone: "",
  city: "",
  dogCount: "",
  dogName: "",
  age: "",
  gender: "",
  reproductive: "",
  breed: "",
  weightKg: "",
  bodyCondition: "",
  activity: "",
  eatingHabits: "",
  currentDiet: "",
  brand: "",
  healthIssues: "",
  primaryGoal: "",
};

const STEP_ORDER: NutritionStepId[] = [
  "greeting",
  "contact",
  "location",
  "dogCount",
  "dogName",
  "age",
  "gender",
  "reproductive",
  "breed",
  "weight",
  "bodyCondition",
  "activity",
  "eatingHabits",
  "currentDiet",
  "brand",
  "healthIssues",
  "primaryGoal",
  "complete",
];

export interface NutritionQuickOption {
  label: string;
  value: string;
}

function dog(profile: NutritionProfile, fallback: string): string {
  return profile.dogName.trim() || fallback;
}

function user(profile: NutritionProfile, fallback: string): string {
  return profile.userName.trim() || fallback;
}

const EN = {
  greeting:
    "Hello, I am AylopetAI · your dog's personal nutritionist. Before we begin, how should I address you?",
  contact: (p: NutritionProfile) =>
    `${user(p, "there")}, it's a pleasure to meet you. Please share your email and mobile number.`,
  location: "Which city do you and your four-legged friend live in?",
  dogCount: "How many dogs do you have?",
  dogName: "What is your four-legged friend's name?",
  age: (p: NutritionProfile) => `How old is ${dog(p, "your dog")}?`,
  gender: (p: NutritionProfile) => `What is ${dog(p, "your dog")}'s sex?`,
  reproductive: (p: NutritionProfile) =>
    `Is ${dog(p, "your dog")} neutered or spayed?`,
  breed: (p: NutritionProfile) => `What breed is ${dog(p, "your dog")}?`,
  weight: (p: NutritionProfile) =>
    `Approximately how many kilograms is ${dog(p, "your dog")}?`,
  bodyCondition: (p: NutritionProfile) =>
    `What body condition is ${dog(p, "your dog")} in?`,
  activity: (p: NutritionProfile) =>
    `How active is ${dog(p, "your dog")}?`,
  eatingHabits: (p: NutritionProfile) =>
    `During mealtime, ${dog(p, "your dog")}…`,
  currentDiet: (p: NutritionProfile) =>
    `What does ${dog(p, "your dog")} mostly eat?`,
  brand: "Which brand?",
  healthIssues: (p: NutritionProfile) =>
    `Does ${dog(p, "your dog")} have any health problems?`,
  primaryGoal: (p: NutritionProfile) =>
    `What is your main goal for ${dog(p, "your dog")}?`,
  complete: (p: NutritionProfile) =>
    `Thank you, ${user(p, "there")}! I have everything I need about ${dog(p, "your dog")}. Your personalized nutrition plan is being generated.`,
};

/** Exact Georgian questionnaire wording */
const KA = {
  greeting:
    "მოგესალმებით, მე ვარ AylopetAI, თქვენი ძაღლის პერსონალური ნუტრიციოლოგი. სანამ დავიწყებდეთ, როგორ მოგმართოთ?",
  contact: (p: NutritionProfile) =>
    `${user(p, "მეგობარო")}, სასიამოვნოა თქვენი გაცნობა. გთხოვთ, მიუთითოთ თქვენი მეილი და მობილურის ნომერი`,
  location: "რომელ ქალაქში ცხოვრობთ თქვენ და თქვენი ოთხფეხა მეგობარი?",
  dogCount: "რამდენი ძაღლი გყავთ?",
  dogName: "რა ჰქვია თქვენს ოთხფეხა მეგობარს?",
  age: (p: NutritionProfile) => `რა ასაკისაა ${dog(p, "თქვენი ძაღლი")}?`,
  gender: (p: NutritionProfile) => `${dog(p, "ძაღლის სახელი")}-ს სქესი?`,
  reproductive: (p: NutritionProfile) =>
    `არის თუ არა ${dog(p, "ძაღლის სახელი")} კასტრირებული ან სტერილიზებული?`,
  breed: (p: NutritionProfile) => `რა ჯიშისაა ${dog(p, "ძაღლის სახელი")}?`,
  weight: (p: NutritionProfile) =>
    `დაახლოებით რამდენი კილოგრამია ${dog(p, "ძაღლის სახელი")}?`,
  bodyCondition: (p: NutritionProfile) =>
    `როგორ ფორმაშია ${dog(p, "ძაღლის სახელი")}?`,
  activity: (p: NutritionProfile) =>
    `რამდენად აქტიურია ${dog(p, "ძაღლის სახელი")}?`,
  eatingHabits: (p: NutritionProfile) =>
    `კვების დროს ${dog(p, "ძაღლის სახელი")}…`,
  currentDiet: (p: NutritionProfile) =>
    `ძირითადად რას მიირთმევს ${dog(p, "ძაღლის სახელი")}?`,
  brand: "რომელ ბრენდს?",
  healthIssues: (p: NutritionProfile) =>
    `აქვს თუ არა ${dog(p, "ძაღლის სახელი")}-ს რაიმე ჯანმრთელობის პრობლემა?`,
  primaryGoal: (p: NutritionProfile) =>
    `რა არის თქვენი მთავარი მიზანი ${dog(p, "ძაღლის სახელი")}-სთვის?`,
  complete: (p: NutritionProfile) =>
    `გმადლობთ, ${user(p, "მეგობარო")}! ${dog(p, "ძაღლის სახელი")}-ს შესახებ ყველა საჭირო მონაცემი მაქვს. პერსონალური ნუტრიციის გეგმა მზადდება.`,
};

type LocaleBundle = typeof EN;

function bundle(locale: "ka" | "en"): LocaleBundle {
  return locale === "ka" ? KA : EN;
}

const OPTIONS_EN: Partial<Record<NutritionStepId, NutritionQuickOption[]>> = {
  gender: [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ],
  bodyCondition: [
    { label: "Very thin", value: "Very thin" },
    { label: "Ideal", value: "Ideal" },
    { label: "Rounded", value: "Rounded" },
    { label: "Overweight", value: "Overweight" },
  ],
  activity: [
    { label: "Not at all", value: "Not at all" },
    { label: "Active", value: "Active" },
    { label: "Super active", value: "Super active" },
    { label: "Athlete", value: "Athlete" },
  ],
  eatingHabits: [
    { label: "Picky eater", value: "Picky eater" },
    { label: "Sometimes picky", value: "Sometimes picky" },
    { label: "Eats well", value: "Eats well" },
    { label: "Eats everything", value: "Eats everything" },
  ],
  currentDiet: [
    { label: "Dry", value: "Dry" },
    { label: "Wet", value: "Wet" },
    { label: "Raw meat", value: "Raw meat" },
    { label: "Dehydrated", value: "Dehydrated" },
    { label: "Fresh Food", value: "Fresh Food" },
  ],
  primaryGoal: [
    { label: "Weight loss", value: "Weight loss" },
    { label: "Maintain", value: "Maintain" },
    { label: "Gain weight", value: "Gain weight" },
    { label: "Fix picky eating", value: "Fix picky eating" },
    { label: "Other", value: "Other" },
  ],
  reproductive: [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ],
};

const OPTIONS_KA: Partial<Record<NutritionStepId, NutritionQuickOption[]>> = {
  gender: [
    { label: "მამრი", value: "მამრი" },
    { label: "მდედრი", value: "მდედრი" },
  ],
  bodyCondition: [
    { label: "ძალიან სუსტი", value: "ძალიან სუსტი" },
    { label: "იდეალური", value: "იდეალური" },
    { label: "მომრგვალებული", value: "მომრგვალებული" },
    { label: "ჭარბწონიანი", value: "ჭარბწონიანი" },
  ],
  activity: [
    { label: "საერთოდ არა", value: "საერთოდ არა" },
    { label: "აქტიური", value: "აქტიური" },
    { label: "სუპერაქტიური", value: "სუპერაქტიური" },
    { label: "ათლეტი", value: "ათლეტი" },
  ],
  eatingHabits: [
    { label: "იწუნებს საჭმელს", value: "იწუნებს საჭმელს" },
    { label: "შეიძლება დაიწუნოს", value: "შეიძლება დაიწუნოს" },
    { label: "კარგად ჭამს", value: "კარგად ჭამს" },
    { label: "ყველაფერს ჭამს", value: "ყველაფერს ჭამს" },
  ],
  currentDiet: [
    { label: "მშრალი", value: "მშრალი" },
    { label: "სველი", value: "სველი" },
    { label: "უმი ხორცი", value: "უმი ხორცი" },
    { label: "გამომშრალი", value: "გამომშრალი" },
    { label: "Fresh Food", value: "Fresh Food" },
  ],
  primaryGoal: [
    { label: "წონის კლება", value: "წონის კლება" },
    { label: "შენარჩუნება", value: "შენარჩუნება" },
    { label: "მომატება", value: "მომატება" },
    { label: "უჭმელობის მოგვარება", value: "უჭმელობის მოგვარება" },
    { label: "სხვა", value: "სხვა" },
  ],
  reproductive: [
    { label: "დიახ", value: "დიახ" },
    { label: "არა", value: "არა" },
  ],
};

export function getStepPrompt(
  step: NutritionStepId,
  profile: NutritionProfile,
  locale: "ka" | "en" = "en",
): string {
  const t = bundle(locale);
  switch (step) {
    case "greeting":
      return t.greeting;
    case "contact":
      return t.contact(profile);
    case "location":
      return t.location;
    case "dogCount":
      return t.dogCount;
    case "dogName":
      return t.dogName;
    case "age":
      return t.age(profile);
    case "gender":
      return t.gender(profile);
    case "reproductive":
      return t.reproductive(profile);
    case "breed":
      return t.breed(profile);
    case "weight":
      return t.weight(profile);
    case "bodyCondition":
      return t.bodyCondition(profile);
    case "activity":
      return t.activity(profile);
    case "eatingHabits":
      return t.eatingHabits(profile);
    case "currentDiet":
      return t.currentDiet(profile);
    case "brand":
      return t.brand;
    case "healthIssues":
      return t.healthIssues(profile);
    case "primaryGoal":
      return t.primaryGoal(profile);
    case "complete":
      return t.complete(profile);
  }
}

export function getQuickOptions(
  step: NutritionStepId,
  locale: "ka" | "en" = "en",
): NutritionQuickOption[] {
  return (locale === "ka" ? OPTIONS_KA : OPTIONS_EN)[step] ?? [];
}

export function nextStep(current: NutritionStepId): NutritionStepId {
  const i = STEP_ORDER.indexOf(current);
  if (i < 0 || i >= STEP_ORDER.length - 1) return "complete";
  return STEP_ORDER[i + 1]!;
}

export function applyAnswer(
  step: NutritionStepId,
  answer: string,
  profile: NutritionProfile,
): NutritionProfile {
  const value = answer.trim();
  switch (step) {
    case "greeting":
      return { ...profile, userName: value };
    case "contact":
      return { ...profile, email: value, phone: value };
    case "location":
      return { ...profile, city: value };
    case "dogCount":
      return { ...profile, dogCount: value };
    case "dogName":
      return { ...profile, dogName: value };
    case "age":
      return { ...profile, age: value };
    case "gender":
      return { ...profile, gender: value };
    case "reproductive":
      return { ...profile, reproductive: value };
    case "breed":
      return { ...profile, breed: value };
    case "weight":
      return { ...profile, weightKg: value };
    case "bodyCondition":
      return { ...profile, bodyCondition: value };
    case "activity":
      return { ...profile, activity: value };
    case "eatingHabits":
      return { ...profile, eatingHabits: value };
    case "currentDiet":
      return { ...profile, currentDiet: value };
    case "brand":
      return { ...profile, brand: value };
    case "healthIssues":
      return { ...profile, healthIssues: value };
    case "primaryGoal":
      return { ...profile, primaryGoal: value };
    default:
      return profile;
  }
}

export function typingDelayMs(): number {
  return 900 + Math.floor(Math.random() * 500);
}
