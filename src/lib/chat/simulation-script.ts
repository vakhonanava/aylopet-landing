export type SimulationSender = "ai" | "user";

export interface SimulationStep {
  id: string;
  sender: SimulationSender;
  content: string;
  delayBeforeTypingMs: number;
  typingDurationMs: number;
  /** Marks the closing nutrition recommendation for special card styling. */
  isFinalRecommendation?: boolean;
  /** Overrides the global reveal speed · useful for longer closing messages. */
  revealCharsPerTick?: number;
}

const ai = (
  id: string,
  content: string,
  typing = 1400,
  delay = 550,
  isFinalRecommendation = false,
  revealCharsPerTick?: number,
): SimulationStep => ({
  id,
  sender: "ai",
  content,
  delayBeforeTypingMs: delay,
  typingDurationMs: typing,
  isFinalRecommendation,
  revealCharsPerTick,
});

const user = (
  id: string,
  content: string,
  typing = 900,
  delay = 450,
): SimulationStep => ({
  id,
  sender: "user",
  content,
  delayBeforeTypingMs: delay,
  typingDurationMs: typing,
});

const NUTRITION_RECOMMENDATION_KA = `თქვენი შეყვანილი მონაცემების საფუძველზე, როკის იდეალური ფორმისა და მგრძნობიარე საჭმლის მომნელებელი სისტემის გათვალისწინებით, შერჩეულია ცოცხალი საკვების რაციონი: „ინდაურისა და საქონლის რეცეპტებით“.

დღიური ნორმა და მაკრონუტრიენტები:
დღიური პორცია: 200 გრამი (100 გ დილით / 100 გ საღამოს)

ენერგეტიკული ღირებულება: 400 კკალ

კვებითი ღირებულება (მშრალ ნივთიერებაზე):

ცილა: 30%
ცხიმი: 14%
ბოჭკო: 3.5%
ტენიანობა: 70%

ნუტრიციოლოგის რეკომენდაცია: რეცეპტი სრულად აკმაყოფილებს FEDIAF-ის სტანდარტებს. წონის იდეალური შენარჩუნებისთვის, დაიცავით მითითებული დოზირება და ახალ კვებაზე გადაიყვანეთ 7-დღიანი ეტაპობრივი მიჩვევის პრინციპით.`;

const NUTRITION_RECOMMENDATION_EN = `Based on the information you entered, and considering Rocky's ideal body condition and sensitive digestive system, we selected a fresh food ration with Turkey and Beef recipes.

Daily allowance and macronutrients:
Daily portion: 200 grams (100 g in the morning / 100 g in the evening)

Energy value: 400 kcal

Nutritional value (on a dry matter basis):

Protein: 30%
Fat: 14%
Fiber: 3.5%
Moisture: 70%

Nutritionist recommendation: The recipe fully meets FEDIAF standards. To maintain an ideal weight, follow the specified portions and transition to the new food gradually over 7 days.`;

/**
 * Full nutritionist questionnaire demo · KA wording from product script,
 * with simulated owner ნინო / Nino and dog როკი / Rocky.
 */
