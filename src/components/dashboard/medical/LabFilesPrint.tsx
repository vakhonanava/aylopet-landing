"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/dashboard";
import type { VetReportLabFile } from "@/lib/platform/vet-report";

type PdfPages =
  | { status: "loading" }
  | { status: "ready"; pages: string[] }
  | { status: "error" };

/**
 * A PDF can't be printed from inside another page (an <iframe> or <embed>
 * prints blank), so each page is rasterised to an image with pdf.js.
 */
async function renderPdfPages(url: string): Promise<string[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const doc = await pdfjs.getDocument({ url }).promise;
  const pages: string[] = [];
  for (let n = 1; n <= doc.numPages; n += 1) {
    const page = await doc.getPage(n);
    // ~150 dpi on A4 — sharp on paper without huge data URLs.
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");
    if (!context) continue;
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    pages.push(canvas.toDataURL("image/jpeg", 0.85));
  }
  await doc.destroy();
  return pages;
}

function PdfFile({ file }: { file: VetReportLabFile }) {
  const [state, setState] = useState<PdfPages>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    renderPdfPages(file.url)
      .then((pages) => {
        if (!cancelled) setState({ status: "ready", pages });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [file.url]);

  if (state.status === "loading") {
    return <p className="text-sm text-slate-400 print:hidden">PDF იტვირთება...</p>;
  }

  if (state.status === "error") {
    return (
      <a
        href={file.url}
        target="_blank"
        rel="noreferrer"
        className="text-sm font-medium text-[var(--brand-primary)] underline"
      >
        PDF-ის გახსნა
      </a>
    );
  }

  return (
    <div className="space-y-3">
      {state.pages.map((src, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={index}
          src={src}
          alt={`${file.name}, გვერდი ${index + 1}`}
          className="w-full break-inside-avoid rounded-lg border border-[#e5e7eb] print:rounded-none print:border-0"
        />
      ))}
    </div>
  );
}

export function LabFilesPrint({ files }: { files: VetReportLabFile[] }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--brand-primary)]">
        ლაბორატორიული ანალიზები
      </h2>
      {files.length === 0 ? (
        <p className="text-sm text-slate-400">ატვირთული ანალიზი არ არის.</p>
      ) : (
        <div className="space-y-6">
          {files.map((file) => (
            <article key={file.id} className="print:break-before-page">
              <p className="mb-2 text-sm font-medium text-[var(--brand-primary)]">
                {file.name}
                <span className="ml-2 text-xs font-normal text-slate-400">
                  {formatDate(file.uploadedAt)}
                </span>
              </p>
              {file.mimeType === "application/pdf" ? (
                <PdfFile file={file} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full break-inside-avoid rounded-lg border border-[#e5e7eb] print:rounded-none print:border-0"
                />
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
