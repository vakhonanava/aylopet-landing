"use client";

import { upload } from "@vercel/blob/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  FileImage,
  FileText,
  LoaderCircle,
  ScanLine,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import {
  uid,
  type LabReportEntry,
  type Pet,
} from "@/lib/dashboard";
import type { LabReportRecord } from "@/lib/lab-reports/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

type AcceptedMimeType = (typeof ACCEPTED_TYPES)[number];
type UploadPhase = "uploading" | "scanning";
type LabStorageMode = "supabase" | "blob";

interface PendingLabUpload {
  id: string;
  name: string;
  progress: number;
  phase: UploadPhase;
}

interface LabResultsUploadProps {
  pet: Pet;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function safeFilename(file: File): string {
  const extension =
    file.type === "application/pdf"
      ? "pdf"
      : file.type === "image/png"
        ? "png"
        : "jpg";
  const base = file.name
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${base || "medical-report"}.${extension}`;
}

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type as AcceptedMimeType)) {
    return `${file.name}: დასაშვებია მხოლოდ PDF, JPEG ან PNG.`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `${file.name}: ფაილის მაქსიმალური ზომაა 10MB.`;
  }
  return null;
}

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function recordToEntry(report: LabReportRecord): LabReportEntry {
  return {
    id: report.id,
    name: report.name,
    size: report.size,
    mimeType: report.mimeType,
    pathname: report.storagePath,
    url: report.url,
    uploadedAt: report.uploadedAt,
    status: report.status,
  };
}

function uploadViaSupabase(
  file: File,
  petId: string,
  onProgress: (progress: number) => void,
): Promise<LabReportRecord> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/lab-results/supabase-upload");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress(Math.min(94, Math.max(4, Math.round((event.loaded / event.total) * 100))));
    };

    xhr.onload = () => {
      try {
        const payload = JSON.parse(xhr.responseText) as {
          ok?: boolean;
          report?: LabReportRecord;
          error?: string;
        };
        if (xhr.status >= 200 && xhr.status < 300 && payload.report) {
          resolve(payload.report);
          return;
        }
        reject(new Error(payload.error ?? "Upload failed"));
      } catch {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));

    const formData = new FormData();
    formData.append("petId", petId);
    formData.append("file", file);
    xhr.send(formData);
  });
}

export function LabResultsUpload({ pet }: LabResultsUploadProps) {
  const { addLabReport, removeLabReport } = useDashboard();
  const inputRef = useRef<HTMLInputElement>(null);
  const [storageMode, setStorageMode] = useState<LabStorageMode>("blob");
  const [isDragging, setIsDragging] = useState(false);
  const [pending, setPending] = useState<PendingLabUpload[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const reports = pet.labReports ?? [];

  useEffect(() => {
    void fetch("/api/lab-results/config")
      .then((response) => response.json())
      .then((payload: { mode?: LabStorageMode }) => {
        if (payload.mode === "supabase" || payload.mode === "blob") {
          setStorageMode(payload.mode);
        }
      })
      .catch(() => {
        // Keep Vercel Blob fallback when config is unavailable.
      });
  }, []);

  const patchPending = (
    id: string,
    patch: Partial<Omit<PendingLabUpload, "id">>,
  ) => {
    setPending((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const uploadFile = async (file: File) => {
    const pendingId = uid("lab-pending");
    setPending((current) => [
      ...current,
      { id: pendingId, name: file.name, progress: 4, phase: "uploading" },
    ]);

    try {
      let report: LabReportEntry;

      if (storageMode === "supabase") {
        const uploaded = await uploadViaSupabase(file, pet.id, (progress) => {
          patchPending(pendingId, { progress });
        });
        patchPending(pendingId, { phase: "scanning", progress: 100 });
        await wait(900);
        report = recordToEntry(uploaded);
      } else {
        const blob = await upload(
          `lab-results/${pet.id}/${Date.now()}-${safeFilename(file)}`,
          file,
          {
            access: "private",
            handleUploadUrl: "/api/lab-results/upload",
            clientPayload: JSON.stringify({ petId: pet.id }),
            contentType: file.type,
            onUploadProgress: ({ percentage }) => {
              patchPending(pendingId, {
                progress: Math.min(94, Math.max(4, Math.round(percentage))),
              });
            },
          },
        );

        patchPending(pendingId, { phase: "scanning", progress: 100 });
        await wait(900);

        report = {
          id: uid("lab"),
          name: file.name,
          size: file.size,
          mimeType: file.type as AcceptedMimeType,
          pathname: blob.pathname,
          url: blob.url,
          uploadedAt: new Date().toISOString(),
          status: "uploaded",
        };
      }

      addLabReport(pet.id, report);
      setPending((current) => current.filter((item) => item.id !== pendingId));
    } catch {
      setPending((current) => current.filter((item) => item.id !== pendingId));
      setError(
        "ატვირთვა ვერ მოხერხდა. შეამოწმე კავშირი და სცადე თავიდან.",
      );
    }
  };

  const processFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const validationErrors = files
      .map(validateFile)
      .filter((message): message is string => Boolean(message));
    const validFiles = files.filter((file) => !validateFile(file));

    setError(validationErrors.length ? validationErrors.join(" ") : null);
    await Promise.all(validFiles.map(uploadFile));
    if (inputRef.current) inputRef.current.value = "";
  };

  const deleteReport = async (report: LabReportEntry) => {
    setDeletingId(report.id);
    setError(null);
    try {
      const response = await fetch("/api/lab-results/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname: report.pathname, fileId: report.id }),
      });
      if (!response.ok) throw new Error("Delete failed");
      removeLabReport(pet.id, report.id);
    } catch {
      setError("ფაილის წაშლა ვერ მოხერხდა. სცადე თავიდან.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#173e36]/12 bg-[#071b18] text-white shadow-[0_24px_70px_rgba(7,27,24,0.16)]">
      <div className="relative p-5 sm:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_95%_0%,rgba(103,190,166,0.18),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.03),transparent_45%)]"
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
              <ScanLine className="h-4 w-4" />
              AylopetAI Clinical Intake
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
              ანალიზების გაზიარება
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/58">
              ატვირთე სისხლის ანალიზი, ვეტერინარის ჩანაწერი ან დიაგნოსტიკური
              დოკუმენტი. AylopetAI მონაცემებს პრევენციული ინსაითებისთვის
              დაამუშავებს.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-1.5 text-xs font-medium text-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            Private upload
          </span>
        </div>

        <label
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            event.preventDefault();
            if (event.currentTarget === event.target) setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            void processFiles(event.dataTransfer.files);
          }}
          className={`relative mt-6 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-5 py-8 text-center outline-none transition-all duration-300 focus-within:ring-2 focus-within:ring-emerald-300/40 ${
            isDragging
              ? "scale-[1.01] border-emerald-300 bg-emerald-300/[0.1] shadow-[0_0_38px_rgba(110,231,183,0.13)]"
              : "border-white/20 bg-white/[0.035] hover:border-emerald-300/45 hover:bg-white/[0.055]"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="sr-only"
            aria-describedby="lab-upload-help lab-upload-error"
            onChange={(event) => {
              if (event.target.files) void processFiles(event.target.files);
            }}
          />
          <motion.span
            animate={isDragging ? { y: -4, scale: 1.06 } : { y: 0, scale: 1 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.09] text-emerald-200"
          >
            <UploadCloud className="h-6 w-6" />
          </motion.span>
          <p className="mt-4 text-sm font-semibold text-white/90">
            ჩააგდე ფაილები აქ ან დააჭირე ასარჩევად
          </p>
          <p id="lab-upload-help" className="mt-1.5 text-xs text-white/42">
            PDF, JPEG ან PNG · მაქსიმუმ 10MB თითო ფაილზე
          </p>
        </label>

        <div aria-live="polite" className="relative">
          {error && (
            <p
              id="lab-upload-error"
              className="mt-3 flex items-start gap-2 rounded-xl border border-red-300/15 bg-red-300/[0.08] px-3 py-2.5 text-xs leading-relaxed text-red-100"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <AnimatePresence initial={false}>
            {pending.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative mt-3 overflow-hidden rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.055] p-4"
              >
                {item.phase === "scanning" && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-cyan-200/10 to-transparent"
                    animate={{ left: ["-20%", "110%"] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                )}
                <div className="relative flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                    {item.phase === "scanning" ? (
                      <ScanLine className="h-5 w-5" />
                    ) : (
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <span className="text-xs tabular-nums text-cyan-100/65">
                        {item.phase === "scanning"
                          ? "ანალიზდება"
                          : `${item.progress}%`}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300"
                        animate={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {reports.length > 0 && (
          <div className="relative mt-5 space-y-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
              ატვირთული დოკუმენტები · {reports.length}
            </p>
            <AnimatePresence initial={false}>
              {reports.map((report) => {
                const isImage = report.mimeType.startsWith("image/");
                return (
                  <motion.article
                    layout
                    key={report.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3.5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-emerald-200">
                      {isImage ? (
                        <FileImage className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white/90">
                        {report.name}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-white/40">
                        <span>{formatBytes(report.size)}</span>
                        <span aria-hidden>·</span>
                        <span className="inline-flex items-center gap-1 text-emerald-300/80">
                          <CheckCircle2 className="h-3 w-3" />
                          წარმატებით აიტვირთა
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => void deleteReport(report)}
                      disabled={deletingId === report.id}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/35 transition-colors hover:bg-red-400/10 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/40 disabled:opacity-40"
                      aria-label={`${report.name} წაშლა`}
                    >
                      {deletingId === report.id ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <footer className="flex items-start gap-3 border-t border-white/8 bg-black/10 px-5 py-4 text-xs leading-relaxed text-white/48 sm:px-7">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300/70" />
        <p>
          თქვენი მონაცემები დაცულია. ანალიზები გამოიყენება ექსკლუზიურად
          AylopetAI-ის მიერ დაავადებების პრევენციისა და ინდივიდუალური ველნეს
          გეგმის შესადგენად.
        </p>
      </footer>
    </section>
  );
}
