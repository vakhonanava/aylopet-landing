import type { Dictionary } from "@/lib/i18n/types";
import type { NavItem } from "@/lib/navigation";

export function getMainNav(dict: Dictionary): NavItem[] {
  return [
    {
      label: dict.locale === "ka" ? "პროდუქტები" : "Products",
      children: [
        {
          label: dict.locale === "ka" ? "ძაღლის ცოცხალი საკვები" : "Fresh dog food",
          href: "/products/fresh-food",
          description:
            dict.locale === "ka"
              ? "Gently Cooked · Human grade რაციონი"
              : "Gently Cooked · Human grade meals",
        },
        {
          label: "AylopetAI",
          href: "/products/aylopet-ai",
          description:
            dict.locale === "ka"
              ? "პერსონალური ნუტრიციოლოგი · ჩატი და გეგმა"
              : "Personal nutritionist · chat and plan",
        },
        {
          label: "Aylopet Smart Collar",
          href: "/products/smart-collar",
          description:
            dict.locale === "ka"
              ? "ჭკვიანი ყელსაბამი · GPS · აქტივობა · AI კალორიები"
              : "Smart collar · GPS · activity · AI calories",
        },
        {
          label: "DNA Platform",
          href: "/dna-journey",
          description:
            dict.locale === "ka"
              ? "საბოლოო პროდუქტი · გენომური პაიპლაინი"
              : "Ultimate end product · genomic pipeline",
        },
      ],
    },
    {
      label: dict.locale === "ka" ? "ცოდნა" : "Insights",
      children: [
        {
          label: dict.knowledgeHub.title,
          href: "/knowledge",
          description: dict.knowledgeHub.subtext.slice(0, 72) + "…",
        },
        {
          label: dict.locale === "ka" ? "რატომ ცოცხალი საკვები?" : "Why fresh food?",
          href: "/why-fresh-food",
          description:
            dict.locale === "ka" ? "სამეცნიერო მიდგომა" : "Science backed approach",
        },
        {
          label: "FAQ",
          href: "/faq",
          description:
            dict.locale === "ka" ? "ხშირი კითხვები" : "Common questions",
        },
      ],
    },
    {
      label: dict.locale === "ka" ? "ჩვენს შესახებ" : "About",
      children: [
        {
          label: dict.locale === "ka" ? "რა არის Aylopet" : "What is Aylopet",
          href: "/about/what-is-aylopet",
        },
        {
          label: dict.locale === "ka" ? "კომპანიის ხედვა" : "Vision",
          href: "/about/vision",
        },
        {
          label: dict.locale === "ka" ? "ჩვენი ისტორია" : "Our story",
          href: "/about/story",
        },
        {
          label: dict.locale === "ka" ? "წარმოების პროცესი" : "Production",
          href: "/about/process",
        },
        {
          label: dict.locale === "ka" ? "გუნდი" : "Team",
          href: "/about/team",
        },
      ],
    },
    {
      label: "B2B",
      href: "/b2b",
    },
    {
      label: dict.locale === "ka" ? "შეფასებები" : "Reviews",
      href: "/reviews",
    },
    {
      label: dict.locale === "ka" ? "პროექტის სტატუსი" : "Project status",
      href: "/project-status",
      statusDot: true,
    },
  ];
}

export function getPlatformLinks(dict: Dictionary) {
  return [
    { label: dict.locale === "ka" ? "Early Adopter" : "Early Adopter", href: "/onboarding/platform" },
    { label: "AylopetAI", href: "/products/aylopet-ai" },
    {
      label: "DNA Platform",
      href: "/dna-journey",
    },
    {
      label: dict.locale === "ka" ? "B2B პარტნიორობა" : "B2B Partnerships",
      href: "/b2b",
    },
  ];
}
