export type FaqCategoryKey =
  | "ai"
  | "collar"
  | "food"
  | "recipes"
  | "subscription"
  | "planCreation"
  | "shippingDelivery"
  | "returns";

export interface FaqItem {
  id: string;
  category: FaqCategoryKey;
  question: string;
  answer: string;
}

export interface FaqCategoryMeta {
  key: FaqCategoryKey;
  label: string;
}

export interface FaqCopy {
  title: string;
  subtitle: string;
  allLabel: string;
  searchPlaceholder: string;
  searchAriaLabel: string;
  clearSearchAriaLabel: string;
  noResultsTitle: string;
  noResultsBody: string;
  questionsSingular: string;
  questionsPlural: string;
  categories: FaqCategoryMeta[];
  items: FaqItem[];
}

/** Georgian has no plural inflection here, English does. */
export function formatQuestionCount(copy: FaqCopy, count: number): string {
  const label = count === 1 ? copy.questionsSingular : copy.questionsPlural;
  return `${count} ${label}`;
}

const CATEGORIES_KA: FaqCategoryMeta[] = [
  { key: "ai", label: "Aylopet AI და ზოგადი" },
  { key: "collar", label: "Aylopet Pro" },
  { key: "food", label: "საკვები" },
  { key: "recipes", label: "ჩვენი რეცეპტები" },
  { key: "subscription", label: "გამოწერა და ანგარიში" },
  { key: "planCreation", label: "გეგმის შექმნა" },
  { key: "shippingDelivery", label: "შეფუთვა და მიწოდება" },
  { key: "returns", label: "უკან დაბრუნება" },
];

const CATEGORIES_EN: FaqCategoryMeta[] = [
  { key: "ai", label: "Aylopet AI & General" },
  { key: "collar", label: "Aylopet Pro" },
  { key: "food", label: "Fresh Food" },
  { key: "recipes", label: "Our Recipes" },
  { key: "subscription", label: "Subscription & Account" },
  { key: "planCreation", label: "Creating Your Plan" },
  { key: "shippingDelivery", label: "Packaging & Delivery" },
  { key: "returns", label: "Returns & Refunds" },
];

