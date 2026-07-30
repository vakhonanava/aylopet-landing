"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink, Loader2 } from "lucide-react";
import { addButton } from "@/components/dashboard/FormControls";
import type { Pet } from "@/lib/dashboard";

export function VetExportButton({ pet }: { pet: Pet }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/vet-report/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petId: pet.id }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "ბმული ვერ შეიქმნა.");
        return;
      }
      await navigator.clipboard.writeText(json.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("ბმული ვერ შეიქმნა.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-500">
        გადაეცი სრული ჯანმრთელობის რეპორტი ვეტერინარს — ბეჭდვით ან ბმულის გაზიარებით.
      </p>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href={`/dashboard/pets/${pet.id}/vet-report`} target="_blank" className={addButton}>
          <ExternalLink className="h-4 w-4" /> რეპორტის ნახვა / ბეჭდვა
        </Link>
        <button
          type="button"
          disabled={busy}
          onClick={() => void handleCopyLink()}
          className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-5 py-2.5 text-sm font-medium text-[var(--brand-primary)]"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
          {copied ? "დაკოპირდა!" : "ბმულის კოპირება"}
        </button>
      </div>
    </div>
  );
}
