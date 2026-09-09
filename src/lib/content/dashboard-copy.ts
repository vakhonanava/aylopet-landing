/**
 * Dashboard copy · same _KA/_EN + getter pattern as the other content modules
 * (`getAuthCopy`, `getFaqContent`, `getDnaCopy`).
 *
 * The dashboard shipped Georgian-only with the strings inlined in JSX, so the
 * language toggle in the header had no effect once you signed in. Keeping the
 * dictionary typed means a mistyped key is a compile error rather than a blank
 * label at runtime.
 */

export interface DashboardCopy {
  common: {
    save: string;
    saved: string;
    saving: string;
    cancel: string;
    add: string;
    edit: string;
    remove: string;
    update: string;
    close: string;
    loading: string;
    upload: string;
    view: string;
    noEntries: string;
    backToDashboard: string;
    other: string;
    optional: string;
    /** Generic "this field can't be empty" message. */
    required: string;
    search: string;
    noResults: string;
    removeChip: string;
    sectionLabel: string;
    petNotFound: string;
    supabaseMissing: string;
    defaultUserName: string;
  };
  toast: {
    saved: string;
    saveFailed: string;
    deleted: string;
    deleteFailed: string;
    uploaded: string;
    uploadFailed: string;
  };
  nav: {
    home: string;
    myDogs: string;
    addDog: string;
    addDogAria: string;
    settings: string;
    signOut: string;
  };
  home: {
    greeting: string;
    introLead: string;
    introEditHint: string;
    introOpenHint: string;
    addDogTitle: string;
    addDogPrice: string;
    addDogLockedMax: string;
    addDogLockedPayment: string;
    emptyState: string;
  };
  pet: {
    notFound: string;
    backLink: string;
    editAria: string;
    editTitle: string;
    name: string;
    breed: string;
    breedPlaceholder: string;
    weightKg: string;
    activity: string;
    activityType: string;
    photoUpload: string;
    photoZoomAria: string;
    photoAlt: string;
    unsavedChanges: string;
    changesSaved: string;
    missingFields: string;
    historyTitle: string;
    historySavedOn: string;
    compare: string;
    restore: string;
    fieldColumn: string;
    beforeColumn: string;
    afterColumn: string;
  };
  logbook: {
    title: string;
    tabVaccines: string;
    tabSupplements: string;
    tabFood: string;
    tabMood: string;
    vaccinesSubtitle: string;
    vaccineType: string;
    vaccineName: string;
    vaccineNamePlaceholder: string;
    administeredOn: string;
    nextDue: string;
    administeredLabel: string;
    vaccineSaveFailed: string;
    vaccineNameRequired: string;
    vaccineDateRequired: string;
    supplementsSubtitle: string;
    supplementName: string;
    supplementNamePlaceholder: string;
    supplementDose: string;
    supplementDosePlaceholder: string;
    supplementRequired: string;
    foodSubtitle: string;
    mealType: string;
    morning: string;
    evening: string;
    portionGrams: string;
    portionRequired: string;
    portionInvalid: string;
    brand: string;
    brandPlaceholder: string;
    appetite: string;
    digestion: string;
    digestionPlaceholder: string;
    moodSubtitle: string;
    checkInTitle: string;
    checkInQuestion: string;
    saveCheckIn: string;
    supplementFrequency: string;
    supplementFrequencyPlaceholder: string;
    supplementDoseHint: string;
    givenToday: string;
    givenTodayQuestion: string;
    morningMeal: string;
    eveningMeal: string;
    digestionLabel: string;
    moodLabel: string;
    energyLabel: string;
    energy: string;
    notes: string;
    notesPlaceholder: string;
    overdue: string;
    dueSoon: string;
    nextLabel: string;
    gramsShort: string;
  };
  medical: {
    title: string;
    vaccinesHint: string;
    vaccinesHintLink: string;
    tabSymptoms: string;
    tabRecord: string;
    tabMedications: string;
    tabExport: string;
    symptomsHint: string;
    symptom: string;
    symptomPlaceholder: string;
    severity: string;
    showDetails: string;
    hideDetails: string;
    note: string;
    notePlaceholder: string;
    attachment: string;
    attachmentFile: string;
    viewFile: string;
    removeFile: string;
    removeSymptom: string;
    symptomRequired: string;
    severityRequired: string;
    symptomSaveFailed: string;
    chronicConditions: string;
    allergies: string;
    geneticRisks: string;
    surgeries: string;
    surgeriesPlaceholder: string;
    chipHint: string;
    allergiesPlaceholder: string;
    medicationsSubtitle: string;
    medicationName: string;
    medicationDose: string;
    medicationFrequency: string;
    medicationNameRequired: string;
    medicationActive: string;
    medicationPaused: string;
    medicationSaveFailed: string;
    updateFailed: string;
    exportHint: string;
    exportView: string;
    exportCopyLink: string;
    exportCopied: string;
    exportLinkFailed: string;
  };
  labs: {
    title: string;
    description: string;
    uploadCta: string;
    dropzone: string;
    dropzoneHint: string;
    analyzing: string;
    uploadedCount: string;
    uploadedOk: string;
    viewAria: string;
    deleteAria: string;
    privacyNote: string;
    invalidType: string;
    tooLarge: string;
    uploadFailed: string;
    deleteFailed: string;
  };
  settings: {
    title: string;
    subtitle: string;
    passwordUpdated: string;
    accountSection: string;
    passwordSection: string;
    passwordSectionHint: string;
  };
  onboarding: {
    stepAccount: string;
    stepDog: string;
    accountTitle: string;
    accountSubtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    continue: string;
    back: string;
    dogTitleNew: string;
    dogTitleFirst: string;
    dogSubtitle: string;
    dogNameLabel: string;
    dogNamePlaceholder: string;
    submitAdd: string;
    submitFinish: string;
    pageTitleNew: string;
    pageTitleRegister: string;
    pageHeadingNew: string;
    pageHeadingWelcome: string;
    pageSubtitleNew: string;
    pageSubtitleWelcome: string;
    alreadySignedIn: string;
    lockedMax: string;
    lockedPayment: string;
    supabaseMissing: string;
    petCreateFailed: string;
    errors: {
      dogName: string;
      breed: string;
      weight: string;
      weightPositive: string;
      weightMax: string;
      activity: string;
      name: string;
      email: string;
      password: string;
    };
  };
}

