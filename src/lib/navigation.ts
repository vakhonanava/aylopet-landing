export interface NavChild {
  label: string;
  href: string;
  description?: string;
  /** English-only label override for select items */
  labelEn?: string;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
  /** Green active-status dot (project status link) */
  statusDot?: boolean;
}

/** Primary category row · Chewy-style mega-menu groups */
export const MAIN_NAV: NavItem[] = [
  {
    label: "პროდუქტები",
    children: [
      {
        label: "ძაღლის ცოცხალი საკვები",
        href: "/products/fresh-food",
        description: "Gently Cooked · Human grade რაციონი",
      },
      {
        label: "AylopetAI",
        href: "/products/aylopet-ai",
        description: "პერსონალური ნუტრიციოლოგი · ჩატი და გეგმა",
      },
      {
        label: "Aylopet Smart Collar",
        href: "/products/smart-collar",
        description: "ჭკვიანი ყელსაბამი · GPS · აქტივობა · AI კალორიები",
        labelEn: "Aylopet Smart Collar",
      },
      {
        label: "DNA Platform",
        href: "/dna-journey",
        description: "საბოლოო პროდუქტი · გენომური პაიპლაინი",
        labelEn: "DNA Platform",
      },
    ],
  },
  {
    label: "ცოდნა",
    children: [
      {
        label: "Pet Wellness Insights",
        href: "/knowledge",
        description: "ჯანმრთელობა, კვება და მომავალი კატეგორიები",
      },
      {
        label: "რატომ ცოცხალი საკვები?",
        href: "/why-fresh-food",
        description: "სამეცნიერო მიდგომა",
      },
      {
        label: "FAQ",
        href: "/faq",
        description: "ხშირი კითხვები",
      },
    ],
  },
  {
    label: "ჩვენს შესახებ",
    children: [
      { label: "რა არის Aylopet", href: "/about/what-is-aylopet" },
      { label: "კომპანიის ხედვა", href: "/about/vision" },
      { label: "ჩვენი ისტორია", href: "/about/story" },
      { label: "წარმოების პროცესი", href: "/about/process" },
      { label: "გუნდი", href: "/about/team" },
    ],
  },
  { label: "B2B", href: "/b2b" },
  { label: "შეფასებები", href: "/reviews" },
  { label: "პროექტის სტატუსი", href: "/project-status", statusDot: true },
];

export const PLATFORM_LINKS: NavChild[] = [
  { label: "Early Adopter", href: "/onboarding/platform" },
  { label: "AylopetAI", href: "/products/aylopet-ai", labelEn: "AylopetAI" },
  { label: "DNA Platform", href: "/dna-journey" },
  { label: "B2B Partnerships", href: "/b2b" },
];

export function isNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isNavGroupActive(
  pathname: string,
  children: NavChild[],
): boolean {
  return children.some((c) => isNavActive(pathname, c.href));
}

export function scrollToWaitlist() {
  const el = document.getElementById("waitlist");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  window.location.href = "/onboarding/platform";
}
