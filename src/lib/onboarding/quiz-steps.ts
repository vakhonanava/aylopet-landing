import {
  AlertCircle,
  Beef,
  CircleCheck,
  Circle,
  Droplet,
  Footprints,
  Frown,
  Leaf,
  Mars,
  Moon,
  Scale,
  Smile,
  Sparkles,
  Sun,
  TrendingDown,
  TrendingUp,
  Trophy,
  Utensils,
  Venus,
  Wheat,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/lib/i18n/types";

export type Gender = "male" | "female";
export type YesNo = "yes" | "no";
export type BodyConditionId = "very-skinny" | "ideal" | "round" | "overweight";
export type ActivityId = "none" | "active" | "super-active" | "athlete";
export type AppetiteId =
  | "very-picky"
  | "occasional"
  | "eats-well"
  | "eats-everything";
export type CurrentDietId = "kibble" | "wet" | "raw" | "dehydrated" | "fresh";
export type GoalId =
  | "weight-loss"
  | "maintenance"
  | "weight-gain"
  | "picky-fix"
  | "other";

export interface OnboardingQuizState {
  userName: string;
  email: string;
  phone: string;
  city: string;
  dogCount: number;
  dogName: string;
  ageYears: number | null;
  ageMonths: number | null;
  gender: Gender | null;
  neutered: YesNo | null;
  breed: string;
  weightKg: number | null;
  bodyCondition: BodyConditionId | null;
  activity: ActivityId | null;
  appetite: AppetiteId | null;
  currentDiet: CurrentDietId | null;
  brand: string;
  healthNotes: string;
  primaryGoal: GoalId | null;
}

export const TOTAL_STEPS = 17;

export const INITIAL_QUIZ_STATE: OnboardingQuizState = {
  userName: "",
  email: "",
  phone: "",
  city: "",
  dogCount: 1,
  dogName: "",
  ageYears: null,
  ageMonths: null,
  gender: null,
  neutered: null,
  breed: "",
  weightKg: null,
  bodyCondition: null,
  activity: null,
  appetite: null,
  currentDiet: null,
  brand: "",
  healthNotes: "",
  primaryGoal: null,
};

/** Steps that are optional · Continue is always enabled. */
export const OPTIONAL_STEPS: readonly number[] = [15, 16];

export const CITY_SUGGESTIONS: Record<Locale, string[]> = {
  ka: [
    "თბილისი", "ბათუმი", "ქუთაისი", "რუსთავი", "გორი", "ზუგდიდი", "ფოთი",
    "თელავი", "ოზურგეთი", "ქობულეთი", "ახალციხე", "მარნეული", "საგარეჯო",
    "სენაკი", "ზესტაფონი", "საჩხერე", "ხაშური", "სამტრედია", "წყალტუბო", "ბორჯომი",
  ],
  en: [
    "Tbilisi", "Batumi", "Kutaisi", "Rustavi", "Gori", "Zugdidi", "Poti",
    "Telavi", "Ozurgeti", "Kobuleti", "Akhaltsikhe", "Marneuli", "Sagarejo",
    "Senaki", "Zestaponi", "Sachkhere", "Khashuri", "Samtredia", "Tskaltubo", "Borjomi",
  ],
};

export { POPULAR_BREED_SUGGESTIONS as BREED_SUGGESTIONS } from "@/lib/content/dog-breeds";

interface OptionConfig<T extends string> {
  value: T;
  icon: LucideIcon;
}

export const BODY_CONDITION_OPTIONS: readonly OptionConfig<BodyConditionId>[] = [
  { value: "very-skinny", icon: TrendingDown },
  { value: "ideal", icon: CircleCheck },
  { value: "round", icon: Circle },
  { value: "overweight", icon: TrendingUp },
];

export const ACTIVITY_OPTIONS: readonly OptionConfig<ActivityId>[] = [
  { value: "none", icon: Moon },
  { value: "active", icon: Footprints },
  { value: "super-active", icon: Zap },
  { value: "athlete", icon: Trophy },
];

export const APPETITE_OPTIONS: readonly OptionConfig<AppetiteId>[] = [
  { value: "very-picky", icon: Frown },
  { value: "occasional", icon: AlertCircle },
  { value: "eats-well", icon: Smile },
  { value: "eats-everything", icon: Utensils },
];

export const CURRENT_DIET_OPTIONS: readonly OptionConfig<CurrentDietId>[] = [
  { value: "kibble", icon: Wheat },
  { value: "wet", icon: Droplet },
  { value: "raw", icon: Beef },
  { value: "dehydrated", icon: Sun },
  { value: "fresh", icon: Leaf },
];

export const GOAL_OPTIONS: readonly OptionConfig<GoalId>[] = [
  { value: "weight-loss", icon: TrendingDown },
  { value: "maintenance", icon: Scale },
  { value: "weight-gain", icon: TrendingUp },
  { value: "picky-fix", icon: Utensils },
  { value: "other", icon: Sparkles },
];

export const GENDER_ICONS: Record<Gender, LucideIcon> = {
  male: Mars,
  female: Venus,
};

function dogFallback(state: OnboardingQuizState, locale: Locale): string {
  return state.dogName.trim() || (locale === "ka" ? "თქვენი ძაღლი" : "your dog");
}

function demoDogFallback(state: OnboardingQuizState, locale: Locale): string {
  return state.dogName.trim() || (locale === "ka" ? "როკი" : "Rocky");
}

/**
 * Closing nutritionist recommendation shown on the onboarding completion
 * screen · wording mirrors AylopetAI's official final recommendation copy,
 * substituting in the dog's real name when available.
 */
export function buildNutritionRecommendation(
  state: OnboardingQuizState,
  locale: Locale,
): string {
  const dog = demoDogFallback(state, locale);

  if (locale === "ka") {
    return `თქვენი შეყვანილი მონაცემების საფუძველზე, ${dog}-ის იდეალური ფორმისა და მგრძნობიარე საჭმლის მომნელებელი სისტემის გათვალისწინებით, შერჩეულია ცოცხალი საკვების რაციონი: „ინდაურისა და საქონლის" რეცეპტებით.

დღიური ნორმა და მაკრონუტრიენტები:
დღიური პორცია: 200 გრამი (100გ დილით / 100გ საღამოს)
ენერგეტიკული ღირებულება: 400 კკალ

კვებითი ღირებულება (მშრალ ნივთიერებაზე):
ცილა: 30%
ცხიმი: 14%
ბოჭკო: 3.5%
ტენიანობა: 70%

ნუტრიციოლოგის რეკომენდაცია: რეცეპტი სრულად აკმაყოფილებს FEDIAF-ის სტანდარტებს. წონის იდეალური შენარჩუნებისთვის, დაიცავით მითითებული დოზირება და ახალ კვებაზე გადაიყვანეთ 7-დღიანი ეტაპობრივი მიჩვევის პრინციპით.`;
  }

  return `Based on the information you shared, and factoring in ${dog}'s ideal body condition and sensitive digestive system, we've selected a fresh-food ration: the "Turkey & Beef" recipe.

Daily allowance & macronutrients:
Daily portion: 200 g (100g morning / 100g evening)
Energy value: 400 kcal

Nutritional value (on a dry-matter basis):
Protein: 30%
Fat: 14%
Fiber: 3.5%
Moisture: 70%

Nutritionist's recommendation: This recipe fully meets FEDIAF standards. To maintain ${dog}'s ideal weight, follow the dosing above and transition to the new food gradually, using a 7-day step-by-step adjustment period.`;
}

function userFallback(state: OnboardingQuizState, locale: Locale): string {
  return state.userName.trim() || (locale === "ka" ? "მეგობარო" : "there");
}

export interface StepCopy {
  title: string;
  subtitle?: string;
}

export function getStepCopy(
  step: number,
  locale: Locale,
  state: OnboardingQuizState,
): StepCopy {
  const dog = dogFallback(state, locale);
  const user = userFallback(state, locale);

  if (locale === "ka") {
    switch (step) {
      case 1:
        return {
          title:
            "მოგესალმებით, მე ვარ AylopetAI - თქვენი ძაღლის პერსონალური ნუტრიციოლოგი. სანამ დავიწყებდეთ, როგორ მოგმართოთ?",
        };
      case 2:
        return {
          title: `${user}, სასიამოვნოა თქვენი გაცნობა. გთხოვთ, მიუთითოთ თქვენი მეილი და მობილურის ნომერი.`,
        };
      case 3:
        return { title: "რომელ ქალაქში ცხოვრობთ თქვენ და თქვენი ოთხფეხა მეგობარი?" };
      case 4:
        return { title: "რამდენი ძაღლი გყავთ?" };
      case 5:
        return { title: "რა ჰქვია თქვენს ოთხფეხა მეგობარს?" };
      case 6:
        return { title: `რა ასაკისაა ${dog}?` };
      case 7:
        return { title: `რა სქესისაა ${dog}?` };
      case 8:
        return { title: `არის თუ არა ${dog} კასტრირებული ან სტერილიზებული?` };
      case 9:
        return { title: `რა ჯიშის არის ${dog}?` };
      case 10:
        return { title: `დაახლოებით რამდენი კილოგრამია ${dog}?` };
      case 11:
        return { title: `როგორ ფორმაშია ${dog}?` };
      case 12:
        return { title: `რამდენად აქტიურია ${dog}?` };
      case 13:
        return { title: `როგორი მადა აქვს ${dog}-ს?` };
      case 14:
        return { title: `ძირითადად რას მიირთმევს ${dog}?` };
      case 15:
        return { title: `რომელ ბრენდს მიირთმევს ${dog}?` };
      case 16:
        return { title: `აქვს თუ არა ${dog}-ს რაიმე ჯანმრთელობის პრობლემა ან ალერგია?` };
      case 17:
        return { title: `რა არის თქვენი მთავარი მიზანი ${dog}-სთვის?` };
      default:
        return { title: "" };
    }
  }

  switch (step) {
    case 1:
      return {
        title:
          "Welcome! I am AylopetAI - your dog's personal nutritionist. Before we begin, how should I address you?",
      };
    case 2:
      return { title: `Nice to meet you, ${user}. Please provide your email and phone number.` };
    case 3:
      return { title: "In which city do you and your four-legged friend live?" };
    case 4:
      return { title: "How many dogs do you have?" };
    case 5:
      return { title: "What is your four-legged friend's name?" };
    case 6:
      return { title: `How old is ${dog}?` };
    case 7:
      return { title: `What is ${dog}'s gender?` };
    case 8:
      return { title: `Is ${dog} neutered or spayed?` };
    case 9:
      return { title: `What breed is ${dog}?` };
    case 10:
      return { title: `Roughly how many kilograms does ${dog} weigh?` };
    case 11:
      return { title: `What shape is ${dog} in?` };
    case 12:
      return { title: `How active is ${dog}?` };
    case 13:
      return { title: `What is ${dog}'s appetite like?` };
    case 14:
      return { title: `What does ${dog} mostly eat?` };
    case 15:
      return { title: `Which brand of food does ${dog} eat?` };
    case 16:
      return { title: `Does ${dog} have any health issues or allergies?` };
    case 17:
      return { title: `What is your main goal for ${dog}?` };
    default:
      return { title: "" };
  }
}

export interface QuizUiCopy {
  nav: {
    stepLabel: string;
    ofLabel: string;
    back: string;
    continue: string;
    finish: string;
  };
  errors: {
    required: string;
    email: string;
    phone: string;
  };
  fields: {
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    cityPlaceholder: string;
    dogsLabel: string;
    dogNamePlaceholder: string;
    yearsLabel: string;
    monthsLabel: string;
    weightPlaceholder: string;
    weightUnit: string;
    breedPlaceholder: string;
    brandPlaceholder: string;
    healthPlaceholder: string;
    optionalBadge: string;
  };
  gender: Record<Gender, string>;
  yesNo: Record<YesNo, string>;
  bodyCondition: Record<BodyConditionId, string>;
  activity: Record<ActivityId, string>;
  appetite: Record<AppetiteId, string>;
  currentDiet: Record<CurrentDietId, string>;
  goal: Record<GoalId, string>;
  complete: {
    title: string;
    subtitle: string;
    summaryTitle: string;
    dogLabel: string;
    breedLabel: string;
    weightLabel: string;
    goalLabel: string;
    recommendationTitle: string;
    ctaChat: string;
    ctaHome: string;
    restart: string;
  };
}

const EN: QuizUiCopy = {
  nav: { stepLabel: "Step", ofLabel: "of", back: "Back", continue: "Continue", finish: "Finish" },
  errors: {
    required: "This field is required.",
    email: "Enter a valid email address.",
    phone: "Enter a valid phone number.",
  },
  fields: {
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    phoneLabel: "Phone",
    phonePlaceholder: "+995 5xx xx xx xx",
    cityPlaceholder: "Start typing a city...",
    dogsLabel: "dogs",
    dogNamePlaceholder: "Your dog's name",
    yearsLabel: "Years",
    monthsLabel: "Months",
    weightPlaceholder: "e.g. 24",
    weightUnit: "kg",
    breedPlaceholder: "Start typing a breed...",
    brandPlaceholder: "e.g. Royal Canin",
    healthPlaceholder: "e.g. seasonal allergies, joint sensitivity... (optional)",
    optionalBadge: "Optional",
  },
  gender: { male: "Male", female: "Female" },
  yesNo: { yes: "Yes", no: "No" },
  bodyCondition: {
    "very-skinny": "Very Skinny",
    ideal: "Ideal",
    round: "Round / Soft",
    overweight: "Overweight",
  },
  activity: {
    none: "Not at all",
    active: "Active",
    "super-active": "Super Active",
    athlete: "Athlete",
  },
  appetite: {
    "very-picky": "Very picky",
    occasional: "Might reject occasionally",
    "eats-well": "Eats well",
    "eats-everything": "Eats everything",
  },
  currentDiet: {
    kibble: "Kibble",
    wet: "Wet Food",
    raw: "Raw Meat",
    dehydrated: "Dehydrated",
    fresh: "Fresh Food",
  },
  goal: {
    "weight-loss": "Weight loss",
    maintenance: "Maintenance",
    "weight-gain": "Weight gain",
    "picky-fix": "Solving picky eating",
    other: "Other",
  },
  complete: {
    title: "Thank you!",
    subtitle: "Your dog's nutrition profile is ready. AylopetAI is building a personalized plan.",
    summaryTitle: "Your summary",
    dogLabel: "Dog",
    breedLabel: "Breed",
    weightLabel: "Weight",
    goalLabel: "Goal",
    recommendationTitle: "Nutritionist's recommendation",
    ctaChat: "Continue with AylopetAI",
    ctaHome: "Back to home",
    restart: "Edit answers",
  },
};

const KA: QuizUiCopy = {
  nav: { stepLabel: "ნაბიჯი", ofLabel: "/", back: "უკან", continue: "გაგრძელება", finish: "დასრულება" },
  errors: {
    required: "ეს ველი სავალდებულოა.",
    email: "მიუთითეთ სწორი ელ. ფოსტა.",
    phone: "მიუთითეთ სწორი ტელეფონის ნომერი.",
  },
  fields: {
    namePlaceholder: "თქვენი სახელი",
    emailLabel: "ელ. ფოსტა",
    emailPlaceholder: "you@example.com",
    phoneLabel: "ტელეფონი",
    phonePlaceholder: "+995 5xx xx xx xx",
    cityPlaceholder: "დაიწყეთ ქალაქის აკრეფა...",
    dogsLabel: "ძაღლი",
    dogNamePlaceholder: "თქვენი ძაღლის სახელი",
    yearsLabel: "წელი",
    monthsLabel: "თვე",
    weightPlaceholder: "მაგ. 24",
    weightUnit: "კგ",
    breedPlaceholder: "დაიწყეთ ჯიშის აკრეფა...",
    brandPlaceholder: "მაგ. Royal Canin",
    healthPlaceholder: "მაგ. სეზონური ალერგია, სახსრების მგრძნობელობა... (არასავალდებულო)",
    optionalBadge: "არასავალდებულო",
  },
  gender: { male: "ხვადალი", female: "ძუ" },
  yesNo: { yes: "დიახ", no: "არა" },
  bodyCondition: {
    "very-skinny": "ძალიან სუსტი",
    ideal: "იდეალური",
    round: "მომრგვალებული",
    overweight: "ჭარბწონიანი",
  },
  activity: {
    none: "საერთოდ არა",
    active: "აქტიური",
    "super-active": "სუპერაქტიური",
    athlete: "ათლეტი",
  },
  appetite: {
    "very-picky": "რამდენად იწუნებს საჭმელს",
    occasional: "შეიძლება დაიწუნოს",
    "eats-well": "კარგად ჭამს",
    "eats-everything": "ყველაფერს ჭამს",
  },
  currentDiet: {
    kibble: "მშრალი",
    wet: "სველი",
    raw: "უმი ხორცი",
    dehydrated: "გამომშრალი",
    fresh: "Fresh Food",
  },
  goal: {
    "weight-loss": "წონის კლება",
    maintenance: "შენარჩუნება",
    "weight-gain": "მომატება",
    "picky-fix": "უჭმელობის მოგვარება",
    other: "სხვა",
  },
  complete: {
    title: "გმადლობთ!",
    subtitle: "თქვენი ძაღლის კვების პროფილი მზადაა. AylopetAI ამზადებს პერსონალურ გეგმას.",
    summaryTitle: "თქვენი შედეგები",
    dogLabel: "ძაღლი",
    breedLabel: "ჯიში",
    weightLabel: "წონა",
    goalLabel: "მიზანი",
    recommendationTitle: "ნუტრიციოლოგის რეკომენდაცია",
    ctaChat: "AylopetAI-სთან საუბრის გაგრძელება",
    ctaHome: "მთავარ გვერდზე დაბრუნება",
    restart: "პასუხების რედაქტირება",
  },
};

export function getQuizCopy(locale: Locale): QuizUiCopy {
  return locale === "ka" ? KA : EN;
}
