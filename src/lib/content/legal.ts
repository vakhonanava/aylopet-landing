export interface LegalSection {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalDoc {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export type LegalPageKey = "privacy" | "terms" | "cookies" | "accessibility";

export interface LegalContent {
  backLabel: string;
  lastUpdatedLabel: string;
  privacy: LegalDoc;
  terms: LegalDoc;
  cookies: LegalDoc;
  accessibility: LegalDoc;
}

const LEGAL_KA: LegalContent = {
  backLabel: "მთავარი",
  lastUpdatedLabel: "ბოლოს განახლდა",
  privacy: {
    title: "კონფიდენციალურობის პოლიტიკა",
    lastUpdated: "2026 წლის 27 თებერვალი",
    sections: [
      {
        paragraphs: [
          "ეს კონფიდენციალურობის შეტყობინება შპს Aylopet-ისთვის აღწერს როგორ და რატომ შეიძლება მივიღოთ წვდომა, შევაგროვოთ, შევინახოთ, გამოვიყენოთ და/ან გავაზიაროთ თქვენი პერსონალური ინფორმაცია, როდესაც იყენებთ ჩვენს სერვისებს.",
          "დაგვიკავშირდით: support@aylopet.com ან ფოსტით · დავით აღმაშენებლის გამზირი, ნომერი 200, სამტრედია, საქართველო.",
          "თუ არ ეთანხმებით ჩვენს პოლიტიკას და პრაქტიკას, გთხოვთ, არ გამოიყენოთ ჩვენი სერვისები.",
        ],
        list: [
          "ეწვევით ვებსაიტს aylopet.com ან სხვა გვერდებს, რომლებიც ბმულდება ამ შეტყობინებაზე.",
          "იყენებთ პერსონალიზებულ ახალი ძაღლის საკვების გამოწერებსა და საცალო ვაჭრობას, AI კვების არქიტექტორს, ჭკვიან GPS აპარატურას, ჯანმრთელობის შეხსენებებსა და პარტნიორთა ლოიალობის პროგრამას.",
          "დაგვიკავშირდით სხვა შესაბამისი გზებით, მათ შორის მარკეტინგისა და ღონისძიებების ფარგლებში.",
        ],
      },
      {
        heading: "Aylopet-ის ეკოსისტემა",
        paragraphs: [
          "Aylopet უზრუნველყოფს ცხოველთა კეთილდღეობის ინტეგრირებულ ეკოსისტემას, რომელიც მოიცავს:",
        ],
        list: [
          "კვება: პასტერიზებული უმი ძაღლის საკვების საცალო გაყიდვები და განმეორებადი გამოწერები.",
          "აპარატურა და ტექნოლოგია: Aylopet Pro · ჭკვიანი GPS საყელო, მდებარეობისა და ფიზიკური აქტივობის მონიტორინგით.",
          "AI სერვისები: ინტერაქტიული AI კვების არქიტექტორი და ჯანმრთელობის შეხსენებები.",
          "საცალო ვაჭრობა და პარტნიორები: ფასდაკლებები მესამე მხარის პარტნიორებთან.",
          "მონაცემთა ინტეგრაცია: ფიზიკური აქტივობის მონაცემების სინქრონიზაცია პორციებისა და ინსაითების მოსარგებად.",
        ],
      },
      {
        heading: "ძირითადი პუნქტების რეზიუმე",
        list: [
          "ჩვენ შეიძლება დავამუშაოთ პერსონალური ინფორმაცია იმის მიხედვით, თუ როგორ ურთიერთობთ ჩვენთან და სერვისებთან, რა არჩევანს აკეთებთ და რა პროდუქტებს/ფუნქციებს იყენებთ.",
          "ჩვენ შეიძლება დავამუშაოთ მგრძნობიარე პერსონალური ინფორმაცია მხოლოდ თანხმობით ან მოქმედი კანონმდებლობით ნებადართულ ფარგლებში.",
          "მესამე მხარეებისგან პირდაპირ მონაცემებს არ ვაგროვებთ, გარდა სოციალური შესვლისას მიღებული პროფილის ინფორმაციისა.",
          "ინფორმაციას ვამუშავებთ სერვისების მიწოდების, გაუმჯობესების, უსაფრთხოების, თაღლითობის პრევენციისა და კანონის დაცვის მიზნით.",
          "ინფორმაცია შეიძლება გაზიარდეს მხოლოდ განსაზღვრულ სიტუაციებში და შესაბამის კატეგორიის მესამე მხარეებთან.",
          "თქვენი ინფორმაციის დასაცავად გვაქვს ორგანიზაციული და ტექნიკური ზომები.",
        ],
      },
      {
        heading: "თქვენი უფლებები",
        paragraphs: ["საქართველოს მოქმედი კანონმდებლობის შესაბამისად, თქვენ გაქვთ უფლება:"],
        list: [
          "მიიღოთ ინფორმაცია მონაცემთა ტიპებზე, დამუშავების საშუალებებსა და ხანგრძლივობაზე.",
          "მოითხოვოთ არაზუსტი/არასწორი/არასრული მონაცემების გასწორება, განახლება ან შევსება.",
          "მოითხოვოთ დამუშავების შეწყვეტა, წაშლა ან განადგურება, პროფაილინგის ჩათვლით.",
          "მოითხოვოთ მონაცემთა დაბლოკვა.",
          "ნებისმიერ დროს გაიხმოთ თანხმობა განმარტების გარეშე.",
        ],
      },
      {
        heading: "რატომ ვამუშავებთ თქვენს პერსონალურ მონაცემებს",
        list: [
          "მიზნობრივი რეკლამისთვის და პერსონალიზებული კონტენტის საჩვენებლად.",
          "სერვისების დაცვა, უსაფრთხოება, თაღლითობის მონიტორინგი და პრევენცია.",
          "სერვისების/პროდუქტების/მარკეტინგის შეფასება და გაუმჯობესება.",
          "გამოყენების ტენდენციების იდენტიფიცირება.",
          "სამართლებრივი ვალდებულებების შესრულება და უფლებების დაცვა.",
          "შინაური ცხოველების ჯანმრთელობის მონიტორინგი და AI კვების რეკომენდაციები.",
        ],
      },
      {
        heading: "სოციალური შესვლები",
        paragraphs: [
          "თუ ირჩევთ რეგისტრაციას ან შესვლას სოციალური მედიის ანგარიშით, შეიძლება მივიღოთ გარკვეული პროფილის ინფორმაცია (მაგ. სახელი, ელფოსტა, პროფილის სურათი და სხვა).",
          "ამ ინფორმაციას ვიყენებთ მხოლოდ ამ კონფიდენციალურობის შეტყობინებაში აღწერილი მიზნებისთვის. მესამე მხარის პლატფორმების მიერ თქვენი ინფორმაციის გამოყენებას ჩვენ არ ვაკონტროლებთ.",
        ],
      },
      {
        heading: "რამდენ ხანს ვინახავთ ინფორმაციას",
        paragraphs: [
          "ინფორმაციას ვინახავთ იმდენ ხანს, რამდენიც აუცილებელია ამ შეტყობინებაში განსაზღვრული მიზნებისთვის, თუ კანონით არ მოითხოვება/ნებადართულია უფრო ხანგრძლივი ვადა.",
          "როდესაც აღარ არსებობს მონაცემთა დამუშავების მიმდინარე ლეგიტიმური ბიზნეს საჭიროება, ინფორმაცია იშლება ან ანონიმური ხდება.",
          "თუ წაშლა შეუძლებელია (მაგალითად, სარეზერვო არქივებში), ინფორმაცია უსაფრთხოდ ინახება და იზოლირდება შემდგომი დამუშავებისგან, სანამ წაშლა შესაძლებელი გახდება.",
        ],
      },
      {
        heading: "არასრულწლოვნები",
        paragraphs: [
          "ჩვენ შეგნებულად არ ვაგროვებთ მონაცემებს და არ ვახორციელებთ მარკეტინგს 18 წლამდე პირებზე.",
          "თუ აღმოვაჩენთ, რომ 18 წლამდე პირის მონაცემი შეგროვდა, ანგარიშს გავაუქმებთ და მონაცემებს წავშლით გონივრულ ვადაში.",
        ],
      },
      {
        heading: "დაგვიკავშირდით",
        paragraphs: [
          "კონფიდენციალურობასთან დაკავშირებული კითხვებისთვის ან უფლებების გამოსაყენებლად დაგვიკავშირდით: support@aylopet.com.",
        ],
      },
    ],
  },
  terms: {
    title: "გამოყენების პირობები",
    lastUpdated: "2026 წლის 27 თებერვალი",
    sections: [
      {
        heading: "შეთანხმება ჩვენს იურიდიულ პირობებზე",
        paragraphs: [
          "ჩვენ (\"კომპანია\", \"ჩვენ\", \"ჩვენი\") ვმართავთ და ვაწვდით სერვისებს, რომლებიც მიუთითებს ან უკავშირდება ამ იურიდიულ პირობებს (\"იურიდიული პირობები\") (ერთობლივად, \"სერვისები\"). თქვენ შეგიძლიათ დაგვიკავშირდეთ ელფოსტით მისამართზე support@aylopet.com ან ფოსტით მისამართზე: დავით აღმაშენებლის გამზირი, ნომერი 200, სამტრედია, საქართველო.",
          "ეს იურიდიული პირობები წარმოადგენს იურიდიულად სავალდებულო შეთანხმებას თქვენსა (პირადად ან იურიდიული პირის სახელით · \"თქვენ\") და ჩვენს შორის თქვენს მიერ სერვისებზე წვდომისა და გამოყენების შესახებ. სერვისებზე წვდომით თქვენ ადასტურებთ, რომ წაიკითხეთ, გაიგეთ და ეთანხმებით ყველა ამ იურიდიულ პირობას. თუ თქვენ არ ეთანხმებით ყველა ამ იურიდიულ პირობას, მაშინ გეკრძალებათ სერვისების გამოყენება და დაუყოვნებლივ უნდა შეწყვიტოთ მათი გამოყენება.",
          "დამატებითი პირობები ან დოკუმენტები, რომლებიც შეიძლება დროდადრო განთავსდეს სერვისებზე, პირდაპირ არის ინკორპორირებული ამ დოკუმენტში მითითების სახით. ჩვენ ვიტოვებთ უფლებას, ჩვენი შეხედულებისამებრ, ნებისმიერ დროს და ნებისმიერი მიზეზით შევიტანოთ ცვლილებები ან მოდიფიკაციები ამ იურიდიულ პირობებში. ნებისმიერი ცვლილების შესახებ ჩვენ გაცნობებთ ოფიციალური შეტყობინების გაგზავნით იმ ელფოსტაზე, რომელიც მიუთითეთ ანგარიშის შექმნისას. თქვენ იტოვებთ უფლებას ცალმხრივად შეწყვიტოთ ჩვენთან შეთანხმება, თუ ცვლილებები და/ან მოდიფიკაციები თქვენთვის მიუღებელია.",
        ],
      },
      {
        heading: "1. ჩვენი სერვისები",
        paragraphs: [
          "სერვისების გამოყენებისას მოწოდებული ინფორმაცია არ არის გამიზნული გასავრცელებლად ან გამოსაყენებლად ნებისმიერი პირის ან იურიდიული პირის მიერ ნებისმიერ იურისდიქციაში ან ქვეყანაში, სადაც ასეთი გავრცელება ან გამოყენება ეწინააღმდეგება კანონს ან რეგულაციას, ან რაც დაგვაკისრებდა რეგისტრაციის ვალდებულებას ასეთ იურისდიქციაში ან ქვეყანაში.",
          "შესაბამისად, ის პირები, რომლებიც ირჩევენ სერვისებზე წვდომას სხვა ლოკაციებიდან, ამას აკეთებენ საკუთარი ინიციატივით და თავად არიან პასუხისმგებელნი ადგილობრივი კანონების დაცვაზე, თუ და რამდენადაც ადგილობრივი კანონები გამოიყენება.",
        ],
      },
      {
        heading: "2. ინტელექტუალური საკუთრების უფლებები",
        paragraphs: [
          "ჩვენი ინტელექტუალური საკუთრება: ჩვენ ვართ ჩვენს სერვისებში არსებული ყველა ინტელექტუალური საკუთრების უფლების მფლობელი ან ლიცენზიის მფლობელი, მათ შორის ყველა საწყისი კოდის, მონაცემთა ბაზების, ფუნქციონალის, პროგრამული უზრუნველყოფის, ვებსაიტის დიზაინის, აუდიო, ვიდეო, ტექსტის, ფოტოებისა და გრაფიკის (ერთობლივად \"კონტენტი\"), ასევე მათში შემავალი სავაჭრო ნიშნების, მომსახურების ნიშნებისა და ლოგოების (\"ნიშნები\").",
          "თქვენი წარდგენილი მასალები: სერვისების შესახებ ნებისმიერი კითხვის, კომენტარის, შეთავაზების, იდეის, გამოხმაურების ან სხვა ინფორმაციის პირდაპირ ჩვენთვის გამოგზავნით, თქვენ თანხმდებით, რომ გადმოგვცემთ ყველა ინტელექტუალური საკუთრების უფლებას აღნიშნულ მასალებზე, თუ სხვაგვარად არ რეგულირდება საქართველოს კანონმდებლობით.",
          "სერვისების ნებისმიერი ნაწილის მეშვეობით მასალების გამოგზავნით თქვენ:",
        ],
        list: [
          "ადასტურებთ, რომ წაიკითხეთ და ეთანხმებით ჩვენს \"აკრძალულ საქმიანობას\" და არ გამოაქვეყნებთ უკანონო, შეურაცხმყოფელ, მუქარის შემცველ, ცრუ ან შეცდომაში შემყვან მასალას.",
          "მოქმედი კანონმდებლობით დაშვებულ ფარგლებში, უარს ამბობთ მორალურ უფლებებზე ასეთ მასალებთან დაკავშირებით.",
          "იძლევით გარანტიას, რომ მასალა არის თქვენი ან გაქვთ შესაბამისი უფლებები/ლიცენზიები.",
          "ადასტურებთ, რომ წარდგენილი მასალები არ წარმოადგენს კონფიდენციალურ ინფორმაციას.",
          "ხართ ერთპიროვნულად პასუხისმგებელი თქვენს მასალებზე და გეკისრებათ ჩვენთვის ზიანის ანაზღაურება დარღვევის შემთხვევაში.",
        ],
      },
      {
        heading: "3. მომხმარებლის განცხადებები (გარანტიები)",
        paragraphs: [
          "სერვისების გამოყენებით თქვენ აცხადებთ და იძლევით გარანტიას, რომ: (1) გაქვთ ქმედუნარიანობა და ეთანხმებით ამ იურიდიული პირობების დაცვას; (2) არ ხართ არასრულწლოვანი შესაბამის იურისდიქციაში; (3) არ შეხვალთ სერვისებზე ავტომატიზებული ან არაადამიანური საშუალებებით; (4) არ გამოიყენებთ სერვისებს უკანონო ან არაავტორიზებული მიზნისთვის; და (5) თქვენი გამოყენება არ დაარღვევს მოქმედ კანონმდებლობას.",
        ],
      },
      {
        heading: "4. აკრძალული საქმიანობა",
        paragraphs: [
          "თქვენ არ შეგიძლიათ სერვისების გამოყენება სხვა მიზნით, გარდა იმისა, რისთვისაც სერვისები არის განკუთვნილი. როგორც მომხმარებელი, თანხმდებით, რომ არ:",
        ],
        list: [
          "ამოიღებთ სისტემატურად მონაცემებს სერვისებიდან წერილობითი ნებართვის გარეშე.",
          "მოგვატყუებთ ან შეცდომაში შეიყვანთ ჩვენ/სხვა მომხმარებლებს (მათ შორის პაროლების მოპოვების მცდელობით).",
          "ჩაერევით უსაფრთხოების ფუნქციებში ან შეზღუდვების გვერდის ავლით.",
          "გამოიყენებთ სერვისებს შეურაცხყოფის, შევიწროების, ზიანის მიყენების მიზნით.",
          "გავრცელებთ ვირუსებს, ტროას ცხენებს, სპამს ან სხვა მავნე მასალას.",
          "გამოიყენებთ სკრიპტებს, ბოტებს, რობოტებს, სკრეპერებს ან სხვა ავტომატიზებულ მექანიზმებს.",
          "წაშლით საავტორო უფლებების ან საკუთრების ნიშნულებს კონტენტიდან.",
          "შეეცდებით სხვა მომხმარებლის განსახიერებას.",
          "შექმნით ზედმეტ დატვირთვას სერვისებზე/ქსელებზე ან ჩაერევით ფუნქციონირებაში.",
          "გამოიყენებთ სერვისებს ჩვენთან კონკურენციის ან არაავტორიზებული კომერციული მიზნებისთვის.",
        ],
      },
      {
        heading: "5. მომხმარებლის მიერ შექმნილი კონტენტი/წვლილი",
        paragraphs: [
          "ჩვენ შეიძლება მოგცეთ შესაძლებლობა შექმნათ, წარადგინოთ, გამოაქვეყნოთ ან გაავრცელოთ კონტენტი და მასალები (ერთობლივად, \"წვლილი\"). როდესაც ქმნით ან ხელმისაწვდომს ხდით წვლილს, თქვენ აცხადებთ და იძლევით გარანტიას, რომ იგი შეესაბამება ამ პირობებს.",
        ],
      },
      {
        heading: "6. წვლილის ლიცენზია",
        paragraphs: [
          "თქვენ და სერვისები თანხმდებით, რომ ჩვენ შეგვიძლია მივიღოთ წვდომა, შევინახოთ, დავამუშაოთ და გამოვიყენოთ თქვენ მიერ მოწოდებული ინფორმაცია და პერსონალური მონაცემი (პარამეტრების ჩათვლით). უკუკავშირის გაგზავნით თანხმდებით, რომ ის შეიძლება გამოყენებულ იქნას ნებისმიერი მიზნისთვის კომპენსაციის გარეშე.",
          "ჩვენ არ ვაცხადებთ საკუთრების უფლებას თქვენს წვლილზე. თქვენ ინარჩუნებთ სრულ საკუთრების უფლებას თქვენს წვლილსა და მასთან დაკავშირებულ უფლებებზე.",
        ],
      },
      {
        heading: "7. სერვისების მართვა",
        paragraphs: [
          "ჩვენ ვიტოვებთ უფლებას (არა ვალდებულებას) ვაკონტროლოთ სერვისები დარღვევებზე, მივიღოთ სამართლებრივი ზომები, შევზღუდოთ წვდომა, წავშალოთ ზედმეტად მძიმე ფაილები და სხვაგვარად ვმართოთ სერვისები ჩვენი უფლებებისა და გამართული მუშაობის დასაცავად.",
        ],
      },
      {
        heading: "8. ვადა და შეწყვეტა",
        paragraphs: [
          "ეს იურიდიული პირობები ძალაშია, სანამ თქვენ იყენებთ სერვისებს. ჩვენ ვიტოვებთ უფლებას, ყოველგვარი გაფრთხილების გარეშე, შევზღუდოთ ან შევწყვიტოთ სერვისებზე წვდომა კანონიერი მიზეზით, მათ შორის პირობების ან კანონის დარღვევის შემთხვევაში.",
          "თუ ანგარიში შეგიწყვიტეთ ან შეგიჩერეთ, გეკრძალებათ ახალი ანგარიშის შექმნა თქვენი ან მესამე პირის სახელით. ჩვენ ვიტოვებთ სამართლებრივი დაცვის ზომების გამოყენების უფლებას.",
        ],
      },
      {
        heading: "9. ცვლილებები და შეფერხებები",
        paragraphs: [
          "ჩვენ ვიტოვებთ უფლებას შევცვალოთ, მოვხსნათ ან განვაახლოთ სერვისების კონტენტი ნებისმიერ დროს შეტყობინების გარეშე. ჩვენ არ ვიქნებით პასუხისმგებელი თქვენი დანაკარგისთვის სერვისების მოდიფიკაციის, შეჩერების ან შეწყვეტის გამო.",
          "სერვისების მუდმივი ხელმისაწვდომობა ვერ იქნება გარანტირებული. ტექნიკური მომსახურება, შეფერხებები და შეცდომები შესაძლებელია.",
        ],
      },
      {
        heading: "10. მარეგულირებელი კანონმდებლობა",
        paragraphs: [
          "ეს იურიდიული პირობები რეგულირდება და განიმარტება საქართველოს კანონმდებლობის შესაბამისად.",
        ],
      },
      {
        heading: "11. დავების გადაწყვეტა",
        paragraphs: [
          "არაფორმალური მოლაპარაკებები: დავის სასამართლოში გადატანამდე მხარეები შეეცდებიან არაფორმალურ შეთანხმებას მინიმუმ 30 დღის განმავლობაში.",
          "სამართალწარმოება: ნებისმიერი დავა საბოლოოდ გადაწყდება საქართველოს შესაბამის სასამართლოებში, საქართველოს საპროცესო კანონმდებლობის შესაბამისად.",
        ],
      },
      {
        heading: "12. შესწორებები",
        paragraphs: [
          "სერვისებზე შეიძლება იყოს ტიპოგრაფიული შეცდომები, უზუსტობები ან გამოტოვებები. ჩვენ ვიტოვებთ უფლებას გამოვასწოროთ შეცდომები და განვაახლოთ ინფორმაცია წინასწარი შეტყობინების გარეშე.",
        ],
      },
      {
        heading: "13. პასუხისმგებლობის უარყოფა",
        paragraphs: [
          "სერვისები მოწოდებულია \"როგორც არის\" და \"როგორც ხელმისაწვდომია\" პრინციპით. თქვენი გამოყენება არის მხოლოდ თქვენი რისკის ქვეშ.",
          "საქართველოს კანონმდებლობით დაშვებულ ფარგლებში, ჩვენ უარს ვამბობთ ყველა გამოხატულ ან ნაგულისხმევ გარანტიაზე.",
          "ჩვენ არ ვიღებთ პასუხისმგებლობას შეცდომებზე, შეფერხებებზე, არაავტორიზებულ წვდომაზე, მესამე მხარის მიერ გადაცემულ ვირუსებზე ან მესამე მხარის სერვისებთან ტრანზაქციებზე.",
        ],
      },
      {
        heading: "14. მომხმარებლის მონაცემები",
        paragraphs: [
          "ჩვენ ვინარჩუნებთ გარკვეულ მონაცემებს სერვისების მუშაობის მართვის მიზნით და ასევე თქვენს გამოყენებასთან დაკავშირებულ მონაცემებს. მიუხედავად სარეზერვო ასლების რეგულარული შექმნისა, თქვენ ხართ პასუხისმგებელი თქვენ მიერ გადაცემულ მონაცემებზე და თქვენს აქტივობაზე.",
        ],
      },
      {
        heading: "15. ელექტრონული კომუნიკაციები, ტრანზაქციები და ხელმოწერები",
        paragraphs: [
          "სერვისების მონახულება, ელფოსტის გაგზავნა და ფორმების შევსება წარმოადგენს ელექტრონულ კომუნიკაციას. თქვენ ეთანხმებით ელექტრონული კომუნიკაციის მიღებასა და ელექტრონული ხელმოწერების, ჩანაწერებისა და შეტყობინებების გამოყენებას.",
        ],
      },
      {
        heading: "16. სხვადასხვა",
        paragraphs: [
          "ეს იურიდიული პირობები და შესაბამისი პოლიტიკები წარმოადგენს თქვენსა და ჩვენს შორის სრულ შეთანხმებას. დებულების აღუსრულებლობა არ წარმოადგენს უფლებაზე უარის თქმას. პირობების ნაწილი თუ ბათილია, დანარჩენი ძალაში რჩება. არ იქმნება პარტნიორობის, დასაქმების ან სააგენტოს ურთიერთობა.",
        ],
      },
      {
        heading: "17. მნიშვნელოვანი გაფრთხილება ანგარიშის წაშლამდე",
        paragraphs: [
          "არაგანზრახი გადასახადების ან სერვისის ფუნქციონალის დაკარგვის თავიდან ასაცილებლად, ანგარიშის წაშლამდე ხელით უნდა გააუქმოთ:",
        ],
        list: [
          "კვების გამოწერები (Food Subscriptions) · განმეორებადი შეკვეთები და ავტომატური ბილინგი.",
          "AI კვების ექსპერტზე წვდომა · AI ჩეთის გამოწერა.",
          "Smart GPS სერვისები · აქტიური თვალთვალის/მონაცემთა გეგმები Aylopet Pro-ზე.",
          "Aylopet არ არის პასუხისმგებელი უწყვეტ გადასახადებზე, თუ მომხმარებელი ინდივიდუალურ სერვისებს პროფილის წაშლამდე არ გააუქმებს.",
        ],
      },
      {
        heading: "18. დაგვიკავშირდით",
        paragraphs: [
          "სერვისებთან დაკავშირებული საჩივრის ან დამატებითი ინფორმაციისთვის დაგვიკავშირდით: support@aylopet.com.",
        ],
      },
    ],
  },
  cookies: {
    title: "ქუქი პოლიტიკა",
    lastUpdated: "2026 წლის 27 თებერვალი",
    sections: [
      {
        paragraphs: [
          "წინამდებარე ქუქი-ფაილების პოლიტიკა განმარტავს, როგორ იყენებს Aylopet LLC (\"კომპანია\", \"ჩვენ\", \"ჩვენი\") ქუქი-ფაილებსა და მსგავს ტექნოლოგიებს თქვენი ამოცნობისთვის, როდესაც სტუმრობთ ჩვენს ვებგვერდს: https://aylopet.com. დოკუმენტი განმარტავს, რას წარმოადგენს ეს ტექნოლოგიები, რატომ ვიყენებთ მათ და რა უფლებები გაქვთ ჩვენი გამოყენების კონტროლისთვის.",
          "ზოგიერთ შემთხვევაში ქუქი-ფაილები შეიძლება გამოვიყენოთ პერსონალური ინფორმაციის შესაგროვებლად, ან ისეთი ინფორმაციისთვის, რომელიც პერსონალურ ინფორმაციად იქცევა სხვა მონაცემებთან კომბინირების შედეგად.",
        ],
      },
      {
        heading: "რა არის ქუქი-ფაილები?",
        paragraphs: [
          "ქუქი-ფაილები არის მცირე ზომის მონაცემთა ფაილები, რომლებიც თავსდება თქვენს კომპიუტერზე ან მობილურ მოწყობილობაზე ვებგვერდის მონახულებისას. ქუქი-ფაილებს ვებგვერდის მფლობელები ფართოდ იყენებენ იმისთვის, რომ ვებგვერდი გამართულად მუშაობდეს, უფრო ეფექტური იყოს და მიიღონ შესაბამისი ანგარიშგებითი ინფორმაცია.",
          "ვებგვერდის მფლობელის მიერ დაყენებულ ქუქი-ფაილებს (ამ შემთხვევაში, Aylopet LLC) ეწოდება \"პირველი მხარის ქუქი-ფაილები\". სხვა მხარეების მიერ დაყენებულ ქუქი-ფაილებს ეწოდება \"მესამე მხარის ქუქი-ფაილები\". მესამე მხარის ქუქი-ფაილები უზრუნველყოფს მესამე მხარის ფუნქციებსა და შესაძლებლობებს ვებგვერდზე ან ვებგვერდის მეშვეობით (მაგალითად: რეკლამა, ინტერაქტიული კონტენტი, ანალიტიკა).",
        ],
      },
      {
        heading: "როგორ შემიძლია ქუქი-ფაილების კონტროლი?",
        paragraphs: [
          "თქვენ გაქვთ უფლება თავად გადაწყვიტოთ, მიიღებთ თუ უარყოფთ ქუქი-ფაილებს. ამ უფლების გამოსაყენებლად შეგიძლიათ დააყენოთ პრეფერენციები \"Cookie Preference Center\"-ში. აღნიშნული ცენტრი საშუალებას გაძლევთ აირჩიოთ ქუქი-ფაილების კატეგორიები, რომლებსაც მიიღებთ ან უარყოფთ. აუცილებელი ქუქი-ფაილების უარყოფა შეუძლებელია, რადგან ისინი მკაცრად აუცილებელია მომსახურების მიწოდებისთვის.",
          "\"Cookie Preference Center\" ხელმისაწვდომია შეტყობინების ბანერში და ჩვენს ვებგვერდზე. თუ უარს იტყვით არასავალდებულო ქუქი-ფაილებზე, ვებგვერდის გამოყენებას მაინც შეძლებთ, თუმცა გარკვეულ ფუნქციებსა და არეალებზე წვდომა შეიძლება შეიზღუდოს. ასევე შეგიძლიათ თქვენი ბრაუზერის პარამეტრებიდან დააყენოთ ქუქი-ფაილების მიღება ან უარყოფა.",
        ],
      },
      {
        heading: "როგორ ვაკონტროლო ქუქი-ფაილები ბრაუზერში?",
        paragraphs: [
          "რადგან ბრაუზერებში ქუქი-ფაილების მართვის გზები განსხვავდება, დამატებითი ინფორმაციისთვის ეწვიეთ თქვენი ბრაუზერის Help მენიუს.",
          "დამატებით, სარეკლამო ქსელების უმეტესობა გაძლევთ მიზნობრივ რეკლამაზე უარის თქმის შესაძლებლობას. დეტალებისთვის ეწვიეთ:",
        ],
        list: [
          "Digital Advertising Alliance",
          "Digital Advertising Alliance of Canada",
          "European Interactive Digital Advertising Alliance",
        ],
      },
      {
        heading: "რა ხდება სხვა თრექინგ-ტექნოლოგიების შემთხვევაში?",
        paragraphs: [
          "ქუქი-ფაილები არ არის ვიზიტორების ამოცნობის ან ქცევის ანალიზის ერთადერთი გზა. შესაძლოა დროდადრო გამოვიყენოთ სხვა მსგავსი ტექნოლოგიები, მაგალითად ვებ-ბეკონები (\"tracking pixels\" ან \"clear gifs\"). ეს არის მცირე გრაფიკული ფაილები უნიკალური იდენტიფიკატორით, რაც გვაძლევს საშუალებას დავაფიქსიროთ, როდის მოინახულა ვინმემ ვებგვერდი ან გახსნა ელფოსტა, რომელიც ამ ტექნოლოგიას შეიცავს.",
        ],
      },
      {
        heading: "იყენებთ თუ არა Flash ქუქი-ფაილებს ან Local Shared Objects-ს?",
        paragraphs: [
          "ვებგვერდები შესაძლოა იყენებდნენ ე.წ. \"Flash ქუქი-ფაილებს\" (Local Shared Objects ან \"LSOS\") სხვადასხვა მიზნისთვის, მათ შორის ჩვენი სერვისების გამოყენების შესახებ ინფორმაციის შესაგროვებლად, თაღლითობის პრევენციისთვის და სხვა საოპერაციო საჭიროებებისთვის.",
          "თუ არ გსურთ Flash ქუქი-ფაილების შენახვა თქვენს მოწყობილობაზე, შეგიძლიათ Flash Player-ის პარამეტრებში შეზღუდოთ მათი შენახვა (Website Storage Settings Panel / Global Storage Settings Panel).",
        ],
      },
      {
        heading: "იყენებთ თუ არა მიზნობრივ რეკლამას?",
        paragraphs: [
          "მესამე მხარეებმა შეიძლება განათავსონ ქუქი-ფაილები თქვენს კომპიუტერზე ან მობილურ მოწყობილობაზე ჩვენი ვებგვერდის მეშვეობით რეკლამის საჩვენებლად. ასეთმა კომპანიებმა შეიძლება გამოიყენონ ინფორმაცია ამ და სხვა ვებგვერდებზე თქვენი ვიზიტების შესახებ, რათა გაჩვენონ თქვენთვის შესაბამისი შეთავაზებები.",
          "ამ პროცესით მიღებული ინფორმაცია, თავისთავად, არ გვაძლევს საშუალებას დავადგინოთ თქვენი სახელი, საკონტაქტო ინფორმაცია ან სხვა პირდაპირი იდენტიფიკატორები, თუ თქვენ თავად არ მოგვაწოდებთ ამ მონაცემებს.",
        ],
      },
      {
        heading: "რამდენად ხშირად განახლდება ქუქი-ფაილების პოლიტიკა?",
        paragraphs: [
          "შესაძლოა პერიოდულად განვაახლოთ ეს დოკუმენტი, მათ შორის ქუქი-ფაილებში განხორციელებული ცვლილებების, საოპერაციო საჭიროებების, იურიდიული ან მარეგულირებელი მოთხოვნების გამო. გთხოვთ, რეგულარულად გადაამოწმოთ ეს გვერდი.",
          "გვერდის დასაწყისში მითითებული თარიღი ასახავს ბოლო განახლების დროს.",
        ],
      },
      {
        heading: "სად შემიძლია დამატებითი ინფორმაციის მიღება?",
        paragraphs: [
          "თუ გაქვთ შეკითხვები ქუქი-ფაილების ან სხვა ტექნოლოგიების გამოყენებასთან დაკავშირებით, დაგვიკავშირდით:",
          "Aylopet LLC, საქართველო",
          "ტელეფონი: +995595885625",
        ],
      },
    ],
  },
  accessibility: {
    title: "ხელმისაწვდომობის განცხადება",
    lastUpdated: "2026 წლის 27 თებერვალი",
    sections: [
      {
        heading: "ჩვენი ვალდებულება",
        paragraphs: [
          "Aylopet ისწრაფვის, რომ ვებგვერდი მაქსიმალურად ხელმისაწვდომი იყოს ყველასთვის, მათ შორის შეზღუდული შესაძლებლობის მქონე მომხმარებლებისთვის.",
          "ჩვენ ეტაპობრივად ვაუმჯობესებთ დიზაინსა და ფუნქციონალს, რათა საიტით სარგებლობა იყოს უფრო მარტივი, გასაგები და კომფორტული.",
        ],
      },
      {
        heading: "როგორ ვმუშაობთ ხელმისაწვდომობაზე",
        paragraphs: [
          "ვხელმძღვანელობთ საერთაშორისო საუკეთესო პრაქტიკით და ვაკვირდებით ხელმისაწვდომობის სტანდარტებს (მათ შორის WCAG პრინციპებს).",
        ],
        list: [
          "კონტენტის მკაფიო სტრუქტურა და სათაურების ლოგიკური იერარქია",
          "კონტრასტის, ტექსტის წაკითხვადობის და ინტერფეისის სიცხადის გაუმჯობესება",
          "კლავიატურით ნავიგაციის მხარდაჭერის გაუმჯობესება",
          "ფორმების და ღილაკების ეტიკეტების მაქსიმალურად გასაგებად წარმოდგენა",
          "რეგულარული მონიტორინგი და ეტაპობრივი გაუმჯობესება",
        ],
      },
      {
        heading: "მესამე მხარის კომპონენტები",
        paragraphs: [
          "საიტის გარკვეული ნაწილები შეიძლება მოიცავდეს მესამე მხარის სერვისებს ან ბმულებს. მიუხედავად იმისა, რომ ვირჩევთ სანდო პარტნიორებს, მათ ხელმისაწვდომობაზე სრული კონტროლი ყოველთვის ჩვენს მხარეს არ არის.",
          "ასეთ შემთხვევებშიც ვცდილობთ, მომხმარებლისთვის შევთავაზოთ ყველაზე კომფორტული და გასაგები გამოცდილება.",
        ],
      },
      {
        heading: "უკუკავშირი და დახმარება",
        paragraphs: [
          "თუ საიტზე შეამჩნიეთ ხელმისაწვდომობასთან დაკავშირებული ბარიერი ან გჭირდებათ კონკრეტული დახმარება, დაგვიკავშირდით და ვეცდებით გონივრულ ვადაში რეაგირებას.",
          "შეგიძლიათ მოგვწეროთ რა გვერდზე ან პროცესში შეგექმნათ სირთულე, რათა სწრაფად გამოვასწოროთ.",
        ],
        list: ["ელფოსტა: support@aylopet.com", "ტელეფონი: +995595885625"],
      },
    ],
  },
};

const LEGAL_EN: LegalContent = {
  backLabel: "Home",
  lastUpdatedLabel: "Last updated",
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "February 27, 2026",
    sections: [
      {
        paragraphs: [
          "This privacy notice for Aylopet LLC describes how and why we might access, collect, store, use, and/or share your personal information when you use our services.",
          "Contact us: support@aylopet.com, or by mail · David Aghmashenebeli Avenue, No. 200, Samtredia, Georgia.",
          "If you do not agree with our policies and practices, please do not use our services.",
        ],
        list: [
          "You visit our website at aylopet.com, or any other pages that link to this notice.",
          "You use our personalized fresh dog food subscriptions and retail store, AI nutrition architect, smart GPS hardware, health reminders, and partner loyalty program.",
          "You engage with us in other related ways, including marketing or events.",
        ],
      },
      {
        heading: "The Aylopet Ecosystem",
        paragraphs: [
          "Aylopet provides an integrated ecosystem for pet wellbeing, which includes:",
        ],
        list: [
          "Food: pasteurized raw dog food retail sales and recurring subscriptions.",
          "Hardware & technology: Aylopet Pro · a smart GPS collar with location and physical activity monitoring.",
          "AI services: an interactive AI nutrition architect and health reminders.",
          "Retail & partners: discounts with third-party partners.",
          "Data integration: syncing physical activity data to tailor portions and insights.",
        ],
      },
      {
        heading: "Summary of Key Points",
        list: [
          "We may process personal information depending on how you interact with us and the services, the choices you make, and the products and features you use.",
          "We may process sensitive personal information only with your consent or as otherwise permitted by applicable law.",
          "We do not collect data directly from third parties, except for profile information received when you sign in via social login.",
          "We process information for providing and improving our services, security, fraud prevention, and legal compliance.",
          "Information may be shared only in specific situations and with the relevant categories of third parties.",
          "We have organizational and technical measures in place to protect your information.",
        ],
      },
      {
        heading: "Your Rights",
        paragraphs: ["Under applicable Georgian law, you have the right to:"],
        list: [
          "Receive information about the types of data, means, and duration of processing.",
          "Request correction, updating, or completion of inaccurate, incorrect, or incomplete data.",
          "Request that processing be stopped, or that data be deleted or destroyed, including profiling.",
          "Request that your data be blocked.",
          "Withdraw your consent at any time, without needing to provide a reason.",
        ],
      },
      {
        heading: "Why We Process Your Personal Data",
        list: [
          "To deliver targeted advertising and personalized content.",
          "To protect our services, ensure security, and monitor and prevent fraud.",
          "To evaluate and improve our services, products, and marketing.",
          "To identify usage trends.",
          "To comply with legal obligations and protect our rights.",
          "To monitor pets' health and provide AI nutrition recommendations.",
        ],
      },
      {
        heading: "Social Logins",
        paragraphs: [
          "If you choose to register or log in using a social media account, we may receive certain profile information (e.g. name, email, profile picture, and other details).",
          "We use this information only for the purposes described in this privacy notice. We do not control how third-party platforms use your information.",
        ],
      },
      {
        heading: "How Long We Keep Your Information",
        paragraphs: [
          "We keep your information for as long as necessary to fulfill the purposes outlined in this notice, unless a longer retention period is required or permitted by law.",
          "When there is no ongoing legitimate business need to process your information, we will delete or anonymize it.",
          "If deletion is not possible (for example, information stored in backup archives), we securely store the information and isolate it from further processing until deletion becomes possible.",
        ],
      },
      {
        heading: "Minors",
        paragraphs: [
          "We do not knowingly collect data from, or market to, individuals under the age of 18.",
          "If we learn that data has been collected from a person under 18, we will deactivate the account and delete the data within a reasonable timeframe.",
        ],
      },
      {
        heading: "Contact Us",
        paragraphs: [
          "For privacy-related questions or to exercise your rights, contact us at: support@aylopet.com.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Use",
    lastUpdated: "February 27, 2026",
    sections: [
      {
        heading: "Agreement to Our Legal Terms",
        paragraphs: [
          "We (\"Company\", \"we\", \"our\") operate and provide services that refer or link to these legal terms (\"Legal Terms\") (collectively, the \"Services\"). You can contact us by email at support@aylopet.com or by mail at: David Aghmashenebeli Avenue, No. 200, Samtredia, Georgia.",
          "These Legal Terms constitute a legally binding agreement between you (personally or on behalf of an entity · \"you\") and us regarding your access to and use of the Services. By accessing the Services, you confirm that you have read, understood, and agree to be bound by all of these Legal Terms. If you do not agree with all of these Legal Terms, you are expressly prohibited from using the Services and must discontinue use immediately.",
          "Any supplemental terms or documents that may be posted on the Services from time to time are expressly incorporated by reference. We reserve the right, at our sole discretion, to make changes or modifications to these Legal Terms at any time and for any reason. We will alert you of any changes by sending an official notice to the email you provided when creating your account. You retain the right to unilaterally terminate our agreement if the changes and/or modifications are unacceptable to you.",
        ],
      },
      {
        heading: "1. Our Services",
        paragraphs: [
          "The information provided when using the Services is not intended for distribution to, or use by, any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation, or which would subject us to any registration requirement within such jurisdiction or country.",
          "Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, to the extent local laws are applicable.",
        ],
      },
      {
        heading: "2. Intellectual Property Rights",
        paragraphs: [
          "Our intellectual property: We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the \"Content\"), as well as the trademarks, service marks, and logos contained therein (the \"Marks\").",
          "Your submissions: By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services, you agree to assign to us all intellectual property rights in such material, unless otherwise governed by Georgian law.",
          "By submitting material through any part of the Services, you:",
        ],
        list: [
          "Confirm that you have read and agree to our \"Prohibited Activities\" and will not post unlawful, offensive, threatening, false, or misleading material.",
          "Waive, to the extent permitted by applicable law, any moral rights in such material.",
          "Warrant that the material is either yours or you have the necessary rights and licenses to submit it.",
          "Confirm that the material you submit is not confidential information.",
          "Are solely responsible for your submissions and agree to indemnify us for any breach.",
        ],
      },
      {
        heading: "3. User Representations",
        paragraphs: [
          "By using the Services, you represent and warrant that: (1) you have the legal capacity and agree to comply with these Legal Terms; (2) you are not a minor in the jurisdiction in which you reside; (3) you will not access the Services through automated or non-human means; (4) you will not use the Services for any unlawful or unauthorized purpose; and (5) your use of the Services will not violate any applicable law or regulation.",
        ],
      },
      {
        heading: "4. Prohibited Activities",
        paragraphs: [
          "You may not use the Services for any purpose other than that for which we make them available. As a user, you agree not to:",
        ],
        list: [
          "Systematically retrieve data from the Services without our written permission.",
          "Trick, defraud, or mislead us or other users, including in an attempt to obtain passwords.",
          "Circumvent, disable, or otherwise interfere with security-related features.",
          "Use the Services to harass, abuse, or harm another person.",
          "Upload or transmit viruses, Trojan horses, spam, or other harmful material.",
          "Use any script, bot, robot, scraper, or other automated means to access the Services.",
          "Delete the copyright or other proprietary rights notice from any Content.",
          "Attempt to impersonate another user.",
          "Overload, flood, or otherwise interfere with the proper functioning of the Services.",
          "Use the Services in a manner inconsistent with applicable laws or to compete with us in an unauthorized commercial manner.",
        ],
      },
      {
        heading: "5. User Generated Contributions",
        paragraphs: [
          "The Services may invite you to create, submit, post, or distribute content and materials (collectively, \"Contributions\"). Whenever you create or make available a Contribution, you represent and warrant that it conforms to these Legal Terms.",
        ],
      },
      {
        heading: "6. Contribution License",
        paragraphs: [
          "You and the Services agree that we may access, store, process, and use any information and personal data that you provide, including settings preferences. By sending us feedback, you agree that we can use it for any purpose without compensation to you.",
          "We do not assert any ownership over your Contributions. You retain full ownership of all your Contributions and any related intellectual property rights.",
        ],
      },
      {
        heading: "7. Services Management",
        paragraphs: [
          "We reserve the right, but not the obligation, to monitor the Services for violations, take appropriate legal action, restrict access, remove excessively large files, and otherwise manage the Services to protect our rights and to ensure their proper functioning.",
        ],
      },
      {
        heading: "8. Term and Termination",
        paragraphs: [
          "These Legal Terms remain in effect while you use the Services. We reserve the right, without notice, to deny access to and use of the Services for any legally valid reason, including breach of these Legal Terms or applicable law.",
          "If we terminate or suspend your account, you are prohibited from creating a new account under your name or that of a third party. We reserve the right to take appropriate legal action.",
        ],
      },
      {
        heading: "9. Modifications and Interruptions",
        paragraphs: [
          "We reserve the right to change, remove, or update the content of the Services at any time without notice. We will not be liable to you for any loss resulting from any modification, suspension, or discontinuation of the Services.",
          "We cannot guarantee the Services will be available at all times. Maintenance, interruptions, and errors may occur.",
        ],
      },
      {
        heading: "10. Governing Law",
        paragraphs: ["These Legal Terms are governed by and construed in accordance with the laws of Georgia."],
      },
      {
        heading: "11. Dispute Resolution",
        paragraphs: [
          "Informal negotiations: Before initiating litigation, the parties will attempt to reach an informal resolution for at least 30 days.",
          "Binding proceedings: Any dispute will ultimately be resolved in the competent courts of Georgia, in accordance with Georgian procedural law.",
        ],
      },
      {
        heading: "12. Corrections",
        paragraphs: [
          "There may be typographical errors, inaccuracies, or omissions in the Services. We reserve the right to correct any errors and update the information at any time without prior notice.",
        ],
      },
      {
        heading: "13. Disclaimer",
        paragraphs: [
          "The Services are provided on an \"as-is\" and \"as-available\" basis. Your use of the Services is at your sole risk.",
          "To the fullest extent permitted by Georgian law, we disclaim all warranties, express or implied, in connection with the Services.",
          "We assume no liability for errors, interruptions, unauthorized access, viruses transmitted by third parties, or transactions with third-party services.",
        ],
      },
      {
        heading: "14. User Data",
        paragraphs: [
          "We maintain certain data for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular backups, you are solely responsible for the data you transmit and your activity on the Services.",
        ],
      },
      {
        heading: "15. Electronic Communications, Transactions, and Signatures",
        paragraphs: [
          "Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receiving electronic communications and to the use of electronic signatures, records, and notices.",
        ],
      },
      {
        heading: "16. Miscellaneous",
        paragraphs: [
          "These Legal Terms and any related policies constitute the entire agreement between you and us. Our failure to exercise or enforce any right shall not operate as a waiver of that right. If any provision is found unlawful, void, or unenforceable, the remaining provisions remain in full force and effect. No joint venture, employment, or agency relationship is created between you and us.",
        ],
      },
      {
        heading: "17. Important Notice Before Deleting Your Account",
        paragraphs: [
          "To avoid unintended charges or loss of service functionality, before deleting your account you must manually cancel:",
        ],
        list: [
          "Food Subscriptions · recurring orders and automatic billing.",
          "AI nutrition expert access · the AI chat subscription.",
          "Smart GPS services · active tracking/data plans for Aylopet Pro.",
          "Aylopet is not responsible for ongoing charges if a user does not cancel individual services before deleting their profile.",
        ],
      },
      {
        heading: "18. Contact Us",
        paragraphs: [
          "For complaints or further information about the Services, contact us at: support@aylopet.com.",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    lastUpdated: "February 27, 2026",
    sections: [
      {
        paragraphs: [
          "This Cookie Policy explains how Aylopet LLC (\"Company\", \"we\", \"us\", \"our\") uses cookies and similar technologies to recognize you when you visit our website at https://aylopet.com. It explains what these technologies are and why we use them, as well as your rights to control our use of them.",
          "In some cases we may use cookies to collect personal information, or information that becomes personal information if combined with other data.",
        ],
      },
      {
        heading: "What Are Cookies?",
        paragraphs: [
          "Cookies are small data files placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.",
          "Cookies set by the website owner (in this case, Aylopet LLC) are called \"first-party cookies\". Cookies set by parties other than the website owner are called \"third-party cookies\". Third-party cookies enable third-party features or functionality on or through the website (e.g. advertising, interactive content, and analytics).",
        ],
      },
      {
        heading: "How Can I Control Cookies?",
        paragraphs: [
          "You have the right to decide whether to accept or reject cookies. You can exercise this right by setting your preferences in the Cookie Preference Center. The Cookie Preference Center allows you to select which categories of cookies you accept or reject. Strictly necessary cookies cannot be rejected, as they are essential to providing the service.",
          "The Cookie Preference Center is available in our cookie notice banner and on our website. If you choose to reject non-essential cookies, you will still be able to use our website, though your access to some functionality and areas may be restricted. You may also set or amend your browser controls to accept or refuse cookies.",
        ],
      },
      {
        heading: "How Can I Control Cookies in My Browser?",
        paragraphs: [
          "As the means by which you can refuse cookies through your browser controls vary from browser to browser, visit your browser's help menu for more information.",
          "In addition, most advertising networks offer you a way to opt out of targeted advertising. For more information, visit:",
        ],
        list: [
          "Digital Advertising Alliance",
          "Digital Advertising Alliance of Canada",
          "European Interactive Digital Advertising Alliance",
        ],
      },
      {
        heading: "What About Other Tracking Technologies?",
        paragraphs: [
          "Cookies are not the only way to recognize or track visitors to a website. We may use other, similar technologies from time to time, such as web beacons (sometimes called \"tracking pixels\" or \"clear gifs\"). These are tiny graphics files that contain a unique identifier that lets us recognize when someone has visited our website or opened an email that we sent them.",
        ],
      },
      {
        heading: "Do You Use Flash Cookies or Local Shared Objects?",
        paragraphs: [
          "Websites may also use so-called \"Flash Cookies\" (also known as Local Shared Objects or \"LSOs\") for various purposes, including to collect information about the use of our services, to prevent fraud, and for other site operations.",
          "If you do not want Flash Cookies stored on your device, you can adjust the settings of your Flash Player to block Flash Cookies storage (via the Website Storage Settings Panel / Global Storage Settings Panel).",
        ],
      },
      {
        heading: "Do You Use Targeted Advertising?",
        paragraphs: [
          "Third parties may place cookies on your computer or mobile device via our website to display advertising. These companies may use information about your visits to this and other websites to provide relevant advertisements about goods and services that may interest you.",
          "This information, by itself, does not typically allow us to identify your name, contact details, or other directly identifying information unless you choose to provide these details to us.",
        ],
      },
      {
        heading: "How Often Will This Cookie Policy Be Updated?",
        paragraphs: [
          "We may update this policy from time to time in order to reflect changes to the cookies we use, or for other operational, legal, or regulatory reasons. Please revisit this page regularly to stay informed about our use of cookies.",
          "The date at the top of this page indicates when it was last updated.",
        ],
      },
      {
        heading: "Where Can I Get More Information?",
        paragraphs: [
          "If you have any questions about our use of cookies or other technologies, contact us:",
          "Aylopet LLC, Georgia",
          "Phone: +995595885625",
        ],
      },
    ],
  },
  accessibility: {
    title: "Accessibility Statement",
    lastUpdated: "February 27, 2026",
    sections: [
      {
        heading: "Our Commitment",
        paragraphs: [
          "Aylopet strives to make its website as accessible as possible to everyone, including users with disabilities.",
          "We continuously improve our design and functionality to make the site easier, clearer, and more comfortable to use.",
        ],
      },
      {
        heading: "How We Approach Accessibility",
        paragraphs: [
          "We follow international best practices and observe accessibility standards, including WCAG principles.",
        ],
        list: [
          "Clear content structure and logical heading hierarchy",
          "Improved contrast, text readability, and interface clarity",
          "Improved support for keyboard navigation",
          "Making form and button labels as clear as possible",
          "Regular monitoring and ongoing improvements",
        ],
      },
      {
        heading: "Third-Party Components",
        paragraphs: [
          "Certain parts of the site may include third-party services or links. While we choose trusted partners, we do not always have full control over their accessibility.",
          "Even in these cases, we try to offer users the most comfortable and understandable experience possible.",
        ],
      },
      {
        heading: "Feedback and Assistance",
        paragraphs: [
          "If you notice an accessibility barrier on the site or need specific assistance, contact us and we will do our best to respond within a reasonable timeframe.",
          "Feel free to let us know which page or process gave you difficulty, so we can fix it quickly.",
        ],
        list: ["Email: support@aylopet.com", "Phone: +995595885625"],
      },
    ],
  },
};

export function getLegalContent(locale: "ka" | "en"): LegalContent {
  return locale === "ka" ? LEGAL_KA : LEGAL_EN;
}
