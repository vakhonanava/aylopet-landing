import { permanentRedirect } from "next/navigation";

/** Legacy success URL — unified flow continues in onboarding / dashboard. */
export default function EarlyAccessSuccessPage() {
  permanentRedirect("/onboarding/platform");
}
