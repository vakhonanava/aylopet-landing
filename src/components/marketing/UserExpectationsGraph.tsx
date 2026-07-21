"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Dna,
  MessageSquare,
  Radio,
  Stethoscope,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { submitExpectationVote } from "@/app/project-status/actions";
import { getAdopterSession } from "@/lib/adopter-session";
import {
  EXPECTATION_OPTION_IDS,
  type ExpectationOptionId,
  type ExpectationStats,
} from "@/lib/expectations/types";
import { fadeUp, staggerContainer } from "@/lib/motion";

const VOTE_STORAGE_KEY = "aylopet-expectation-vote.v1";
const SESSION_STORAGE_KEY = "aylopet-expectation-session.v1";

const OPTION_META: Record<
  ExpectationOptionId,
  { icon: LucideIcon; color: string }
> = {
  "fresh-food": { icon: UtensilsCrossed, color: "var(--terracotta)" },
  "aylopet-ai": { icon: Brain, color: "var(--brand-primary)" },
  dna: { icon: Dna, color: "var(--status-emerald)" },
  "smart-collar": { icon: Radio, color: "var(--terracotta-bright)" },
  "vet-consult": { icon: Stethoscope, color: "var(--forest-deep)" },
  other: { icon: MessageSquare, color: "var(--text-secondary)" },
};

function getOrCreateSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const id = `ses_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_STORAGE_KEY, id);
    return id;
  } catch {
    return `ses_${Date.now()}`;
  }
}

function getStoredVote(): ExpectationOptionId | null {
  try {
    const raw = localStorage.getItem(VOTE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { optionId?: ExpectationOptionId };
    return parsed.optionId ?? null;
  } catch {
    return null;
  }
}

function storeVote(optionId: ExpectationOptionId): void {
  try {
    localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify({ optionId }));
  } catch {
    // ignore quota errors
  }
}

export function UserExpectationsGraph({
  initialStats,
}: {
  initialStats: ExpectationStats;
}) {
  const { dict } = useLocale();
  const t = dict.userExpectations;

  const [stats, setStats] = useState(initialStats);
  const [selected, setSelected] = useState<ExpectationOptionId | null>(null);
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState("");

  const optionLabels = useMemo(
    () => ({
      "fresh-food": t.freshFood,
      "aylopet-ai": t.aylopetAi,
      dna: t.dna,
      "smart-collar": t.smartCollar,
      "vet-consult": t.vetConsult,
      other: t.other,
    }),
    [t],
  );

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
    const stored = getStoredVote();
    if (stored) {
      setSelected(stored);
      setHasVoted(true);
    }
    const adopter = getAdopterSession();
    if (adopter?.email) setEmail(adopter.email);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selected || !sessionId) {
      setError(t.selectOption);
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await submitExpectationVote({
      optionId: selected,
      sessionId,
      email: email.trim() || undefined,
      note: note.trim() || undefined,
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setStats(result.stats);
    storeVote(selected);
    setHasVoted(true);
    if (result.alreadyVoted) {
      setError(t.alreadyVoted);
    }
  }, [selected, sessionId, email, note, t]);

  const showResults = hasVoted || stats.total > 0;

  return (
    <section className="relative mx-auto max-w-3xl px-6 pb-16 lg:px-8">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="rounded-[2rem] border border-[var(--border-light)] bg-white/80 p-6 shadow-[0_20px_60px_rgba(45,74,62,0.08)] backdrop-blur-sm sm:p-8"
        style={{
          transform: "perspective(1200px) rotateX(1deg)",
        }}
      >
        <motion.div variants={fadeUp} className="text-center">
          <span className="inline-flex items-center rounded-full bg-[var(--brand-primary)]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)]">
            {t.eyebrow}
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[var(--forest-deep)] sm:text-3xl">
            {t.question}
          </h2>
          <p className="mt-2 text-sm text-[var(--text-body)]">{t.subtitle}</p>
        </motion.div>

        {!hasVoted && (
          <motion.div variants={fadeUp} className="mt-6">
            <div className="grid gap-2 sm:grid-cols-2">
              {EXPECTATION_OPTION_IDS.map((id) => {
                const meta = OPTION_META[id];
                const Icon = meta.icon;
                const active = selected === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelected(id)}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                      active
                        ? "border-[var(--brand-primary)] bg-[var(--brand-accent-soft)]/60 shadow-sm"
                        : "border-[var(--border-light)] bg-white hover:border-[var(--brand-primary)]/30 hover:bg-[var(--brand-accent-soft)]/30"
                    }`}
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${meta.color} 15%, white)`,
                        color: meta.color,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-[var(--forest-deep)]">
                      {optionLabels[id]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                  {t.noteLabel}
                </span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t.notePlaceholder}
                  rows={2}
                  maxLength={300}
                  className="mt-1.5 w-full resize-none rounded-xl border border-[var(--border-light)] bg-white px-4 py-2.5 text-sm text-[var(--forest-deep)] outline-none ring-[var(--brand-primary)]/30 transition focus:ring-2"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                  {t.emailLabel}{" "}
                  <span className="font-normal normal-case text-[var(--text-body)]">
                    {t.emailOptional}
                  </span>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="mt-1.5 w-full rounded-xl border border-[var(--border-light)] bg-white px-4 py-2.5 text-sm text-[var(--forest-deep)] outline-none ring-[var(--brand-primary)]/30 transition focus:ring-2"
                />
              </label>
            </div>

            {error && (
              <p className="mt-3 text-center text-sm text-[var(--terracotta)]">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !selected}
              className="mt-4 w-full rounded-full bg-[var(--terracotta)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(198,123,92,0.25)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? t.submitting : t.submit}
            </button>
          </motion.div>
        )}

        {hasVoted && !error && (
          <motion.p
            variants={fadeUp}
            className="mt-4 text-center text-sm font-semibold text-[var(--brand-primary)]"
          >
            {t.voted}
          </motion.p>
        )}

        {showResults && (
          <motion.div variants={fadeUp} className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                {t.resultsTitle}
              </h3>
              <p className="text-xs text-[var(--text-body)]">
                {t.totalVotes}:{" "}
                <span className="font-semibold text-[var(--forest-deep)]">
                  {stats.total}
                </span>
              </p>
            </div>

            <ul className="mt-4 space-y-3">
              {EXPECTATION_OPTION_IDS.map((id) => {
                const pct = stats.percentages[id];
                const count = stats.counts[id];
                const meta = OPTION_META[id];
                const Icon = meta.icon;
                const isUserChoice = hasVoted && selected === id;

                return (
                  <li key={id}>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-medium text-[var(--forest-deep)]">
                        <Icon
                          className="h-4 w-4"
                          style={{ color: meta.color }}
                        />
                        {optionLabels[id]}
                        {isUserChoice && (
                          <span className="rounded-full bg-[var(--brand-primary)]/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--brand-primary)]">
                            ✓
                          </span>
                        )}
                      </span>
                      <span className="text-xs font-semibold tabular-nums text-[var(--text-secondary)]">
                        {pct}% · {t.voteCount.replace("{count}", String(count))}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-[var(--brand-accent-soft)]/60">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${meta.color}, color-mix(in srgb, ${meta.color} 70%, white))`,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