const FLOW_KA: SimulationStep[] = [
  ai(
    "ka-1",
    "მოგესალმებით, მე ვარ AylopetAI, თქვენი ძაღლის პერსონალური ნუტრიციოლოგი. სანამ დავიწყებდეთ, როგორ მოგმართოთ?",
    2200,
    400,
  ),
  user("ka-2", "ნინო", 1000, 900),
  ai(
    "ka-3",
    "ნინო, სასიამოვნოა თქვენი გაცნობა. გთხოვთ, მიუთითოთ თქვენი მეილი და მობილურის ნომერი",
    2000,
  ),
  user("ka-4", "nino@email.com · +995 555 12 34 56", 1600, 1000),
  ai("ka-5", "რომელ ქალაქში ცხოვრობთ თქვენ და თქვენი ოთხფეხა მეგობარი?", 1600),
  user("ka-6", "თბილისი", 1000),
  ai("ka-7", "რამდენი ძაღლი გყავთ?", 1200),
  user("ka-8", "1", 800),
  ai("ka-9", "რა ჰქვია თქვენს ოთხფეხა მეგობარს?", 1400),
  user("ka-10", "როკი", 900),
  ai("ka-11", "რა ასაკისაა როკი?", 1200),
  user("ka-12", "2 წლის", 1000),
  ai("ka-13", "როკის სქესი?", 1100),
  user("ka-14", "მამრი", 900),
  ai("ka-15", "არის თუ არა როკი კასტრირებული ან სტერილიზებული?", 1600),
  user("ka-16", "დიახ", 800),
  ai("ka-17", "რა ჯიშისაა როკი?", 1200),
  user("ka-18", "კორგი", 900),
  ai("ka-19", "დაახლოებით რამდენი კილოგრამია როკი?", 1400),
  user("ka-20", "12 კილოგრამი", 1100),
  ai("ka-21", "როგორ ფორმაშია როკი?", 1300),
  user("ka-22", "იდეალური", 1000),
  ai("ka-23", "რამდენად აქტიურია როკი?", 1200),
  user("ka-24", "აქტიური", 900),
  ai("ka-25", "კვების დროს როკი…", 1200),
  user("ka-26", "კარგად ჭამს", 1000),
  ai("ka-27", "ძირითადად რას მიირთმევს როკი?", 1400),
  user("ka-28", "მშრალი", 900),
  ai("ka-29", "რომელ ბრენდს?", 1000),
  user("ka-30", "Royal Canin", 1100),
  ai("ka-31", "აქვს თუ არა როკის რაიმე ჯანმრთელობის პრობლემა ან მგრძნობელობა?", 1600),
  user("ka-32", "მგრძნობიარე საჭმლის მომნელებელი სისტემა აქვს", 1300),
  ai("ka-33", "რა არის თქვენი მთავარი მიზანი როკისთვის?", 1500),
  user("ka-34", "შენარჩუნება", 1000),
  ai(
    "ka-35",
    "გმადლობთ, ნინო! როკის შესახებ ყველა საჭირო მონაცემი მაქვს · ვამზადებ პერსონალურ ნუტრიციულ რეკომენდაციას…",
    1800,
    1200,
  ),
  ai("ka-36", NUTRITION_RECOMMENDATION_KA, 3200, 900, true, 8),
];

const FLOW_EN: SimulationStep[] = [
  ai(
    "en-1",
    "Hello, I am AylopetAI · your dog's personal nutritionist. Before we begin, how should I address you?",
    2200,
    400,
  ),
  user("en-2", "Nino", 1000, 900),
  ai(
    "en-3",
    "Nino, it's a pleasure to meet you. Please share your email and mobile number",
    2000,
  ),
  user("en-4", "nino@email.com · +995 555 12 34 56", 1600, 1000),
  ai("en-5", "Which city do you and your four-legged friend live in?", 1600),
  user("en-6", "Tbilisi", 1000),
  ai("en-7", "How many dogs do you have?", 1200),
  user("en-8", "1", 800),
  ai("en-9", "What is your four-legged friend's name?", 1400),
  user("en-10", "Rocky", 900),
  ai("en-11", "How old is Rocky?", 1200),
  user("en-12", "2 years old", 1000),
  ai("en-13", "What is Rocky's sex?", 1100),
  user("en-14", "Male", 900),
  ai("en-15", "Is Rocky neutered or spayed?", 1600),
  user("en-16", "Yes", 800),
  ai("en-17", "What breed is Rocky?", 1200),
  user("en-18", "Corgi", 900),
  ai("en-19", "Approximately how many kilograms is Rocky?", 1400),
  user("en-20", "12 kg", 1100),
  ai("en-21", "What body condition is Rocky in?", 1300),
  user("en-22", "Ideal", 1000),
  ai("en-23", "How active is Rocky?", 1200),
  user("en-24", "Active", 900),
  ai("en-25", "During mealtime, Rocky…", 1200),
  user("en-26", "Eats well", 1000),
  ai("en-27", "What does Rocky mostly eat?", 1400),
  user("en-28", "Dry", 900),
  ai("en-29", "Which brand?", 1000),
  user("en-30", "Royal Canin", 1100),
  ai("en-31", "Does Rocky have any health problems or sensitivities?", 1600),
  user("en-32", "Sensitive digestive system", 1300),
  ai("en-33", "What is your main goal for Rocky?", 1500),
  user("en-34", "Maintain", 1000),
  ai(
    "en-35",
    "Thank you, Nino! I have everything I need about Rocky · generating your personalized nutrition recommendation…",
    1800,
    1200,
  ),
  ai("en-36", NUTRITION_RECOMMENDATION_EN, 3200, 900, true, 8),
];

export function getSimulationFlow(locale: "ka" | "en"): SimulationStep[] {
  return locale === "ka" ? FLOW_KA : FLOW_EN;
}
