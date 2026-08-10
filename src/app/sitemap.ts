import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Public, indexable routes only. Dashboard, auth, admin, portal and tokenised
 * vet-report pages are intentionally excluded (see `robots.ts`).
 */
const ROUTES: Array<{ path: string; priority: number }> = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.7 },
  { path: "/about/what-is-aylopet", priority: 0.8 },
  { path: "/about/story", priority: 0.6 },
  { path: "/about/vision", priority: 0.6 },
  { path: "/about/process", priority: 0.6 },
  { path: "/about/team", priority: 0.6 },
  { path: "/products/aylopet-ai", priority: 0.9 },
  { path: "/products/fresh-food", priority: 0.9 },
  { path: "/products/smart-collar", priority: 0.9 },
  { path: "/dna-journey", priority: 0.9 },
  { path: "/nutrition", priority: 0.7 },
  { path: "/why-fresh-food", priority: 0.7 },
  { path: "/knowledge", priority: 0.7 },
  { path: "/knowledge/scientific-overview", priority: 0.6 },
  { path: "/faq", priority: 0.7 },
  { path: "/reviews", priority: 0.6 },
  { path: "/b2b", priority: 0.7 },
  { path: "/early-access", priority: 0.8 },
  { path: "/onboarding", priority: 0.6 },
  { path: "/onboarding/platform", priority: 0.6 },
  { path: "/project-status", priority: 0.4 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
  { path: "/cookies", priority: 0.3 },
  { path: "/accessibility", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map(({ path, priority }) => ({
    // `/` must stay slash-less so it matches the canonical Next emits for home.
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: priority >= 0.8 ? "weekly" : "monthly",
    priority,
  }));
}