export const DASHBOARD_KA: DashboardCopy = {
  common: {
    save: "შენახვა",
    saved: "შენახულია",
    saving: "ინახება…",
    cancel: "გაუქმება",
    add: "დამატება",
    edit: "რედაქტირება",
    remove: "წაშლა",
    update: "განახლება",
    close: "დახურვა",
    loading: "იტვირთება…",
    upload: "ატვირთვა",
    view: "ნახვა",
    noEntries: "ჯერ არ არის ჩანაწერი.",
    backToDashboard: "დაბრუნება პანელზე",
    other: "სხვა",
    optional: "არასავალდებულო",
    required: "ეს ველი სავალდებულოა.",
    search: "ძებნა...",
    noResults: "ვერ მოიძებნა",
    removeChip: "წაშლა",
    sectionLabel: "სექცია",
    petNotFound: "ძაღლი ვერ მოიძებნა.",
    supabaseMissing: "Supabase არ არის კონფიგურირებული.",
    defaultUserName: "მომხმარებელი",
  },
  toast: {
    saved: "ცვლილებები შენახულია.",
    saveFailed: "შენახვა ვერ მოხერხდა.",
    deleted: "ჩანაწერი წაიშალა.",
    deleteFailed: "წაშლა ვერ მოხერხდა.",
    uploaded: "ფაილი აიტვირთა.",
    uploadFailed: "ატვირთვა ვერ მოხერხდა.",
  },
  nav: {
    home: "მთავარი",
    myDogs: "ჩემი ძაღლები",
    addDog: "ახალი ძაღლი",
    addDogAria: "ახალი ძაღლის დამატება",
    settings: "პარამეტრები",
    signOut: "გასვლა",
  },
  home: {
    greeting: "მოგესალმებით",
    introLead:
      "მართე შენი ძაღლების პროფილები, ჯანმრთელობა და კვება ერთ სივრცეში.",
    introEditHint: "სახელის, ჯიშის, წონისა და აქტივობის შესაცვლელად დააჭირე",
    introOpenHint:
      "ხატულას, ხოლო ანალიზების ატვირთვისა და სრული ისტორიისთვის გახსენი ძაღლის ბარათი.",
    addDogTitle: "ახალი ძაღლის დამატება",
    addDogPrice: "დაამატე კიდევ ერთი ოჯახის წევრი",
    addDogLockedMax:
      "ამჟამად ერთ ანგარიშზე მაქსიმუმ ორი პროფილია ხელმისაწვდომი.",
    addDogLockedPayment:
      "მეორე ძაღლის დამატება ({price} ₾) იხსნება პირველი პროფილის გადახდის შემდეგ.",
    emptyState: "ჯერ არ გყავს დამატებული ძაღლი.",
  },
  pet: {
    notFound: "ეს ძაღლი ვერ მოიძებნა.",
    backLink: "პანელი",
    editAria: "ინფორმაციის რედაქტირება",
    editTitle: "ინფორმაციის რედაქტირება",
    name: "სახელი",
    breed: "ჯიში",
    breedPlaceholder: "აირჩიე ჯიში",
    weightKg: "წონა (კგ)",
    activity: "ფიზიკური აქტივობა",
    activityType: "ფიზიკური აქტივობის ტიპი",
    photoUpload: "ფოტოს ატვირთვა",
    photoZoomAria: "ფოტოს გადიდება",
    photoAlt: "ძაღლის ფოტო",
    unsavedChanges: "შეუნახავი ცვლილებები",
    changesSaved: "ცვლილებები შენახულია.",
    missingFields: "შეავსე სახელი, ჯიში და წონა.",
    historyTitle: "წინა მონაცემები",
    historySavedOn: "შენახულია",
    compare: "შედარება",
    restore: "აღდგენა",
    fieldColumn: "ველი",
    beforeColumn: "წინა",
    afterColumn: "ამჟამინდელი",
  },
  logbook: {
    title: "ჯანმრთელობა & კეთილდღეობა",
    tabVaccines: "ვაქცინები & პრევენცია",
    tabSupplements: "დანამატები",
    tabFood: "საკვები",
    tabMood: "ხასიათი",
    vaccinesSubtitle:
      "ვაქცინაციისა და პარაზიტების საწინააღმდეგო დამუშავების ისტორია",
    vaccineType: "ტიპი",
    vaccineName: "სახელი",
    vaccineNamePlaceholder: "მაგ. ცოფის ვაქცინა",
    administeredOn: "ჩატარების თარიღი",
    nextDue: "შემდეგი თარიღი",
    administeredLabel: "ჩატარდა",
    vaccineSaveFailed: "ვაქცინა ვერ შეინახა.",
    vaccineNameRequired: "მიუთითე დასახელება.",
    vaccineDateRequired: "მიუთითე ჩატარების თარიღი.",
    supplementsSubtitle: "ყოველდღიური დანამატების ჩეკლისტი",
    supplementName: "დასახელება",
    supplementNamePlaceholder: "დანამატის სახელი",
    supplementDose: "დოზა",
    supplementDosePlaceholder: "მაგ. 1 კაფსულა",
    supplementRequired: "მიუთითე დასახელება და დოზა.",
    foodSubtitle: "კვების ჩანაწერები",
    mealType: "კვების ტიპი",
    morning: "დილა",
    evening: "საღამო",
    portionGrams: "პორცია (გრამი)",
    portionRequired: "მიუთითე პორცია გრამებში.",
    portionInvalid: "პორცია უნდა იყოს 0-ზე მეტი რიცხვი.",
    brand: "ბრენდი",
    brandPlaceholder: "ბრენდის სახელი",
    appetite: "მადა",
    digestion: "საჭმლის მონელება",
    digestionPlaceholder: "მაგ. ნორმალური განავალი, კუჭის აშლილობა...",
    moodSubtitle: "ხასიათისა და აქტივობის ყოველდღიური ჩანაწერი",
    checkInTitle: "დღევანდელი ჩანაწერი",
    checkInQuestion: "როგორ გრძნობს თავს {name}?",
    saveCheckIn: "ჩანაწერის შენახვა",
    supplementFrequency: "სიხშირე",
    supplementFrequencyPlaceholder: "სიხშირე",
    supplementDoseHint: "დოზა (მაგ. 1 აბი, 5ml)",
    givenToday: "მიცემულია",
    givenTodayQuestion: "დღეს?",
    morningMeal: "დილის კვება",
    eveningMeal: "საღამოს კვება",
    digestionLabel: "მონელება:",
    moodLabel: "განწყობა",
    energyLabel: "ენერგიის დონე",
    energy: "ენერგია",
    notes: "შენიშვნები",
    notesPlaceholder: "მაგ. დღეს უჩვეულოდ ლეთარგიული იყო",
    overdue: "ვადაგადაცილებული",
    dueSoon: "მალე ({days} დღე)",
    nextLabel: "შემდეგი",
    gramsShort: "გ",
  },
  medical: {
    title: "სამედიცინო მონაცემები",
    vaccinesHint: "ვაქცინები და პრევენციული მოვლა ხელმისაწვდომია",
    vaccinesHintLink: "ზემოთ „ვაქცინები & პრევენცია“ ჩანართში",
    tabSymptoms: "სიმპტომები",
    tabRecord: "სამედიცინო ბარათი",
    tabMedications: "მედიკამენტები",
    tabExport: "ექსპორტი ვეტისთვის",
    symptomsHint:
      "აირჩიე სიმპტომი და სიმძიმის დონე. დანარჩენი ავტომატურად ჩაიწერება.",
    symptom: "სიმპტომი",
    symptomPlaceholder: "აღწერე სიმპტომი",
    severity: "სიმძიმე",
    showDetails: "დეტალების დამატება",
    hideDetails: "დეტალების დამალვა",
    note: "შენიშვნა",
    notePlaceholder: "დეტალები: რამ გამოიწვია, რა ჭამა...",
    attachment: "ფოტო/ვიდეო",
    attachmentFile: "ფაილი",
    viewFile: "ფაილის ნახვა",
    removeFile: "ფაილის წაშლა",
    removeSymptom: "სიმპტომის წაშლა",
    symptomRequired: "აირჩიე სიმპტომი.",
    severityRequired: "აირჩიე სიმძიმის დონე.",
    symptomSaveFailed: "სიმპტომი ვერ შეინახა.",
    chronicConditions: "ქრონიკული დაავადებები",
    allergies: "ალერგიები",
    geneticRisks: "გენეტიკური / ჯიშობრივი რისკები",
    surgeries: "ოპერაციები / ტრავმები",
    surgeriesPlaceholder: "აღწერე წარსული ოპერაციები ან ტრავმები",
    chipHint: "დაწერე და დააჭირე Enter-ს",
    allergiesPlaceholder: "საკვები / მედიკამენტოზური ალერგიები",
    medicationsSubtitle: "მიმდინარე მედიკამენტები და დანამატები",
    medicationName: "მედიკამენტის სახელი",
    medicationDose: "დოზა",
    medicationFrequency: "სიხშირე",
    medicationNameRequired: "მიუთითე მედიკამენტის სახელი.",
    medicationActive: "აქტიური",
    medicationPaused: "შეჩერებული",
    medicationSaveFailed: "მედიკამენტი ვერ შეინახა.",
    updateFailed: "ვერ განახლდა.",
    exportHint:
      "გადაეცი სრული ჯანმრთელობის რეპორტი ვეტერინარს ბეჭდვით ან ბმულის გაზიარებით.",
    exportView: "რეპორტის ნახვა / ბეჭდვა",
    exportCopyLink: "ბმულის კოპირება",
    exportCopied: "დაკოპირდა!",
    exportLinkFailed: "ბმული ვერ შეიქმნა.",
  },
  labs: {
    title: "ანალიზების გაზიარება",
    description:
      "ატვირთე სისხლის ანალიზი, ვეტერინარის ჩანაწერი ან დიაგნოსტიკური დოკუმენტი. AylopetAI მონაცემებს პრევენციული ინსაითებისთვის დაამუშავებს.",
    uploadCta: "ანალიზის ატვირთვა",
    dropzone: "ჩააგდე ფაილები აქ ან დააჭირე ასარჩევად",
    dropzoneHint: "PDF, JPEG ან PNG, მაქსიმუმ 10MB თითო ფაილზე",
    analyzing: "ანალიზდება",
    uploadedCount: "ატვირთული ანალიზები",
    uploadedOk: "წარმატებით აიტვირთა",
    viewAria: "ნახვა",
    deleteAria: "წაშლა",
    privacyNote:
      "თქვენი მონაცემები დაცულია. ანალიზები გამოიყენება ექსკლუზიურად AylopetAI-ის მიერ დაავადებების პრევენციისა და ინდივიდუალური ველნეს გეგმის შესადგენად.",
    invalidType: "დასაშვებია მხოლოდ PDF, JPEG ან PNG.",
    tooLarge: "ფაილის მაქსიმალური ზომაა 10MB.",
    uploadFailed: "ატვირთვა ვერ მოხერხდა. შეამოწმე კავშირი და სცადე თავიდან.",
    deleteFailed: "ფაილის წაშლა ვერ მოხერხდა. სცადე თავიდან.",
  },
  settings: {
    title: "პარამეტრები",
    subtitle: "მართე ანგარიშის უსაფრთხოება და პაროლი.",
    passwordUpdated: "პაროლი წარმატებით განახლდა.",
    accountSection: "ანგარიში",
    passwordSection: "პაროლის შეცვლა",
    passwordSectionHint: "შეიყვანე მიმდინარე პაროლი და აირჩიე ახალი.",
  },
  onboarding: {
    stepAccount: "ანგარიში",
    stepDog: "შენი ძაღლი",
    accountTitle: "შექმენი ანგარიში",
    accountSubtitle: "დაიწყე Aylopet-ის მოგზაურობა.",
    nameLabel: "სახელი",
    namePlaceholder: "შენი სახელი",
    emailLabel: "ელ. ფოსტა",
    passwordLabel: "პაროლი",
    passwordPlaceholder: "მინიმუმ 8 სიმბოლო",
    continue: "გაგრძელება",
    back: "უკან",
    dogTitleNew: "ახალი ძაღლის პროფილი",
    dogTitleFirst: "დაამატე შენი ძაღლი",
    dogSubtitle: "ეს დაგვეხმარება პერსონალური რეკომენდაციების შექმნაში.",
    dogNameLabel: "ძაღლის სახელი",
    dogNamePlaceholder: "მაგ. რექსი",
    submitAdd: "ძაღლის დამატება",
    submitFinish: "დასრულება და პროფილზე გადასვლა",
    pageTitleNew: "ახალი ძაღლი",
    pageTitleRegister: "რეგისტრაცია",
    pageHeadingNew: "დაამატე შინაური ცხოველი",
    pageHeadingWelcome: "მოგესალმებით Aylopet-ში",
    pageSubtitleNew:
      "რამდენიმე ველი საკმარისია პერსონალური კვებისა და ჯანმრთელობის რჩევებისთვის.",
    pageSubtitleWelcome:
      "რამდენიმე ნაბიჯი გვაშორებს შენი მეგობრის პერსონალური პროფილის შექმნამდე.",
    alreadySignedIn: "უკვე შესული ხარ. ანგარიშის შექმნა არ სჭირდება.",
    lockedMax: "ამჟამად ერთ ანგარიშზე მაქსიმუმ ორი პროფილია ხელმისაწვდომი.",
    lockedPayment:
      "მეორე ძაღლის დამატება ({price} ₾) იხსნება პირველი პროფილის გადახდის შემდეგ.",
    supabaseMissing: "Supabase არ არის კონფიგურირებული.",
    petCreateFailed: "ცხოველის პროფილი ვერ შეიქმნა.",
    errors: {
      dogName: "მიუთითე ძაღლის სახელი",
      breed: "აირჩიე ჯიში",
      weight: "მიუთითე წონა",
      weightPositive: "წონა უნდა იყოს დადებითი",
      weightMax: "შეამოწმე წონა",
      activity: "აირჩიე აქტივობის ტიპი",
      name: "მიუთითე სახელი",
      email: "არასწორი ელ. ფოსტა",
      password: "მინიმუმ 8 სიმბოლო",
    },
  },
};

