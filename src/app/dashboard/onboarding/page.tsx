import { OnboardingForm } from "@/components/dashboard/OnboardingForm";

export default function OnboardingPage() {
  return (
    <div>
      <header className="mb-8 text-center">
        <span className="mb-3 inline-block rounded-full bg-[var(--brand-primary)]/10 px-4 py-1 text-sm font-medium text-[var(--brand-primary)]">
          რეგისტრაცია
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-4xl">
          მოგესალმებით Aylopet-ში
        </h1>
        <p className="mx-auto mt-3 max-w-md text-slate-600">
          რამდენიმე ნაბიჯი გვაშორებს შენი მეგობრის პერსონალური პროფილის
          შექმნამდე.
        </p>
      </header>
      <OnboardingForm />
    </div>
  );
}
