"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  QrCode as QrCodeIcon,
} from "lucide-react";
import { addButton } from "@/components/dashboard/FormControls";
import { downloadQrSvg, QrCode } from "@/components/dashboard/history/QrCode";
import { formatDate, type Pet } from "@/lib/dashboard";

interface ShareLink {
  url: string;
  expiresAt: string | null;
}

async function createShareLink(petId: string): Promise<ShareLink> {
  const res = await fetch("/api/vet-report/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ petId }),
  });
  const json = await res.json();
  if (!res.ok || !json.ok) throw new Error(json.error ?? "ბმული ვერ შეიქმნა.");
  return { url: json.url as string, expiresAt: (json.expiresAt as string | null) ?? null };
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
  const [share, setShare] = useState<ShareLink | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const shareUrl = share?.url ?? null;

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
    const link = createShareLink(pet.id);
    link.then(setShare, () => {});
    const url = link.then((created) => created.url);

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
        გადაეცი სრული ჯანმრთელობის რეპორტი ვეტერინარს ბეჭდვით, ბმულით ან QR კოდით.
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
          ) : shareUrl ? (
            <Copy className="h-4 w-4" />
          ) : (
            <QrCodeIcon className="h-4 w-4" />
          )}
          {copied ? "დაკოპირდა!" : shareUrl ? "ბმულის კოპირება" : "ბმული და QR კოდი"}
        </button>
      </div>

      {share && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-4 sm:flex-row sm:items-start">
          <div ref={qrRef} className="shrink-0 rounded-2xl border border-[#e5e7eb] bg-white p-3">
            <QrCode value={share.url} size={176} title="ვეტ-რეპორტის QR კოდი" />
          </div>
          <div className="flex w-full min-w-0 flex-col gap-3">
            <p className="text-sm text-slate-600">
              QR კოდის დასკანერებით ვეტერინარი ან ნებისმიერი ადამიანი რეგისტრაციის გარეშე
              ნახავს რეპორტს და ატვირთულ ანალიზებს.
            </p>
            {share.expiresAt && (
              <p className="text-xs text-slate-400">
                ბმული და QR კოდი მოქმედებს {formatDate(share.expiresAt)}-მდე.
              </p>
            )}
            <input
              readOnly
              value={share.url}
              onFocus={(event) => event.currentTarget.select()}
              aria-label="რეპორტის ბმული"
              className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-2.5 font-mono text-xs text-slate-600"
            />
            <button
              type="button"
              onClick={() => downloadQrSvg(qrRef.current, `aylopet-vet-report-${pet.name}.svg`)}
              className="inline-flex cursor-pointer items-center gap-1.5 self-start text-xs font-medium text-slate-500 transition-colors hover:text-[var(--brand-primary)]"
            >
              <Download className="h-3.5 w-3.5" /> QR-ის ჩამოტვირთვა
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
