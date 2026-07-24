import { permanentRedirect } from "next/navigation";

/** Unified secure onboarding — replaces legacy multi-form waitlist. */
export default function EarlyAccessPage() {
  permanentRedirect("/onboarding/platform");
}