const ITEMS_KA: FaqItem[] = [
  // --- Aylopet AI და ზოგადი ---
  {
    id: "1",
    category: "ai",
    question: "რით განსხვავდება AylopetAI ვეტ-ნუტრიციოლოგის კონსულტაციისგან?",
    answer:
      "AylopetAI არ ანაცვლებს კრიტიკულ ვეტერინარულ ჩარევებს, თუმცა ტრადიციული კონსულტაციისგან განსხვავებით, ის ხელმისაწვდომია 24/7-ზე რეალურ დროში. AI მომენტალურად ამუშავებს თქვენი ძაღლის დნმ-ის მონაცემებს, აქტივობის დინამიკასა და ჯანმრთელობის ისტორიას, რათა წამებში შექმნას და დააკორექტიროს კვების ზუსტი ფორმულა, რაც ფიზიკური ვიზიტებისას კვირებსა და დიდ ბიუჯეტს მოითხოვს.",
  },
  {
    id: "2",
    category: "ai",
    question:
      "ითვალისწინებს თუ არა სისტემა ჯანმრთელობის ისტორიას და ალერგიებს ფორმულის შედგენისას?",
    answer:
      "დიახ, Aylopet AI-ს ალგორითმი დეტალურად აანალიზებს თქვენი ოთხფეხა მეგობრის ჯანმრთელობის ისტორიას, ალერგიებსა და სპეციფიკურ მოთხოვნილებებს. ფორმულის შედგენისას სისტემა სრულად გამორიცხავს ალერგენებს და არჩევს მხოლოდ იმ ინგრედიენტებს, რომლებიც ხელს შეუწყობს მის გაჯანსაღებას.",
  },
  {
    id: "3",
    category: "ai",
    question:
      "რა ხდება, თუ სისტემაში შეცდომით შევიყვანე მონაცემები? გადაამოწმებს თუ არა ამას AylopetAI?",
    answer:
      "თუ მონაცემები შეცდომით შეიყვანეთ, ნებისმიერ დროს შეგიძლიათ მათი განახლება თქვენი პირადი პროფილიდან. გარდა ამისა, Aylopet AI აანალიზებს შეყვანილი პარამეტრების ლოგიკურ კავშირს (მაგ. წონისა და ასაკის თანაფარდობას) და საეჭვო ან არარეალური მაჩვენებლების დაფიქსირებისას ავტომატურად შეგატყობინებთ მონაცემების გადამოწმების აუცილებლობაზე.",
  },
  {
    id: "43",
    category: "ai",
    question: "რა არის AylopetAI?",
    answer:
      "AylopetAI არის თქვენი ძაღლის პერსონალური AI ნუტრიციოლოგი, შექმნილი საერთაშორისო ექსპერტების მონაწილეობით. ეს არის მაღალსპეციალიზირებული ხელოვნური ინტელექტი, რომელიც გასცემს ინდივიდუალურ კვების რეკომენდაციებს მხოლოდ თქვენი ძაღლის საკუთარი მონაცემების საფუძველზე.",
  },
  {
    id: "44",
    category: "ai",
    question:
      "როგორ ახერხებს პლატფორმა ჩემი ცხოველისთვის ინდივიდუალური რაციონის შედგენას?",
    answer:
      "ინდივიდუალური რაციონის შერჩევა იწყება დეტალური ციფრული დიალოგით. AylopetAI აანალიზებს თქვენი ძაღლის მრავალმხრივ მონაცემებს · ასაკს, ჯიშს, აქტივობას, ჯანმრთელობის ისტორიასა და კიდევ ბევრ სპეციფიკურ პარამეტრს. ამ ინფორმაციის საფუძველზე ალგორითმი ჩვენი სამეცნიერულად შემუშავებული ბაზიდან ირჩევს ზუსტად იმ ფორმულას, რომელიც საუკეთესოდ ესადაგება თქვენი მეგობრის ინდივიდუალურ ბიოლოგიურ საჭიროებებს.",
  },
  {
    id: "45",
    category: "ai",
    question:
      "რით განსხვავდება AylopetAI-ის პერსონალიზებული კვება მაღაზიაში ნაყიდი საკვებისგან?",
    answer:
      "მთავარი განსხვავება მიდგომაშია: მაღაზიის საკვები იქმნება უნივერსალური ფორმულით, მასობრივი მოხმარებისთვის და არა თქვენი ძაღლის ინდივიდუალური საჭიროებებისთვის. AylopetAI ამ შაბლონს ანგრევს · ის ირჩევს ნედლ, პასტერიზებულ, Non-GMO კვებას, სპეციალურად მორგებულს თქვენს მეგობარზე. მაშინ როცა ინდუსტრიული საკვები გადის მაღალტემპერატურულ დამუშავებას, ჩვენი ნატურალური საკვები მზადდება დაბალ ტემპერატურაზე, რაც უზრუნველყოფს ყველა თერმომგრძნობიარე ნუტრიენტის შენარჩუნებას · მეცნიერულად დასაბუთებული არჩევანი თქვენი ძაღლის ჯანმრთელობისთვის.",
  },
  {
    id: "46",
    category: "ai",
    question: "რამდენად უსაფრთხოა ხელოვნური ინტელექტის მიერ გაცემული ინფორმაცია?",
    answer:
      "AylopetAI-ს ყოველი რეკომენდაცია შექმნილია მაქსიმალურად უსაფრთხოდ, რადგან მისი ალგორითმები დაფუძნებულია ვეტერინარული ნუტრიციოლოგიის წამყვან საერთაშორისო სტანდარტებზე. AI არ მუშაობს იზოლირებულად · მას წვრთნიან პროფესიონალი ექსპერტები და ის ეყრდნობა მხოლოდ დამტკიცებულ სამეცნიერო მონაცემებს. სისტემა ასევე ითვალისწინებს თქვენი ძაღლის ინდივიდუალურ შეზღუდვებსა და ჯანმრთელობის ისტორიას, რაც გამორიცხავს დაუსაბუთებელ ან რისკიან რჩევებს.",
  },
  {
    id: "47",
    category: "ai",
    question: "შეიძლება თუ არა ვენდოთ ხელოვნურ ინტელექტს?",
    answer:
      "აბსოლუტურად. AylopetAI ამცირებს ადამიანურ შეცდომას და გადაწყვეტილებებს იღებს მხოლოდ საერთაშორისო სამეცნიერო პროტოკოლების საფუძველზე. ეს არის ობიექტური ექსპერტი, რომელიც 24/7 რეჟიმში იცავს თქვენი ძაღლის ჯანმრთელობას მაქსიმალური ტექნოლოგიური სიზუსტით.",
  },
  {
    id: "48",
    category: "ai",
    question: "სად გადის ზღვარი AylopetAI-ს რეკომენდაციასა და ვეტ-ექიმს შორის?",
    answer:
      "AylopetAI არის ციფრული ნუტრიციოლოგი, რაც იმას ნიშნავს, რომ მისი კომპეტენცია ვრცელდება მხოლოდ კვებასა და მასთან დაკავშირებულ თემებზე. ის გეხმარებათ იდეალური რაციონის შერჩევაში, თუმცა ნებისმიერი სამედიცინო პრობლემის, დიაგნოზის ან საგანგებო შემთხვევის დროს აუცილებლად უნდა მიმართოთ ვეტერინარს. AylopetAI არის კვებითი პრევენციის ინსტრუმენტი და არა კლინიკური მკურნალობის შემცვლელი.",
  },
  {
    id: "49",
    category: "ai",
    question: "სწავლობს თუ არა AylopetAI ჩემი ცხოველის მონაცემებს?",
    answer:
      "დიახ · თქვენი თანხმობით სისტემა ინახავს მონაცემებს და მუდმივად იხვეწება მანქანური სწავლების მეშვეობით. AylopetAI არა მხოლოდ აანალიზებს მიმდინარე საჭიროებებს, არამედ სწავლობს ყოველი ახალი მონაცემიდან, რათა მაქსიმალურად აზუსტოს კვების ფორმულა და შემოგთავაზოთ მუდმივად გაუმჯობესებული, ინდივიდუალური გამოცდილება თქვენი ძაღლისთვის.",
  },
  {
    id: "50",
    category: "ai",
    question:
      "როგორ ახერხებს AI იმ ინტუიციის ჩანაცვლებას, რომელიც ვეტ-ნუტრიციოლოგს პრაქტიკული გამოცდილებით აქვს?",
    answer:
      "AI არ ცვლის ინტუიციას · ის სუბიექტურ შეფასებას ცვლის დამტკიცებული მონაცემებითა და სამეცნიერო სიზუსტით. სადაც ადამიანური გამოცდილება სუბიექტურ აღქმას ეყრდნობა, AylopetAI წამებში აანალიზებს უამრავ კვლევასა და ბიომეტრულ კავშირს. ჩვენი სისტემა წარმოადგენს ნუტრიციოლოგის კონტექსტური ცოდნისა და ტექნოლოგიური ძალის სინთეზს.",
  },
  {
    id: "51",
    category: "ai",
    question:
      "რატომ ითვლება AylopetAI-ს მიერ შედგენილი გეგმა „ცოცხალ“ პროცესად და არა ერთჯერად რეცეპტად?",
    answer:
      "თქვენი ძაღლის საჭიროებები იცვლება · წონის, აქტივობის, სეზონისა და მიზნების მიხედვით. AylopetAI შესაბამისად ადაპტირდება და მუდმივად ანახლებს გეგმას.",
  },

  // --- Aylopet Pro ---
  {
    id: "4",
    category: "collar",
    question:
      "რა უპირატესობებს მაძლევს Aylopet Pro ჩვეულებრივი GPS თრექერისგან?",
    answer:
      "ჩვეულებრივი GPS თრექერისგან განსხვავებით, რომელიც მხოლოდ ლოკაციას აჩვენებს, Aylopet Pro არის კომპლექსური ჯანმრთელობისა და აქტივობის მონიტორი. ის აკონტროლებს ძილის ფაზებს, გულისცემას, დახარჯულ კალორიებს, შფოთვის დონეს და AI-ის მეშვეობით წინასწარ გაფრთხილებთ პოტენციური ჯანმრთელობის პრობლემების შესახებ.",
  },
  {
    id: "5",
    category: "collar",
    question: "როგორ ხდება ყელსაბამის დამუხტვა?",
    answer:
      "ყელსაბამი იმუხტება თანამედროვე უსადენო (Wireless) დამტენით ან სპეციალური Type-C პორტის საშუალებით, რომელიც კომპლექტში მოყვება. ელემენტი გამოირჩევა მაღალი ავტონომიურობით და ერთი სრული დამუხტვით საშუალოდ 7-დან 14 დღემდე მუშაობს, გამოყენების რეჟიმიდან გამომდინარე.",
  },
  {
    id: "52",
    category: "collar",
    question: "რა არის Aylopet Pro?",
    answer:
      "Aylopet Pro არის ჭკვიანი ყელსაბამი GPS მონიტორინგით, რომელიც საშუალებას გაძლევთ ნებისმიერ დროს იცოდეთ თქვენი ძაღლის ზუსტი მდებარეობა და თვალყური ადევნოთ მის დღიურ აქტივობას. AylopetAI-სთან ინტეგრაციით მოწყობილობა ითვლის თქვენი მეგობრის ინდივიდუალურ ენერგოდანახარჯს და გირჩევს რაციონს, რომელიც ზუსტად შეესაბამება თქვენს მიზნებს.",
  },
  {
    id: "53",
    category: "collar",
    question: "როგორ მუშაობს Aylopet Pro?",
    answer:
      "ყელსაბამი მუდმივად აკვირდება თქვენი ძაღლის აქტივობას, ხოლო მონაცემები ავტომატურად სინქრონიზდება AylopetAI-სთან. ნუტრიციოლოგების მიერ შემუშავებული ფორმულების საფუძველზე AI ითვლის საჭირო კალორიების რაოდენობას და გეტყვით, რა კორექტირება შესაძლოა დასჭირდეს თქვენს რაციონს.",
  },
  {
    id: "54",
    category: "collar",
    question: "საჭიროებს თუ არა ჭკვიანი ყელსაბამი მუდმივ ინტერნეტ კავშირს?",
    answer:
      "ყელსაბამს სჭირდება Bluetooth ან WiFi მონაცემთა სინქრონიზაციისთვის. GPS ფუნქცია მუშაობს LTE ქსელის საშუალებით, ხოლო ზოგიერთი ფუნქცია ხელმისაწვდომია ოფლაინ რეჟიმშიც.",
  },
  {
    id: "55",
    category: "collar",
    question:
      "არის თუ არა Aylopet Pro-ს ყელსაბამი წყალგამძლე და რამდენად გამძლეა ის აქტიური ცხოველებისთვის?",
    answer:
      "დიახ, ყელსაბამი არის IP67 სტანდარტის წყალგამძლე და სპეციალურად დაპროექტებულია აქტიური ცხოველებისთვის.",
  },

  // --- საკვები ---
  {
    id: "6",
    category: "food",
    question: "რატომ არის „ცოცხალი კვება“ (Fresh Food) Aylopet-ის არჩევანი?",
    answer:
      "ცოცხალი კვება ინარჩუნებს ყველა საჭირო ვიტამინს, მინერალსა და ამინომჟავას, რომლებიც თერმული დამუშავებისას მშრალ საკვებში იკარგება. ის ხელს უწყობს უკეთეს მონელებას, აჯანსაღებს ბეწვს, მატებს ენერგიას და ახანგრძლივებს თქვენი ცხოველის სიცოცხლეს.",
  },
  {
    id: "7",
    category: "food",
    question:
      "რას ნიშნავს „სუფთა ინგრედიენტი\" და როგორია კვების ხარისხის Aylopet-ისეული სტანდარტი?",
    answer:
      "„სუფთა ინგრედიენტი\" ნიშნავს 100%-ით ნატურალურ, ადამიანის კვებისთვის შესაფერის (Human-Grade) პროდუქტებს, კონსერვანტების, ხელოვნური საღებავებისა და გვერდითი ხორცპროდუქტების (By-products) გარეშე. ჩვენი სტანდარტი მხოლოდ სერტიფიცირებულ, ეკოლოგიურად სუფთა ფერმერულ ნედლეულს ეფუძნება.",
  },
  {
    id: "8",
    category: "food",
    question: "საჭიროებს თუ არა Aylopet-ის რაციონი დამატებით მომზადებას?",
    answer:
      "არა, საკვები სრულიად მზად არის გამოსაყენებლად. თქვენ მხოლოდ უნდა გამოიღოთ შესაბამისი პორცია მაცივრიდან, მიიყვანოთ ოთახის ტემპერატურამდე და პირდაპირ მიართვათ თქვენს ოთხფეხა მეგობარს.",
  },
  {
    id: "9",
    category: "food",
    question: "როგორ უნდა შევინახოთ Aylopet-ის საკვები სწორად?",
    answer:
      "საკვების გრძელვადიანი შენახვისთვის გამოიყენეთ საყინულე (ინახება 6 თვემდე). ყოველდღიური ულუფა გამოყენებამდე 12-24 საათით ადრე გადაიტანეთ ჩვეულებრივ მაცივარში. გახსნილი პაკეტი მაცივარში ინახება მაქსიმუმ 3-4 დღე.",
  },
  {
    id: "10",
    category: "food",
    question: "რატომ ვერ ჩაანაცვლებს სახლში მომზადებული საკვები Aylopet-ის ფორმულას?",
    answer:
      "სახლში მომზადებისას ძალიან რთულია ცილების, ცხიმების, ვიტამინებისა და კალციუმ-ფოსფორის სწორი ბალანსის დაცვა. Aylopet-ის ფორმულა კი შექმნილია ვეტერინარი დიეტოლოგებისა და ხელოვნური ინტელექტის მიერ, რაც უზრუნველყოფს სამეცნიერო სიზუსტით დაბალანსებულ ყოველდღიურ რაციონს.",
  },
  {
    id: "11",
    category: "food",
    question:
      "არის თუ არა Aylopet-ის რაციონი შესაბამისი ყველა ასაკობრივი ჯგუფისთვის (ლეკვი, ზრდასრული, სენიორი)?",
    answer:
      "დიახ. Aylopet-ის რეცეპტები სრულად ადაპტირებადია. სისტემა ავტომატურად არეგულირებს კალორიულობას, საკვები ნივთიერებების კონცენტრაციასა და პორციის ზომას თქვენი ძაღლის ასაკობრივი ფაზის (ლეკვი, ზრდასრული თუ ხანდაზმული) გათვალისწინებით.",
  },
  {
    id: "12",
    category: "food",
    question: "რა ღირს ინდივიდუალური კვების გეგმა?",
    answer:
      "ფასი ინდივიდუალურია და დამოკიდებულია თქვენი ძაღლის წონაზე, ასაკზე, აქტივობის დონესა და შერჩეულ რეცეპტზე. ზუსტი ღირებულების გასაგებად, გაიარეთ მოკლე ტესტი ჩვენს საიტზე და სისტემა მომენტალურად დაგითვლით ყოველდღიურ და ყოველთვიურ ბიუჯეტს.",
  },
  {
    id: "13",
    category: "food",
    question: "მჭირდება თუ არა ვეტ ექიმთან გასაუბრება სანამ თქვენ საკვებზე გადმოვალთ?",
    answer:
      "თუ თქვენს ძაღლს ქრონიკული დაავადებები აქვს, ვეტერინართან კონსულტაცია ყოველთვის რეკომენდებულია. თუმცა, ჯანმრთელი ძაღლებისთვის ჩვენი AI სისტემა და ვეტერინარული გუნდი თავად უზრუნველყოფს სრულიად უსაფრთხო და დაბალანსებულ გეგმას.",
  },
  {
    id: "14",
    category: "food",
    question: "როგორ გადავიყვანოთ მშრალი კვებიდან თქვენს ცოცხალ კვებაზე?",
    answer:
      "გადასვლა უნდა მოხდეს ეტაპობრივად, 7-10 დღის განმავლობაში: პირველ 2-3 დღეს შეურიეთ 25% Aylopet და 75% ძველი საკვები, შემდეგ 50/50-ზე, ბოლო დღეებში კი 75% Aylopet და 25% ძველი, სანამ სრულად არ გადახვალთ ცოცხალ კვებაზე.",
  },
  {
    id: "15",
    category: "food",
    question: "როგორ ხდება ულუფების კონტროლი და საჭიროა თუ არა საკვების აწონვა?",
    answer:
      "არანაირი აწონვა არ გჭირდებათ! Aylopet-ის საკვები მოდის წინასწარ აწონილ და დაფასოებულ პაკეტებში, რომლებიც ზუსტად შეესაბამება თქვენი ძაღლის დღიურ ნორმას. თქვენ უბრალოდ ხსნით პაკეტს და აჭმევთ.",
  },

  // --- ჩვენი რეცეპტები ---
  {
    id: "16",
    category: "recipes",
    question: "რა ტიპის რეცეპტებს გვთავაზობს Aylopet?",
    answer:
      "ჩვენ გთავაზობთ სხვადასხვა ტიპის ცილაზე დაფუძნებულ რეცეპტებს: საქონლის ხორცი, ქათამი, ინდაური და თევზი. თითოეული რეცეპტი გამდიდრებულია ახალი ბოსტნეულით, სუპერფუდებითა და ნატურალური ვიტამინების კომპლექსით.",
  },
  {
    id: "17",
    category: "recipes",
    question: "როგორ ხდება ინგრედიენტების შერჩევა და მათი ხარისხის კონტროლი?",
    answer:
      "ჩვენი ინგრედიენტები გადის მკაცრ ლაბორატორიულ შემოწმებას. ჩვენ ვთანამშრომლობთ მხოლოდ სერტიფიცირებულ ადგილობრივ ფერმერებთან, სადაც ხდება ხორცისა და ბოსტნეულის ყოველდღიური ხარისხის კონტროლი გადამუშავებამდე.",
  },
  {
    id: "18",
    category: "recipes",
    question: "შეიცავს თუ არა თქვენი რეცეპტები მარცვლეულს?",
    answer:
      "ჩვენ გვაქვს როგორც სრულიად უმარცვლო (Grain-Free) რეცეპტები მგრძნობიარე კუჭის მქონე ძაღლებისთვის, ასევე სასარგებლო მარცვლეულის (მაგალითად, ყავისფერი ბრინჯის ან შვრიის) შემცველი ფორმულები ენერგიული აქტივობისთვის.",
  },
  {
    id: "19",
    category: "recipes",
    question: "რით განსხვავდება Aylopet-ის რეცეპტი ნებისმიერი სხვა რეცეპტისგან?",
    answer:
      "მთავარი განსხვავება მეცნიერულ სიზუსტესა და ინდივიდუალიზაციაშია. ჩვენი რეცეპტები არ არის მასობრივი; თითოეული ულუფა კორექტირდება AI-ის მიერ კონკრეტული ძაღლის მეტაბოლიზმის, აქტივობისა და ჯანმრთელობის მიხედვით.",
  },

  // --- გამოწერა და ანგარიში ---
  {
    id: "20",
    category: "subscription",
    question: "რა არის Aylopet-ის გამოწერის მოდელი?",
    answer:
      "Aylopet მუშაობს ავტომატური გამოწერის პრინციპით. თქვენ ერთხელ ააქტიურებთ გეგმას და საკვები პერიოდულად, თქვენთვის მოსახერხებელ დროს, ავტომატურად მოგეწოდებათ კარამდე, რათა თქვენს მეგობარს საკვები არასდროს გაუთავდეს.",
  },
  {
    id: "21",
    category: "subscription",
    question: "როგორ უნდა გავააქტიურო კვების ან სერვისის ინდივიდუალური გამოწერა?",
    answer:
      "გამოწერის გასააქტიურებლად შეავსეთ თქვენი ძაღლის პროფილი, აირჩიეთ რეკომენდებული კვების გეგმა, მიუთითეთ მიწოდების მისამართი და დააკავშირეთ საბანკო ბარათი უსაფრთხო გადახდისთვის.",
  },
  {
    id: "22",
    category: "subscription",
    question: "როგორ შემიძლია ცვლილებების შეტანა აქტიურ გამოწერაში?",
    answer:
      "ცვლილებების შეტანა შეგიძლიათ ნებისმიერ დროს პირადი კაბინეტიდან: შეგიძლიათ შეცვალოთ რეცეპტი, მიწოდების თარიღი, მისამართი ან შეაჩეროთ გამოწერა შემდეგი შეკვეთის გაგზავნამდე 24 საათით ადრე.",
  },
  {
    id: "23",
    category: "subscription",
    question: "შესაძლებელია რამდენიმე გამოწერის ერთად მართვა?",
    answer:
      "დიახ, თქვენი ერთი პირადი ანგარიშიდან შეგიძლიათ მართოთ რამდენიმე შინაური ცხოველის პროფილი და თითოეულისთვის გქონდეთ ინდივიდუალური, დამოუკიდებელი გამოწერა.",
  },
  {
    id: "24",
    category: "subscription",
    question: "როგორ გავიგო, როდის მოვა ჩემი შემდეგი შეკვეთა?",
    answer:
      "შეკვეთის მოახლოების შესახებ მიიღებთ SMS შეტყობინებას და ელ-ფოსტას. ასევე, თვალყურის დევნება შეგიძლიათ პირადი კაბინეტის „მიწოდების გრაფიკის\" სექციიდან.",
  },
  {
    id: "25",
    category: "subscription",
    question: "რა პრინციპით ხდება მომსახურების საფასურის გადახდა?",
    answer:
      "თანხის ჩამოჭრა ხდება ავტომატურად თქვენი დაკავშირებული ბარათიდან, ყოველდღიური პარტიის გაგზავნამდე 24-48 საათით ადრე. ყოველთვის მიიღებთ წინასწარ შეტყობინებას ჩამოჭრამდე.",
  },
  {
    id: "26",
    category: "subscription",
    question: "როგორ მოვიქცე, თუ სამოგზაუროდ მივდივარ?",
    answer:
      "თუ სამოგზაუროდ მიდიხართ, შეგიძლიათ დროებით შეაჩეროთ გამოწერა ერთი კლიკით ან შეცვალოთ მიწოდების მისამართი, რომ საკვები დასასვენებელ ადგილას მოგაწოდოთ.",
  },
  {
    id: "27",
    category: "subscription",
    question:
      "მაქვს თუ არა შესაძლებლობა, რომ ნებისმიერ დროს გავაუქმო ან ხელახლა გავააქტიურო ჩემი გამოწერა?",
    answer:
      "დიახ, ჩვენ არ გვაქვს გრძელვადიანი ვალდებულებები. გამოწერის გაუქმება ან ხელახალი აქტივაცია შეგიძლიათ ნებისმიერ დროს, ყოველგვარი დამატებითი საკომისიოს გარეშე.",
  },
  {
    id: "28",
    category: "subscription",
    question: "დამავიწყდა პირადი ანგარიშის პაროლი, როგორ შემიძლია აღდგენა?",
    answer:
      "ავტორიზაციის გვერდზე დააჭირეთ „პაროლის აღდგენას\", შეიყვანეთ თქვენი ელ-ფოსტა და გამოგზავნილი ბმულის საშუალებით მარტივად შექმნით ახალ პაროლს.",
  },

  // --- გეგმის შექმნა ---
  {
    id: "29",
    category: "planCreation",
    question:
      "როგორ უნდა დავარეგისტრირო ჩემი ოთხფეხა მეგობარი და როგორ დავიწყო კვების ინდივიდუალური გეგმის შედგენა?",
    answer:
      "გადადით ღილაკზე „გეგმის შექმნა\", შეავსეთ მოკლე კითხვარი თქვენი ძაღლის ჯიშის, ასაკის, წონისა და ჯანმრთელობის შესახებ და ჩვენი AI მომენტალურად შეგიდგენთ პერსონალურ გეგმას.",
  },
  {
    id: "30",
    category: "planCreation",
    question: "როგორ დაადგენთ ჩემი ძაღლის კვებით მოთხოვნილებებს?",
    answer:
      "Aylopet AI ეყრდნობა საერთაშორისო ვეტერინარულ კვლევებს (FEDIAF/AAFCO სტანდარტებს) და ითვლის ზუსტ მეტაბოლურ ენერგიას თქვენი ძაღლის წონის, ასაკის, აქტივობისა და კასტრაცია/სტერილიზაციის სტატუსის მიხედვით.",
  },
  {
    id: "31",
    category: "planCreation",
    question:
      "მაქვს თუ არა შესაძლებლობა, რომ ნებისმიერ დროს შევცვალო, შევაჩერო ან გავაუქმო ჩემი გამოწერები?",
    answer:
      "დიახ, თქვენ სრულად აკონტროლებთ თქვენს გამოწერებს. ნებისმიერი ცვლილება (პაუზა, გაუქმება, რეცეპტის შეცვლა) ხელმისაწვდომია თქვენი პირადი კაბინეტიდან სულ რაღაც ერთ კლიკში.",
  },

  // --- შეფუთვა და მიწოდება ---
  {
    id: "32",
    category: "shippingDelivery",
    question: "როგორ მუშაობს მიწოდების სისტემა და მუშაობს თუ არა მთელ ქვეყანაში?",
    answer:
      "ჩვენი მიწოდების სერვისი ფარავს მთელ საქართველოს. თბილისსა და შემოგარენში ვიყენებთ საკუთარ სამაცივრე ტრანსპორტს, ხოლო რეგიონებში მიწოდება ხდება პარტნიორი საკურიერო სერვისების დახმარებით, ტემპერატურული რეჟიმის მკაცრი დაცვით.",
  },
  {
    id: "33",
    category: "shippingDelivery",
    question: "როგორ დავრწმუნდე, რომ შეკვეთის მიღებისას საკვები დაუზიანებელია?",
    answer:
      "საკვები იფუთება სპეციალურ თერმო-ყუთებში მშრალ ყინულთან ერთად, რაც უზრუნველყოფს ტემპერატურის შენარჩუნებას მინიმუმ 48 საათის განმავლობაში. მიღებისას შეფუთვა უნდა იყოს მყარი და საკვები გაყინულ მდგომარეობაში.",
  },
  {
    id: "34",
    category: "shippingDelivery",
    question: "როგორ მოვიქცე, თუ ამანათის მოსვლის დროს სახლში არ ვარ?",
    answer:
      "კურიერი წინასწარ დაგიკავშირდებათ. შეგიძლიათ სთხოვოთ მას ამანათის დატოვება მეზობელთან, დაცვასთან ან კართან (თერმო-შეფუთვა საკვებს სიგრილეს რამდენიმე საათით შეუნარჩუნებს).",
  },
  {
    id: "35",
    category: "shippingDelivery",
    question: "რამდენად მოქნილია მიწოდების გრაფიკი?",
    answer:
      "გრაფიკი ძალიან მოქნილია. თქვენ თავად ირჩევთ მიწოდების დღესა და სასურველ საათობრივ შუალედს რეგისტრაციისას, რომლის შეცვლაც ნებისმიერ დროს შეგიძლიათ პირადი კაბინეტის კალენდრიდან.",
  },
  {
    id: "36",
    category: "shippingDelivery",
    question: "რამდენად ეკომეგობრულია Aylopet-ის შეფუთვა?",
    answer:
      "ჩვენი მიზანია გარემოზე ზრუნვა. Aylopet-ის ყუთები და თერმო-ჩანართები დამზადებულია 100%-ით გადამუშავებადი და ბიოდეგრადირებადი მასალებისგან, რომლებიც არ აზიანებს ბუნებას.",
  },
  {
    id: "37",
    category: "shippingDelivery",
    question: "რა უნდა გავაკეთო, თუ ამანათი დაზიანდა ან მიწოდება დაგვიანდა?",
    answer:
      "დაუყოვნებლივ დაუკავშირდით ჩვენს მხარდაჭერის გუნდს ჩატის ან ცხელი ხაზის საშუალებით. ჩვენს პასუხისმგებლობაზე ავიღებთ ნებისმიერ ხარვეზს და უმოკლეს დროში გამოგიგზავნით ახალ, უფასო ამანათს.",
  },

  // --- უკან დაბრუნება ---
  {
    id: "38",
    category: "returns",
    question: "შესაძლებელია თუ არა საკვების უკან დაბრუნება?",
    answer:
      "საკვები მალფუჭებადი პროდუქტია, ამიტომ ჰიგიენური და უსაფრთხოების ნორმებიდან გამომდინარე, უკვე მიღებული საკვების უკან დაბრუნება არ ხდება. თუმცა, თუ პრობლემა შეფუთვის ხარისხს ან დაზიანებას ეხება, ჩვენ მას სრულად ავანაზღაურებთ.",
  },
  {
    id: "39",
    category: "returns",
    question:
      "როგორია „ჭკვიანი ყელსაბამის\" (Aylopet Pro) დაბრუნების ან შეცვლის პირობები?",
    answer:
      "ყელსაბამის დაბრუნება ან შეცვლა შესაძლებელია შეძენიდან 14 დღის განმავლობაში, თუ მას არ აღენიშნება ფიზიკური დაზიანება, შენარჩუნებული აქვს სასაქონლო იერსახე და მოყვება სრული კომპლექტაცია.",
  },
  {
    id: "40",
    category: "returns",
    question: "როგორ მოვიქცე, თუ ამანათი დაზიანებულია ან შეკვეთა არასრულია?",
    answer:
      "გადაუღეთ ფოტო დაზიანებულ შეფუთვას და გამოგვიგზავნეთ მხარდაჭერის ჩატში. ჩვენი ოპერატორები მომენტალურად მოახდენენ რეაგირებას და დანაკლისის ან დაზიანებული ნაწილის ჩანაცვლებას.",
  },
  {
    id: "41",
    category: "returns",
    question: "რა ვადებში და რა ფორმით ხდება გადახდილი თანხის უკან დაბრუნება?",
    answer:
      "თანხის დაბრუნება ხდება იმავე საბანკო ბარათზე, საიდანაც განხორციელდა გადახდა. პროცედურა ინიცირდება დასტურისთანავე და თანხა აისახება თქვენს ანგარიშზე 3-დან 5 სამუშაო დღეში.",
  },
  {
    id: "42",
    category: "returns",
    question:
      "შემიძლია თუ არა ხელოვნურ ინტელექტთან (ჩათთან) წვდომის შეჩერება და როგორ მოქმედებს ეს ჩემს ანგარიშზე?",
    answer:
      "დიახ, შეგიძლიათ შეაჩეროთ მხოლოდ AI ასისტენტის აქტიური გამოწერა. ეს არ წაშლის თქვენს პროფილს ან კვების ისტორიას, თუმცა შეზღუდავს რეალურ დროში რჩევებისა და ჯანმრთელობის AI ანალიზის მიღებას ხელახალ გააქტიურებამდე.",
  },
];

