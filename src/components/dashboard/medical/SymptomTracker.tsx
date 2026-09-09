"use client";

import { useMemo, useRef, useState } from "react";
import { FileText, Loader2, Paperclip, Trash2, X } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { useToast } from "@/components/dashboard/Toast";
import { useDashboardCopy } from "@/components/dashboard/useDashboardCopy";
import { fieldLabel, textInput } from "@/components/dashboard/FormControls";
import type { Pet } from "@/lib/dashboard";
import {
  getSeverityLevels,
  getSymptomPresets,
  type SeverityLevel,
  type SymptomAttachment,
  type SymptomLog,
} from "@/lib/medical";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("ka-GE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDayGroup(iso: string): string {
  return new Date(iso).toLocaleDateString("ka-GE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function SymptomTracker({ pet }: { pet: Pet }) {
  const { addSymptomLog, removeSymptomLog } = useDashboard();
  const { d, locale } = useDashboardCopy();
  const toast = useToast();
  const severityLevels = getSeverityLevels(locale);
  const symptomPresets = getSymptomPresets(locale);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [symptomType, setSymptomType] = useState<string | null>(null);
  const [customSymptom, setCustomSymptom] = useState("");
  const [severity, setSeverity] = useState<SeverityLevel | null>(null);
  const [detailMode, setDetailMode] = useState(false);
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState<SymptomAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvedSymptom =
    symptomType === "other" ? customSymptom.trim() : (symptomType ?? "");

  const resetForm = () => {
    setSymptomType(null);
    setCustomSymptom("");
    setSeverity(null);
    setDetailMode(false);
    setNotes("");
    setAttachments([]);
    setError(null);
  };

  const submit = async (severityValue: SeverityLevel) => {
    if (!resolvedSymptom) {
      setError(d.medical.symptomRequired);
      return;
    }
    setBusy(true);
    setError(null);
    const result = await addSymptomLog(pet.id, {
      loggedAt: new Date().toISOString(),
      symptomType: resolvedSymptom,
      severity: severityValue,
      notes,
      attachments,
    });
    setBusy(false);
    if (!result.ok) {
      const message = result.error ?? d.medical.symptomSaveFailed;
      setError(message);
      toast.error(message);
      return;
      return;
    }
    resetForm();
  };

  const handleSeverityTap = (value: SeverityLevel) => {
    setSeverity(value);
    if (!detailMode) void submit(value);
  };

  const handleSaveDetailed = () => {
    if (!severity) {
      setError(d.medical.severityRequired);
      return;
    }
    void submit(severity);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("petId", pet.id);
      formData.append("file", file);
      const res = await fetch("/api/medical/attachments/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? d.toast.uploadFailed);
      } else {
        setAttachments((prev) => [...prev, { path: json.path, url: json.url }]);
      }
    } catch {
      setError(d.toast.uploadFailed);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (logId: string) => {
    setBusy(true);
    const result = await removeSymptomLog(pet.id, logId);
    setBusy(false);
    if (!result.ok) {
      const message = result.error ?? d.toast.deleteFailed;
      setError(message);
      toast.error(message);
      return;
    }
    toast.success(d.toast.deleted);
  };

  const grouped = useMemo(() => {
    const map = new Map<string, SymptomLog[]>();
    for (const log of pet.symptomLogs) {
      const key = formatDayGroup(log.loggedAt);
      const arr = map.get(key) ?? [];
      arr.push(log);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [pet.symptomLogs]);

  return (
    <div>
      <p className="mb-4 text-sm text-slate-500">
        {d.medical.symptomsHint}
      </p>

      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-4">
        <label className={fieldLabel}>{d.medical.symptom}</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {symptomPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setSymptomType(preset)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                symptomType === preset
                  ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                  : "border-[#e5e7eb] bg-white text-slate-600 hover:border-[var(--brand-primary)]/30"
              }`}
            >
              {preset}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSymptomType("other")}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              symptomType === "other"
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                : "border-[#e5e7eb] bg-white text-slate-600 hover:border-[var(--brand-primary)]/30"
            }`}
          >
            {d.common.other}
          </button>
        </div>
        {symptomType === "other" && (
          <input
            className={`${textInput} mt-3`}
            value={customSymptom}
            onChange={(e) => setCustomSymptom(e.target.value)}
            placeholder={d.medical.symptomPlaceholder}
          />
        )}

        <div className="mt-4 flex items-center justify-between">
          <label className={fieldLabel}>{d.medical.severity}</label>
          <button
            type="button"
            onClick={() => setDetailMode((v) => !v)}
            className="text-xs font-medium text-[var(--brand-primary)] underline underline-offset-2"
          >
            {detailMode ? d.medical.hideDetails : d.medical.showDetails}
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {severityLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              disabled={busy}
              onClick={() => handleSeverityTap(level.value)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                severity === level.value
                  ? level.colorClass
                  : "border-[#e5e7eb] bg-white text-slate-600 hover:border-[var(--brand-primary)]/30"
              }`}
            >
              <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${level.dotClass}`} />
              {level.label}
            </button>
          ))}
        </div>

        {detailMode && (
          <div className="mt-4 flex flex-col gap-3">
            <div>
              <label className={fieldLabel}>{d.medical.note}</label>
              <textarea
                className={`${textInput} mt-1.5 min-h-20 resize-none`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={d.medical.notePlaceholder}
              />
            </div>

            <div>
              <label className={fieldLabel}>{d.medical.attachment}</label>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                {attachments.map((a) => (
                  <span
                    key={a.path}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-white px-3 py-1 text-xs text-slate-600"
                  >
                    <FileText className="h-3 w-3" /> {d.medical.attachmentFile}
                    <button
                      type="button"
                      onClick={() =>
                        setAttachments((prev) => prev.filter((x) => x.path !== a.path))
                      }
                      aria-label={d.medical.removeFile}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-[var(--brand-primary)]/30"
                >
                  {uploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Paperclip className="h-3.5 w-3.5" />
                  )}
                  {d.common.upload}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,application/pdf"
                  className="hidden"
                  onChange={(e) => void handleFileSelect(e)}
                />
              </div>
            </div>

            <button
              type="button"
              disabled={busy}
              onClick={handleSaveDetailed}
              className="self-start rounded-full bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)]"
            >
              {d.common.save}
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {grouped.length === 0 && (
          <p className="py-4 text-sm text-slate-400">{d.common.noEntries}</p>
        )}
        {grouped.map(([day, logs]) => (
          <div key={day}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {day}
            </p>
            <div className="flex flex-col gap-2">
              {logs.map((log) => {
                const level = severityLevels.find((l) => l.value === log.severity);
                return (
                  <article
                    key={log.id}
                    className={`rounded-2xl border-l-4 border border-[#e5e7eb] bg-white p-4 ${
                      level ? level.colorClass.split(" ")[0] : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-[var(--brand-primary)]">
                            {log.symptomType}
                          </h4>
                          {level && (
                            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${level.colorClass}`}>
                              {level.label}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-400">{formatTime(log.loggedAt)}</p>
                      </div>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleDelete(log.id)}
                        className="rounded-full border border-red-200 p-1.5 text-red-600"
                        aria-label={d.medical.removeSymptom}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {log.notes && <p className="mt-2 text-sm text-slate-600">{log.notes}</p>}
                    {log.attachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {log.attachments.map((a) => (
                          <a
                            key={a.path}
                            href={a.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e7eb] px-3 py-1 text-xs font-medium text-[var(--brand-primary)]"
                          >
                            <FileText className="h-3 w-3" /> {d.medical.viewFile}
                          </a>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
