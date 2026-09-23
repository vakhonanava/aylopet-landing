"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import { addButton } from "@/components/dashboard/FormControls";
import type { Pet } from "@/lib/dashboard";

async function createShareLink(petId: string): Promise<string> {
  const res = await fetch("/api/vet-report/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ petId }),
  });
  const json = await res.json();
  if (!res.ok || !json.ok) throw new Error(json.error ?? "ბმული ვერ შეიქმნა.");
  return json.url as string;
}

/**
 * Safari only lets a tap write to the clipboard synchronously. The link comes
 * from a request, so hand the clipboard a pending ClipboardItem inside the tap
 * and let it resolve once the link exists.
 */
function copyPendingText(text: Promise<string>): Promise<void> {
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    return navigator.clipboard.write([
      new ClipboardItem({
        "text/plain": text.then((value) => new Blob([value], { type: "text/plain" })),
      }),
    ]);
  }
  return text.then((value) => navigator.clipboard.writeText(value));
}

export function VetExportButton({ pet }: { pet: Pet }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const flashCopied = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    setError(null);

    // Link already made — copy straight away, still inside the tap.
    if (shareUrl) {
      void navigator.clipboard
        .writeText(shareUrl)
        .then(flashCopied)
        .catch(() => setError("ავტომატური კოპირება ვერ მოხერხდა — დააკოპირე ბმული ქვემოდან."));
      return;
    }

    setBusy(true);
    const url = createShareLink(pet.id);
    url.then(setShareUrl, () => {});

    void copyPendingText(url)
      .then(flashCopied)
      .catch(async () => {
        // Either the link failed, or the browser refused the clipboard. In the
        // second case the link now shows below for a manual copy.
        try {
          await url;
          setError("ავტომატური კოპირება ვერ მოხერხდა — დააკოპირე ბმული ქვემოდან.");
        } catch (linkError) {
          setError(linkError instanceof Error ? linkError.message : "ბმული ვერ შეიქმნა.");
        }
      })
      .finally(() => setBusy(false));
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-500">
        გადაეცი სრული ჯანმრთელობის რეპორტი ვეტერინარს ბეჭდვით ან ბმულის გაზიარებით.
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
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-5 py-2.5 text-sm font-medium text-[var(--brand-primary)]"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "დაკოპირდა!" : "ბმულის კოპირება"}
        </button>
      </div>

      {shareUrl && (
        <input
          readOnly
          value={shareUrl}
          onFocus={(event) => event.currentTarget.select()}
          aria-label="რეპორტის ბმული"
          className="w-full rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] px-4 py-2.5 font-mono text-xs text-slate-600"
        />
      )}
    </div>
  );
}
