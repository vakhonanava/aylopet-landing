"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessagesSquare, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Chip,
  EmptyState,
  SectionCard,
  StatusPill,
} from "@/components/dashboard/history/ui";
import { formatDate } from "@/lib/dashboard";
import {
  CONSULTATION_STATUS,
  INSIGHT_PRIORITY,
  INSIGHT_SOURCE_LABELS,
} from "@/lib/pet-history/labels";
import type {
  AiConsultationThread,
  AiInsight,
} from "@/lib/pet-history/types";

function InsightCard({ insight }: { insight: AiInsight }) {
  const tone = INSIGHT_PRIORITY[insight.priority];
  return (
    <motion.li
      layout
      className="rounded-2xl border border-[#eceae5] bg-white p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--brand-primary)]">
          {insight.title}
        </p>
        <StatusPill tone={tone} />
      </div>
      <p className="mt-1.5 text-sm text-slate-500">{insight.body}</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {insight.sources.map((source) => (
          <Chip key={source}>{INSIGHT_SOURCE_LABELS[source]}</Chip>
        ))}
        <span className="text-xs text-slate-400">
          {formatDate(insight.generatedAt)}
        </span>
      </div>
    </motion.li>
  );
}

function ThreadRow({ thread }: { thread: AiConsultationThread }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="rounded-2xl border border-[#eceae5] bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[var(--brand-primary)]">
            {thread.topic}
          </p>
          <p className="text-xs text-slate-400">
            {formatDate(thread.startedAt)}, {thread.messageCount} შეტყობინება
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusPill tone={CONSULTATION_STATUS[thread.status]} />
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#f0eeea] px-4 py-3">
              <p className="text-sm text-slate-500">{thread.summary}</p>
              {thread.recommendations.length > 0 ? (
                <ul className="mt-3 space-y-1.5">
                  {thread.recommendations.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-sm text-slate-600"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}

interface AiInsightsPanelProps {
  consultations: AiConsultationThread[];
  insights: AiInsight[];
}

export function AiInsightsPanel({
  consultations,
  insights,
}: AiInsightsPanelProps) {
  const hasContent = consultations.length > 0 || insights.length > 0;

  return (
    <SectionCard
      id="ai"
      icon={Sparkles}
      title="AylopetAI, რჩევები და კონსულტაციები"
      description="24/7 პრევენციული ანალიზი დნმ-ის, წონისა და საყელოს მონაცემების საფუძველზე."
    >
      {!hasContent ? (
        <EmptyState
          icon={MessagesSquare}
          title="კონსულტაციები ჯერ არ არის"
          body="დაუსვი შეკითხვა AylopetAI-ს. ყველა საუბარი და რეკომენდაცია აქ შეინახება."
          action={
            <Link
              href="/products/aylopet-ai#chat"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
            >
              <Sparkles className="h-4 w-4" /> AylopetAI-ის გახსნა
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {insights.length > 0 ? (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[var(--brand-primary)]">
                პრევენციული რჩევები
              </h3>
              <ul className="space-y-2">
                {insights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </ul>
            </div>
          ) : null}

          {consultations.length > 0 ? (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[var(--brand-primary)]">
                კონსულტაციების ისტორია
              </h3>
              <ul className="space-y-2">
                {consultations.map((thread) => (
                  <ThreadRow key={thread.id} thread={thread} />
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </SectionCard>
  );
}
