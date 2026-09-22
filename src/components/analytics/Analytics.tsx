"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { usePathname } from "next/navigation";

/** aylopet.com GA4 property · public by design, it ships in every page's HTML. */
const PRODUCTION_GA_ID = "G-99LP5KDVX4";

// The env var can point a deployment at a test property; local dev stays
// untracked so development traffic never lands in the production reports.
const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ||
  (process.env.NODE_ENV === "production" ? PRODUCTION_GA_ID : "");

/**
 * Private routes: the admin tables, and vet-report links whose URL is a share
 * token. Both are only reached by a full page load, so not mounting gtag there
 * keeps them out of GA's page_location.
 */
const EXCLUDED_PREFIXES = ["/admin", "/vet-report"];

export function Analytics() {
  const pathname = usePathname();

  if (!GA_MEASUREMENT_ID) return null;
  if (
    EXCLUDED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    return null;
  }

  return <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
