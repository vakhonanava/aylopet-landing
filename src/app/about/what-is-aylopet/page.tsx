import type { Metadata } from "next";
import { WhatIsAylopetContent } from "@/components/about/WhatIsAylopetContent";
import { ABOUT } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "Aylopet · რა არის Aylopet",
  description: ABOUT.whatIs.body,
};

export default function WhatIsAylopetPage() {
  return <WhatIsAylopetContent />;
}
