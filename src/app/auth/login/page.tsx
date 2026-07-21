"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const input =
  "w-full rounded-2xl border border-[var(--border-light)] bg-white px-4 py-3 text-sm text-[var(--brand-primary)] outline-none transition-all duration-200 placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand-primary)]/40 focus:ring-4 focus:ring-[var(--brand-primary)]/5";
const label = "block text-sm font-medium text-[var(--brand-primary)]";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = email.split("@")[0] || "მომხმარებელი";
    login({ name, email });
    router.push("/dashboard/pets/rex");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background-main)] px-6 py-24">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--brand-primary)]">
            კეთილი იყოს დაბრუნება
          </h1>
          <p className="mt-2 text-[var(--text-body)]">
            შედი შენს Aylopet ანგარიშზე.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-5 rounded-[2rem] border border-[var(--border-light)] bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8"
        >
          <div className="flex flex-col gap-1.5">
            <label className={label} htmlFor="email">ელ. ფოსტა</label>
            <input
              id="email"
              type="email"
              className={input}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={label} htmlFor="password">პაროლი</label>
            <input
              id="password"
              type="password"
              className={input}
              placeholder="შენი პაროლი"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)]"
          >
            შესვლა
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>

          <p className="text-center text-sm text-[var(--text-secondary)]">
            არ გაქვს ანგარიში?{" "}
            <Link href="/auth/register" className="font-medium text-[var(--brand-primary)] hover:underline">
              რეგისტრაცია
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
