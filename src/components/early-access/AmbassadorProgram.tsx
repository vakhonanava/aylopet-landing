"use client";

import { Gift, Sparkles, Users } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  ACTIVE_INVITES_FOR_UPGRADE,
  getAmbassadorStatus,
} from "@/lib/referral/program";

/**
 * Single-tier referral card. Everyone is an Ambassador with the same base
 * package; the only progression is the invite-driven status upgrade.
 */
export function AmbassadorProgram({
  activeInvites = 0,
  earnedPoints = 0,
  className = "",
}: {
  activeInvites?: number;
  earnedPoints?: number;
  className?: string;
}) {
  const { dict } = useLocale();
  const a = dict.ambassador;
  const status = getAmbassadorStatus(activeInvites, earnedPoints);

  return (
    <section
      className={`rounded-[var(--radius-organic-xl)] border border-[var(--border-light)] bg-white p-6 text-left shadow-soft ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--terracotta)]">
        {a.eyebrow}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--forest-deep)] px-4 py-1.5 text-sm font-semibold text-white">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {a.tierName}
        </span>
        {status.upgraded ? (
          <span className="rounded-full bg-[var(--status-emerald)]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--status-emerald)]">
            {a.upgradedLabel}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-[var(--text-body)]">
        {a.intro}
      </p>

      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[var(--border-light)] bg-[var(--background-secondary)] px-4 py-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
          <Gift className="h-4 w-4" aria-hidden />
        </span>
        <span>
          <span className="block font-display text-2xl font-semibold text-[var(--forest-deep)]">
            {status.points} <span className="text-base">{a.pointsSuffix}</span>
          </span>
          <span className="block text-xs text-[var(--text-secondary)]">
            {a.basePointsLabel}
          </span>
        </span>
      </div>

      <div className="mt-4">
        <p className="flex items-start gap-2 text-sm leading-relaxed text-[var(--text-body)]">
          <Users
            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-primary)]"
            aria-hidden
          />
          {a.upgradeRule.replace("{count}", String(ACTIVE_INVITES_FOR_UPGRADE))}
        </p>

        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--background-secondary)]"
          role="progressbar"
          aria-valuenow={status.activeInvites}
          aria-valuemin={0}
          aria-valuemax={ACTIVE_INVITES_FOR_UPGRADE}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--terracotta)] to-[var(--brand-primary)] transition-[width] duration-700"
            style={{ width: `${Math.round(status.progress * 100)}%` }}
          />
        </div>
        {!status.upgraded ? (
          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            {a.progressLabel.replace(
              "{count}",
              String(status.invitesToUpgrade),
            )}
          </p>
        ) : null}
      </div>
    </section>
  );
}
