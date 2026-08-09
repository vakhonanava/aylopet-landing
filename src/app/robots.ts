import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Authenticated, transactional, or tokenised surfaces — nothing here
        // should ever appear in search results.
        disallow: [
          "/api/",
          "/admin/",
          "/auth/",
          "/dashboard/",
          "/portal/",
          "/vet-report/",
          "/hero-preview",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
