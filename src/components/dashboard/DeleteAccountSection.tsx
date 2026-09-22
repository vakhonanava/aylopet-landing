"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const REMOVED = [
  "ძაღლების პროფილები და ჯანმრთელობის ისტორია",
  "ატვირთული ანალიზები და სამედიცინო ფაილები",
  "ვაქცინები, სიმპტომები და მედიკამენტები",
  "მოსაწვევი კოდი, მოწვეული მეგობრები და ქულები",
  "მოლოდინის სიის ჩანაწერი და საკონტაქტო მონაცემები",
];

export function DeleteAccountSection() {
  const { email, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const typedEmail = confirmation.trim().toLowerCase();
  const canDelete = Boolean(email) && typedEmail === email.toLowerCase();

  const onDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(body.error ?? "ანგარიშის წაშლა ვერ მოხერხდა.");
        setDeleting(false);
        return;
      }
    } catch {
      setError("ქსელის შეცდომა. სცადე ხელახლა.");
      setDeleting(false);
      return;
    }

    // The account is gone; drop the local session before leaving the dashboard.
    await signOut();
    router.replace("/");
  };

  return (
    <section className="mt-6 rounded-[2rem] border border-red-200 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
      <h2 className="flex items-center gap-2 text-base font-semibold text-red-700">
        <AlertTriangle className="h-[18px] w-[18px]" aria-hidden />
        ანგარიშის წაშლა
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        წაშლა შეუქცევადია · აღდგენა ვეღარ მოხერხდება.
      </p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-5 inline-flex min-h-[44px] items-center rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
        >
          ანგარიშის წაშლა
        </button>
      ) : (
        <div className="mt-5">
          <p className="text-sm font-medium text-slate-700">
            წაიშლება სამუდამოდ:
          </p>
          <ul className="mt-2 space-y-1.5">
            {REMOVED.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-slate-600">
                <span className="text-red-400">−</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            დამფუძნებელი Ambassador-ის ნომერი და მისი შეღავათები უქმდება. ხელახალი
            რეგისტრაციისას ისინი აღარ დაბრუნდება.
          </p>

          <label
            className="mt-5 block text-sm font-medium text-slate-700"
            htmlFor="deleteConfirmation"
          >
            დასადასტურებლად აკრიფე შენი ელ. ფოსტა: <strong>{email}</strong>
          </label>
          <input
            id="deleteConfirmation"
            type="email"
            autoComplete="off"
            spellCheck={false}
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-[var(--border-light)] bg-white px-4 py-3 text-sm outline-none transition-all focus:border-red-300 focus:ring-4 focus:ring-red-100"
            placeholder={email}
          />

          {error && (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void onDelete()}
              disabled={!canDelete || deleting}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              სამუდამოდ წაშლა
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setConfirmation("");
                setError(null);
              }}
              disabled={deleting}
              className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--border-light)] px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              გაუქმება
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