const ITEMS_EN: FaqItem[] = [
  // --- Aylopet AI & General ---
  {
    id: "1",
    category: "ai",
    question:
      "How does AylopetAI differ from a consultation with a veterinary nutritionist?",
    answer:
      "AylopetAI doesn't replace critical veterinary interventions, but unlike a traditional consultation, it's available 24/7 in real time. The AI instantly processes your dog's DNA data, activity trends, and health history to build and adjust a precise nutrition formula in seconds · something that would otherwise take weeks and a large budget through in-person visits.",
  },
  {
    id: "2",
    category: "ai",
    question:
      "Does the system take health history and allergies into account when building the formula?",
    answer:
      "Yes · AylopetAI's algorithm thoroughly analyzes your four-legged friend's health history, allergies, and specific needs. When building the formula, the system fully excludes known allergens and selects only ingredients that support their wellbeing.",
  },
  {
    id: "3",
    category: "ai",
    question:
      "What happens if I accidentally enter incorrect data? Will AylopetAI verify this?",
    answer:
      "If you enter data by mistake, you can update it anytime from your personal profile. In addition, AylopetAI analyzes the logical relationship between the parameters you enter (e.g. the ratio of weight to age), and if it detects suspicious or unrealistic values, it will automatically prompt you to double-check the data.",
  },
  {
    id: "43",
    category: "ai",
    question: "What is AylopetAI?",
    answer:
      "AylopetAI is your dog's personal AI nutritionist, built with international experts. The result is a narrowly specialized artificial intelligence that provides individualized feeding recommendations based solely on your dog's data.",
  },
  {
    id: "44",
    category: "ai",
    question: "How does the platform build an individualized ration for my pet?",
    answer:
      "Selecting an individualized ration starts with a detailed digital conversation. AylopetAI analyzes multifaceted data about your dog: age, breed, activity, health history, and many other specific parameters. Based on this information, the algorithm selects exactly the feeding formula from our scientifically developed knowledge base that best matches your companion's individual biological needs.",
  },
  {
    id: "45",
    category: "ai",
    question:
      "How does AylopetAI's personalized nutrition differ from store-bought pet food?",
    answer:
      "The main difference is the approach: store food is made with a universal formula aimed at mass consumption, not your dog's individual needs. AylopetAI breaks that pattern · it selects raw, pasteurized, Non-GMO nutrition tailored specifically for your companion. While industrial food undergoes high-temperature processing, our natural food is prepared at lower temperatures so it retains all heat-sensitive nutrients · a scientifically sound choice for your dog's health.",
  },
  {
    id: "46",
    category: "ai",
    question: "How safe is information provided by artificial intelligence?",
    answer:
      "Every recommendation from AylopetAI is designed to be as safe as possible because its algorithms are built on leading international standards in veterinary nutrition. The AI does not operate in isolation; it is trained by professional domain experts and relies only on verified scientific data. The system also accounts for your dog's individual restrictions and health history, which rules out unfounded or risky advice.",
  },
  {
    id: "47",
    category: "ai",
    question: "Can we trust artificial intelligence?",
    answer:
      "Absolutely. AylopetAI reduces human error and bases decisions only on international scientific protocols. It is an objective expert working 24/7 that safeguards your dog's health with maximum technological precision.",
  },
  {
    id: "48",
    category: "ai",
    question: "Where is the line between AylopetAI's recommendations and a veterinarian?",
    answer:
      "AylopetAI is a digital nutritionist, meaning its scope is exclusively nutrition and related topics. It helps you choose an ideal ration, but for any medical problem, diagnosis, or emergency you must contact a veterinarian. AylopetAI is a tool for nutritional prevention, not a substitute for clinical treatment.",
  },
  {
    id: "49",
    category: "ai",
    question: "Does AylopetAI learn from my pet's data?",
    answer:
      "Yes · with your consent, the system retains data and continuously improves through machine learning. AylopetAI not only analyzes current needs but learns from every new data point to maximize dietary precision and deliver an ever-improving individualized experience for your dog.",
  },
  {
    id: "50",
    category: "ai",
    question:
      "How can AI replace the intuition a veterinary nutritionist gains from experience?",
    answer:
      "AI doesn't replace intuition · it replaces subjective judgment with verifiable data and scientific precision. Where human experience relies on subjective perception, AylopetAI analyzes vast research and biometric relationships in seconds. Our system is a synthesis of a nutritionist's contextual knowledge and technological power.",
  },
  {
    id: "51",
    category: "ai",
    question:
      "Why is a plan created by AylopetAI considered a living process rather than a one-time recipe?",
    answer:
      "Your dog's needs change · with weight, activity, season, goals, and similar nuances. AylopetAI adapts and updates the plan accordingly.",
  },

  // --- Aylopet Pro ---
  {
    id: "4",
    category: "collar",
    question:
      "What advantages does Aylopet Pro give me over a regular GPS tracker?",
    answer:
      "Unlike a regular GPS tracker, which only shows location, Aylopet Pro is a comprehensive health and activity monitor. It tracks sleep phases, heart rate, calories burned, and stress levels, and uses AI to warn you in advance about potential health issues.",
  },
  {
    id: "5",
    category: "collar",
    question: "How does the collar get charged?",
    answer:
      "The collar charges via a modern wireless charger or a dedicated Type-C port included in the box. The battery offers high autonomy, and a single full charge typically lasts 7 to 14 days, depending on usage mode.",
  },
  {
    id: "52",
    category: "collar",
    question: "What is Aylopet Pro?",
    answer:
      "Aylopet Pro is a smart collar equipped with GPS monitoring. It helps you always know your dog's exact location and track daily activity. Combined with AylopetAI, the device lets us estimate your companion's individual energy expenditure and recommend a ration that aligns perfectly with your goals.",
  },
  {
    id: "53",
    category: "collar",
    question: "How does Aylopet Pro work?",
    answer:
      "The collar continuously monitors your dog's activity, and data syncs automatically with AylopetAI. Based on formulas developed by nutritionists, the AI calculates required calories and tells you what adjustments your ration may need.",
  },
  {
    id: "54",
    category: "collar",
    question: "Does the collar require constant internet access?",
    answer:
      "The collar needs Bluetooth or WiFi to sync data with the app. GPS tracking works over the LTE network, and some features remain available even in offline mode.",
  },
  {
    id: "55",
    category: "collar",
    question:
      "Is the Aylopet Pro collar waterproof, and how durable is it for active dogs?",
    answer:
      "Yes, the collar is IP67 water-resistant and purpose-built for active dogs.",
  },

  // --- Fresh Food ---
  {
    id: "6",
    category: "food",
    question: "Why is \"Fresh Food\" Aylopet's choice?",
    answer:
      "Fresh Food preserves all the essential vitamins, minerals, and amino acids that dry food loses during thermal processing. It supports better digestion, promotes a healthier coat, boosts energy, and extends your pet's lifespan.",
  },
  {
    id: "7",
    category: "food",
    question:
      "What does \"clean ingredient\" mean, and what is Aylopet's standard of food quality?",
    answer:
      "\"Clean ingredient\" means 100% natural, human-grade products, free of preservatives, artificial colorings, and by-products. Our standard is based exclusively on certified, ecologically clean farm-sourced raw materials.",
  },
  {
    id: "8",
    category: "food",
    question: "Does Aylopet's ration require any additional preparation?",
    answer:
      "No, the food is completely ready to serve. You simply take out the right portion from the fridge, bring it to room temperature, and serve it directly to your four-legged friend.",
  },
  {
    id: "9",
    category: "food",
    question: "How should Aylopet food be stored correctly?",
    answer:
      "For long-term storage, use the freezer (keeps for up to 6 months). Move the daily portion to the regular fridge 12-24 hours before use. Once opened, a package keeps in the fridge for a maximum of 3-4 days.",
  },
  {
    id: "10",
    category: "food",
    question: "Why can't homemade food replace the Aylopet formula?",
    answer:
      "When cooking at home, it's very difficult to maintain the correct balance of proteins, fats, vitamins, and the calcium-to-phosphorus ratio. The Aylopet formula, by contrast, is created by veterinary dietitians and artificial intelligence, ensuring a scientifically precise, balanced daily ration.",
  },
  {
    id: "11",
    category: "food",
    question: "Is the Aylopet ration suitable for all age groups (puppy, adult, senior)?",
    answer:
      "Yes. Aylopet's recipes are fully adaptable. The system automatically adjusts caloric content, nutrient concentration, and portion size based on your dog's life stage · puppy, adult, or senior.",
  },
  {
    id: "12",
    category: "food",
    question: "How much does an individualized nutrition plan cost?",
    answer:
      "The price is individual and depends on your dog's weight, age, activity level, and selected recipe. To get the exact cost, take our short quiz on the site, and the system will instantly calculate your daily and monthly budget.",
  },
  {
    id: "13",
    category: "food",
    question: "Do I need to consult a vet before switching to your food?",
    answer:
      "If your dog has chronic conditions, a vet consultation is always recommended. For healthy dogs, however, our AI system and veterinary team already ensure a completely safe and balanced plan.",
  },
  {
    id: "14",
    category: "food",
    question: "How do we switch from dry food to your fresh food?",
    answer:
      "The transition should happen gradually, over 7-10 days: for the first 2-3 days, mix 25% Aylopet with 75% of the old food, then move to a 50/50 mix, and in the final days, 75% Aylopet with 25% old food, until you've fully switched to Fresh Food.",
  },
  {
    id: "15",
    category: "food",
    question: "How are portions controlled, and do I need to weigh the food?",
    answer:
      "No weighing needed at all! Aylopet food comes in pre-weighed, pre-packaged portions that exactly match your dog's daily allowance. You simply open the pack and feed.",
  },

  // --- Our Recipes ---
  {
    id: "16",
    category: "recipes",
    question: "What types of recipes does Aylopet offer?",
    answer:
      "We offer a range of protein-based recipes: beef, chicken, turkey, and fish. Each recipe is enriched with fresh vegetables, superfoods, and a complex of natural vitamins.",
  },
  {
    id: "17",
    category: "recipes",
    question: "How are ingredients selected, and how is their quality controlled?",
    answer:
      "Our ingredients go through strict lab testing. We work only with certified local farmers, where meat and vegetables undergo daily quality control before processing.",
  },
  {
    id: "18",
    category: "recipes",
    question: "Do your recipes contain grains?",
    answer:
      "We offer both fully Grain-Free recipes for dogs with sensitive stomachs, as well as formulas containing beneficial grains (such as brown rice or oats) for high-energy activity.",
  },
  {
    id: "19",
    category: "recipes",
    question: "How does Aylopet's recipe differ from any other recipe?",
    answer:
      "The key difference is scientific precision and individualization. Our recipes aren't mass-produced; each portion is adjusted by AI according to the specific dog's metabolism, activity, and health.",
  },

  // --- Subscription & Account ---
  {
    id: "20",
    category: "subscription",
    question: "What is Aylopet's subscription model?",
    answer:
      "Aylopet operates on an automatic subscription principle. You activate the plan once, and food is automatically delivered to your door periodically, at a time convenient for you, so your companion never runs out of food.",
  },
  {
    id: "21",
    category: "subscription",
    question: "How do I activate an individual subscription for food or service?",
    answer:
      "To activate your subscription, fill out your dog's profile, choose the recommended nutrition plan, specify your delivery address, and link a bank card for secure payment.",
  },
  {
    id: "22",
    category: "subscription",
    question: "How can I make changes to an active subscription?",
    answer:
      "You can make changes at any time from your personal account: you can change the recipe, delivery date, address, or pause the subscription up to 24 hours before the next order is sent.",
  },
  {
    id: "23",
    category: "subscription",
    question: "Is it possible to manage several subscriptions at once?",
    answer:
      "Yes, from a single personal account you can manage multiple pet profiles, each with its own individual, independent subscription.",
  },
  {
    id: "24",
    category: "subscription",
    question: "How do I find out when my next order will arrive?",
    answer:
      "You'll receive an SMS and email notification as your order approaches. You can also track it from the \"Delivery Schedule\" section of your personal account.",
  },
  {
    id: "25",
    category: "subscription",
    question: "How is the service fee charged?",
    answer:
      "The charge is deducted automatically from your linked card, 24-48 hours before each batch is shipped. You'll always receive advance notice before any charge.",
  },
  {
    id: "26",
    category: "subscription",
    question: "What should I do if I'm going on a trip?",
    answer:
      "If you're traveling, you can temporarily pause your subscription with one click, or change the delivery address so your food is delivered to your travel destination instead.",
  },
  {
    id: "27",
    category: "subscription",
    question: "Can I cancel or reactivate my subscription at any time?",
    answer:
      "Yes, we have no long-term commitments. You can cancel or reactivate your subscription at any time, with no additional fees.",
  },
  {
    id: "28",
    category: "subscription",
    question: "I forgot my account password · how can I reset it?",
    answer:
      "On the login page, click \"Reset Password,\" enter your email, and use the link we send you to easily create a new password.",
  },

  // --- Creating Your Plan ---
  {
    id: "29",
    category: "planCreation",
    question:
      "How do I register my four-legged friend and start building an individual nutrition plan?",
    answer:
      "Click \"Create a Plan,\" fill out a short questionnaire about your dog's breed, age, weight, and health, and our AI will instantly build a personalized plan for you.",
  },
  {
    id: "30",
    category: "planCreation",
    question: "How do you determine my dog's nutritional needs?",
    answer:
      "Aylopet AI relies on international veterinary research (FEDIAF/AAFCO standards) and calculates precise metabolic energy needs based on your dog's weight, age, activity level, and spay/neuter status.",
  },
  {
    id: "31",
    category: "planCreation",
    question: "Can I change, pause, or cancel my subscriptions at any time?",
    answer:
      "Yes, you have full control over your subscriptions. Any change · pausing, canceling, or switching the recipe · is available from your personal account in just one click.",
  },

  // --- Packaging & Delivery ---
  {
    id: "32",
    category: "shippingDelivery",
    question: "How does the delivery system work, and does it cover the whole country?",
    answer:
      "Our delivery service covers all of Georgia. In Tbilisi and the surrounding area we use our own refrigerated transport, while in the regions delivery is handled through partner courier services, with strict adherence to temperature control.",
  },
  {
    id: "33",
    category: "shippingDelivery",
    question: "How can I be sure the food arrives undamaged?",
    answer:
      "The food is packed in special thermal boxes with dry ice, which keeps the temperature stable for at least 48 hours. Upon arrival, the packaging should be intact and the food should still be frozen.",
  },
  {
    id: "34",
    category: "shippingDelivery",
    question: "What should I do if I'm not home when the package arrives?",
    answer:
      "The courier will contact you in advance. You can ask them to leave the package with a neighbor, security, or at the door · the thermal packaging will keep the food cool for a few extra hours.",
  },
  {
    id: "35",
    category: "shippingDelivery",
    question: "How flexible is the delivery schedule?",
    answer:
      "The schedule is very flexible. You choose your preferred delivery day and time window during registration, and you can change it at any time from the calendar in your personal account.",
  },
  {
    id: "36",
    category: "shippingDelivery",
    question: "How eco-friendly is Aylopet's packaging?",
    answer:
      "Caring for the environment is one of our goals. Aylopet's boxes and thermal inserts are made from 100% recyclable and biodegradable materials that don't harm nature.",
  },
  {
    id: "37",
    category: "shippingDelivery",
    question: "What should I do if the package is damaged or delivery is late?",
    answer:
      "Contact our support team immediately via chat or hotline. We take full responsibility for any issue and will send you a new package free of charge as soon as possible.",
  },

  // --- Returns & Refunds ---
  {
    id: "38",
    category: "returns",
    question: "Is it possible to return food?",
    answer:
      "Food is a perishable product, so for hygiene and safety reasons, food that has already been received cannot be returned. However, if the issue relates to packaging quality or damage, we will fully compensate you for it.",
  },
  {
    id: "39",
    category: "returns",
    question:
      "What are the return or exchange terms for the Aylopet Pro collar?",
    answer:
      "The collar can be returned or exchanged within 14 days of purchase, provided it shows no physical damage, retains its original condition, and is returned with the complete set of accessories.",
  },
  {
    id: "40",
    category: "returns",
    question: "What should I do if the package is damaged or the order is incomplete?",
    answer:
      "Take a photo of the damaged packaging and send it to us via support chat. Our operators will respond immediately and replace the missing or damaged item.",
  },
  {
    id: "41",
    category: "returns",
    question: "Within what timeframe and how is a refund issued?",
    answer:
      "Refunds are issued to the same bank card used for the original payment. The process begins as soon as it's approved, and the funds appear in your account within 3 to 5 business days.",
  },
  {
    id: "42",
    category: "returns",
    question: "Can I pause access to the AI (chat), and how does this affect my account?",
    answer:
      "Yes, you can pause just the active AI assistant subscription. This won't delete your profile or feeding history, but it will limit real-time advice and AI health analysis until you reactivate it.",
  },
];

