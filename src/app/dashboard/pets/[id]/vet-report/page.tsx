import { notFound } from "next/navigation";
import { VetReportView } from "@/components/dashboard/medical/VetReportView";
import { isPlatformPetId } from "@/lib/platform/dashboard-sync";
import { buildVetReportData } from "@/lib/platform/vet-report";
import { createClient } from "@/utils/supabase/server";

export default async function VetReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isPlatformPetId(id)) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-slate-500">
          ვეტ-რეპორტი ხელმისაწვდომია მხოლოდ შენახული ძაღლებისთვის.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data: ownedPet } = await supabase
    .from("pets")
    .select("id")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!ownedPet) notFound();

  const data = await buildVetReportData(supabase, id);
  if (!data) notFound();

  return <VetReportView data={data} mode="authenticated" />;
}
