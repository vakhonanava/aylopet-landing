import type { Metadata } from "next";
import { Suspense } from "react";
import { AdopterSessionSync } from "@/components/early-access/AdopterSessionSync";
import { EarlyAccessSuccessContent } from "@/components/early-access/EarlyAccessSuccessContent";

export const metadata: Metadata = {
  title: "Aylopet · მადლობა რეგისტრაციისთვის",
};

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: Promise<{
    position?: string;
    name?: string;
    dog?: string;
    email?: string;
  }>;
}

export default async function EarlyAccessSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;
  const position = params.position ?? "?";
  const name = params.name ?? "მეგობარო";
  const dog = params.dog ?? "შენი ძაღლი";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background-main)] px-6 py-24">
      <Suspense fallback={null}>
        <AdopterSessionSync />
      </Suspense>
      <EarlyAccessSuccessContent position={position} name={name} dog={dog} />
    </main>
  );
}