export const FAQ_KA: FaqCopy = {
  title: "ხშირად დასმული კითხვები",
  subtitle:
    "AylopetAI, სმართ ქოლარი და ცოცხალი საკვები · ყველა პასუხი ერთ ადგილას.",
  allLabel: "ყველა",
  searchPlaceholder: "მოძებნე კითხვა ან საკვანძო სიტყვა...",
  searchAriaLabel: "კითხვების ძებნა",
  clearSearchAriaLabel: "ძებნის გასუფთავება",
  noResultsTitle: "ვერაფერი მოიძებნა",
  noResultsBody: "სცადეთ სხვა საკვანძო სიტყვა ან შეამოწმეთ ორთოგრაფია.",
  questionsSingular: "კითხვა",
  questionsPlural: "კითხვა",
  categories: CATEGORIES_KA,
  items: ITEMS_KA,
};

export const FAQ_EN: FaqCopy = {
  title: "Frequently Asked Questions",
  subtitle:
    "AylopetAI, Smart Collar, and Fresh Food · every answer in one place.",
  allLabel: "All",
  searchPlaceholder: "Search a question or keyword...",
  searchAriaLabel: "Search questions",
  clearSearchAriaLabel: "Clear search",
  noResultsTitle: "No results found",
  noResultsBody: "Try a different keyword or check your spelling.",
  questionsSingular: "question",
  questionsPlural: "questions",
  categories: CATEGORIES_EN,
  items: ITEMS_EN,
};

export function getFaqContent(locale: "ka" | "en"): FaqCopy {
  return locale === "ka" ? FAQ_KA : FAQ_EN;
}

/** Compact homepage teaser · a diverse highlight across top categories. */
export function getHomeFaqTeasers(locale: "ka" | "en") {
  const copy = getFaqContent(locale);
  const byId = new Map(copy.items.map((item) => [item.id, item] as const));
  return (["1", "6", "20", "32"] as const)
    .map((id) => byId.get(id))
    .filter((item): item is FaqItem => Boolean(item))
    .map((item) => ({
      title: item.question,
      content: item.answer,
    }));
}