export const DASHBOARD_EN: DashboardCopy = {
  common: {
    save: "Save",
    saved: "Saved",
    saving: "Saving…",
    cancel: "Cancel",
    add: "Add",
    edit: "Edit",
    remove: "Delete",
    update: "Update",
    close: "Close",
    loading: "Loading…",
    upload: "Upload",
    view: "View",
    noEntries: "No entries yet.",
    backToDashboard: "Back to dashboard",
    other: "Other",
    optional: "optional",
    required: "This field is required.",
    search: "Search…",
    noResults: "No matches",
    removeChip: "remove",
    sectionLabel: "Section",
    petNotFound: "Dog not found.",
    supabaseMissing: "Supabase is not configured.",
    defaultUserName: "User",
  },
  toast: {
    saved: "Changes saved.",
    saveFailed: "Could not save.",
    deleted: "Entry deleted.",
    deleteFailed: "Could not delete.",
    uploaded: "File uploaded.",
    uploadFailed: "Upload failed.",
  },
  nav: {
    home: "Overview",
    myDogs: "My dogs",
    addDog: "New dog",
    addDogAria: "Add a new dog",
    settings: "Settings",
    signOut: "Sign out",
  },
  home: {
    greeting: "Welcome",
    introLead:
      "Manage your dogs' profiles, health, and nutrition in one place.",
    introEditHint: "To change name, breed, weight, or activity level, tap the",
    introOpenHint:
      "icon; open a dog's card to upload lab results and see the full history.",
    addDogTitle: "Add a new dog",
    addDogPrice: "Add another family member",
    addDogLockedMax: "An account currently supports at most two profiles.",
    addDogLockedPayment:
      "Adding a second dog ({price} ₾) unlocks once the first profile is paid for.",
    emptyState: "You haven't added a dog yet.",
  },
  pet: {
    notFound: "This dog could not be found.",
    backLink: "Dashboard",
    editAria: "edit details",
    editTitle: "edit details",
    name: "Name",
    breed: "Breed",
    breedPlaceholder: "Choose a breed",
    weightKg: "Weight (kg)",
    activity: "Activity level",
    activityType: "Activity level",
    photoUpload: "Upload a photo",
    photoZoomAria: "enlarge photo",
    photoAlt: "Dog photo",
    unsavedChanges: "Unsaved changes",
    changesSaved: "Changes saved.",
    missingFields: "Fill in name, breed, and weight.",
    historyTitle: "Previous versions",
    historySavedOn: "Saved",
    compare: "Compare",
    restore: "Restore",
    fieldColumn: "Field",
    beforeColumn: "Before",
    afterColumn: "Current",
  },
  logbook: {
    title: "Health & wellbeing",
    tabVaccines: "Vaccines & prevention",
    tabSupplements: "Supplements",
    tabFood: "Food",
    tabMood: "Mood",
    vaccinesSubtitle: "Vaccination and parasite prevention history",
    vaccineType: "Type",
    vaccineName: "Name",
    vaccineNamePlaceholder: "e.g. rabies vaccine",
    administeredOn: "Date given",
    nextDue: "Next due",
    administeredLabel: "Given",
    vaccineSaveFailed: "Could not save the vaccine.",
    vaccineNameRequired: "Enter a name.",
    vaccineDateRequired: "Enter the date it was given.",
    supplementsSubtitle: "Daily supplement checklist",
    supplementName: "Name",
    supplementNamePlaceholder: "Supplement name",
    supplementDose: "Dose",
    supplementDosePlaceholder: "e.g. 1 capsule",
    supplementRequired: "Enter a name and a dose.",
    foodSubtitle: "Feeding entries",
    mealType: "Meal",
    morning: "Morning",
    evening: "Evening",
    portionGrams: "Portion (grams)",
    portionRequired: "Enter the portion size in grams.",
    portionInvalid: "The portion must be a number greater than 0.",
    brand: "Brand",
    brandPlaceholder: "Brand name",
    appetite: "Appetite",
    digestion: "Digestion",
    digestionPlaceholder: "e.g. normal stool, upset stomach…",
    moodSubtitle: "Daily mood and activity entry",
    checkInTitle: "Today's entry",
    checkInQuestion: "How is {name} feeling?",
    saveCheckIn: "Save entry",
    supplementFrequency: "Frequency",
    supplementFrequencyPlaceholder: "Frequency",
    supplementDoseHint: "Dose (e.g. 1 tablet, 5ml)",
    givenToday: "Given",
    givenTodayQuestion: "Today?",
    morningMeal: "Morning meal",
    eveningMeal: "Evening meal",
    digestionLabel: "Digestion:",
    moodLabel: "Mood",
    energyLabel: "Energy level",
    energy: "Energy",
    notes: "Notes",
    notesPlaceholder: "e.g. unusually lethargic today",
    overdue: "Overdue",
    dueSoon: "Due soon ({days} days)",
    nextLabel: "Next",
    gramsShort: "g",
  },
  medical: {
    title: "Medical records",
    vaccinesHint: "Vaccines and preventive care live",
    vaccinesHintLink: 'in the "Vaccines & prevention" tab above',
    tabSymptoms: "Symptoms",
    tabRecord: "Medical record",
    tabMedications: "Medications",
    tabExport: "Export for the vet",
    symptomsHint:
      "Pick a symptom and a severity. Everything else is recorded automatically.",
    symptom: "Symptom",
    symptomPlaceholder: "Describe the symptom",
    severity: "Severity",
    showDetails: "Add details",
    hideDetails: "Hide details",
    note: "Note",
    notePlaceholder: "Details: what triggered it, what they ate…",
    attachment: "Photo/video",
    attachmentFile: "File",
    viewFile: "View file",
    removeFile: "Remove file",
    removeSymptom: "Delete symptom",
    symptomRequired: "Choose a symptom.",
    severityRequired: "Choose a severity.",
    symptomSaveFailed: "Could not save the symptom.",
    chronicConditions: "Chronic conditions",
    allergies: "Allergies",
    geneticRisks: "Genetic / breed risks",
    surgeries: "Surgeries / injuries",
    surgeriesPlaceholder: "Describe past surgeries or injuries",
    chipHint: "Type and press Enter",
    allergiesPlaceholder: "Food / medication allergies",
    medicationsSubtitle: "Current medications and supplements",
    medicationName: "Medication name",
    medicationDose: "Dose",
    medicationFrequency: "Frequency",
    medicationNameRequired: "Enter the medication name.",
    medicationActive: "Active",
    medicationPaused: "Paused",
    medicationSaveFailed: "Could not save the medication.",
    updateFailed: "Could not update.",
    exportHint:
      "Hand the full health report to your vet by printing it or sharing a link.",
    exportView: "View / print report",
    exportCopyLink: "Copy link",
    exportCopied: "Copied!",
    exportLinkFailed: "Could not create the link.",
  },
  labs: {
    title: "Share lab results",
    description:
      "Upload blood work, a vet note, or a diagnostic document. AylopetAI processes the data for preventive insights.",
    uploadCta: "Upload lab result",
    dropzone: "Drop files here or click to choose",
    dropzoneHint: "PDF, JPEG, or PNG, up to 10MB per file",
    analyzing: "Analyzing",
    uploadedCount: "Uploaded results",
    uploadedOk: "Uploaded successfully",
    viewAria: "view",
    deleteAria: "delete",
    privacyNote:
      "Your data is protected. Lab results are used exclusively by AylopetAI to prevent disease and build an individual wellness plan.",
    invalidType: "Only PDF, JPEG, or PNG are accepted.",
    tooLarge: "The maximum file size is 10MB.",
    uploadFailed: "Upload failed. Check your connection and try again.",
    deleteFailed: "Could not delete the file. Try again.",
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your account security and password.",
    passwordUpdated: "Password updated successfully.",
    accountSection: "Account",
    passwordSection: "Change password",
    passwordSectionHint: "Enter your current password and choose a new one.",
  },
  onboarding: {
    stepAccount: "Account",
    stepDog: "Your dog",
    accountTitle: "Create an account",
    accountSubtitle: "Start your Aylopet journey.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    passwordLabel: "Password",
    passwordPlaceholder: "At least 8 characters",
    continue: "Continue",
    back: "Back",
    dogTitleNew: "New dog profile",
    dogTitleFirst: "Add your dog",
    dogSubtitle: "This helps us build personalized recommendations.",
    dogNameLabel: "Dog's name",
    dogNamePlaceholder: "e.g. Rex",
    submitAdd: "Add dog",
    submitFinish: "Finish and open the profile",
    pageTitleNew: "New dog",
    pageTitleRegister: "Register",
    pageHeadingNew: "Add your pet",
    pageHeadingWelcome: "Welcome to Aylopet",
    pageSubtitleNew:
      "A few fields are enough for personalized nutrition and health advice.",
    pageSubtitleWelcome:
      "You're a few steps away from your companion's personal profile.",
    alreadySignedIn: "You're already signed in. No need to create an account.",
    lockedMax: "An account currently supports at most two profiles.",
    lockedPayment:
      "Adding a second dog ({price} ₾) unlocks once the first profile is paid for.",
    supabaseMissing: "Supabase is not configured.",
    petCreateFailed: "The pet profile could not be created.",
    errors: {
      dogName: "Enter your dog's name",
      breed: "Choose a breed",
      weight: "Enter a weight",
      weightPositive: "Weight must be positive",
      weightMax: "Check the weight",
      activity: "Choose an activity level",
      name: "Enter your name",
      email: "Invalid email address",
      password: "At least 8 characters",
    },
  },
};

export function getDashboardCopy(locale: "ka" | "en"): DashboardCopy {
  return locale === "ka" ? DASHBOARD_KA : DASHBOARD_EN;
}
