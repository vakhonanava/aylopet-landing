import type { Metadata } from "next";
import { DashboardProvider } from "@/components/dashboard/DashboardStore";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileTopBar } from "@/components/dashboard/MobileTopBar";

export const metadata: Metadata = {
  title: "Aylopet · პანელი",
  description: "მართე შენი ძაღლის პროფილი, ჯანმრთელობა და კვება.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-[#FAFAF8]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileTopBar />
          <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
