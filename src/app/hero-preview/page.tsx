import type { Metadata } from "next";
import { Hero3D } from "@/components/sections/Hero3D";

export const metadata: Metadata = {
  title: "Aylopet Hero Preview",
  robots: { index: false, follow: false },
};

export default function HeroPreviewPage() {
  return (
    <main className="min-h-screen bg-[var(--background-main)]">
      <Hero3D media="ecosystem" />
    </main>
  );
}
