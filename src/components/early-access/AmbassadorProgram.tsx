"use client";

import {
  BadgeCheck,
  Check,
  Copy,
  Gift,
  Link2,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { EARLY_ADOPTER_CAP } from "@/lib/constants/marketing";
import {
  ACTIVE_INVITES_FOR_UPGRADE,
  AMBASSADOR_BASE_POINTS,
  getAmbassadorStatus,
  REFERRAL_POINTS,
} from "@/lib/referral/program";
import { buildInviteLink } from "@/lib/referral/storage";
import type { ReferralSummary } from "@/lib/referral/summary";
import { SITE_URL } from "@/lib/seo";

/**
 * Single-tier referral card. Everyone is an Ambassador with the same base
 * package; the only progression is the invite-driven status upgrade.
 */
export function AmbassadorProgram({
  referral = null,
  className = "",
}: {
  /** The member's live numbers · omitted on public pages, where there is no code yet. */
  referral?: ReferralSummary | null;
  className?: string;
}) {
  const { dict } = useLocale();
  const a = dict.ambassador;
  const status = getAmbassadorStatus(
    referral?.completed ?? 0,
    referral?.earnedPoints ?? 0,
  );
  const pointsPerInvite = referral?.pointsPerInvite || REFERRAL_POINTS;
  // Founding benefits belong to the first EARLY_ADOPTER_CAP members only.
  const foundingNumber =
    referral && referral.ambassadorNumber > 0 && referral.ambassadorNumber <= EARLY_ADOPTER_CAP
      ? referral.ambassadorNumber
      : null;

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
            {(referral?.earnedPoints ?? 0) > 0
              ? a.totalPointsLabel
              : a.basePointsLabel}
          </span>
        </span>
      </div>

      {foundingNumber ? (
        <div className="mt-5 rounded-2xl border border-[var(--terracotta)]/30 bg-[var(--terracotta)]/[0.06] p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--terracotta)]">
            <BadgeCheck className="h-4 w-4" aria-hidden />
            {a.foundingEyebrow}
          </p>
          <p className="mt-2 font-display text-lg font-semibold text-[var(--forest-deep)]">
            {a.foundingNumber
              .replace("{number}", String(foundingNumber))
              .replace("{cap}", String(EARLY_ADOPTER_CAP))}
          </p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            {a.foundingIntro.replace("{cap}", String(EARLY_ADOPTER_CAP))}
          </p>
          <ul className="mt-3 space-y-2">
            {a.foundingBenefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-2 text-sm leading-relaxed text-[var(--text-body)]"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--status-emerald)]"
                  aria-hidden
                />
                {benefit
                  .replace("{points}", String(AMBASSADOR_BASE_POINTS))
                  .replace("{perInvite}", String(pointsPerInvite))
                  .replace("{invites}", String(ACTIVE_INVITES_FOR_UPGRADE))}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {referral?.code ? (
        <InviteCode
          code={referral.code}
          completed={referral.completed}
          pending={referral.pending}
        />
      ) : null}

      <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-[var(--text-body)]">
        <Gift
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--terracotta)]"
          aria-hidden
        />
        {a.perInviteRule.replace("{points}", String(pointsPerInvite))}
      </p>

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

function InviteCode({
  code,
  completed,
  pending,
}: {
  code: string;
  completed: number;
  pending: number;
}) {
  const { dict } = useLocale();
  const a = dict.ambassador;
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  // Always the production URL, even when shared from a preview deployment.
  const link = buildInviteLink(SITE_URL, code);
  const message = `${a.shareText.replace("{code}", code)} ${link}`;

  const copy = async (what: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(what === "code" ? code : link);
      setCopied(what);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied) · the code stays visible to copy by hand.
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: message });
        return;
      } catch {
        // Dismissed share sheet · nothing to do.
        return;
      }
    }
    await copy("link");
  };

  const buttonClass =
    "inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-[var(--border-light)] bg-white px-4 py-2 text-xs font-semibold text-[var(--brand-primary)] transition-colors hover:border-[var(--brand-primary)]/30 hover:bg-[var(--background-secondary)]";

  return (
    <div className="mt-4 rounded-2xl border border-dashed border-[var(--brand-primary)]/30 bg-[var(--brand-accent-soft)]/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
        {a.codeLabel}
      </p>
      <p className="mt-1 select-all font-mono text-2xl font-bold tracking-wider text-[var(--forest-deep)]">
        {code}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => void copy("code")} className={buttonClass}>
          {copied === "code" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied === "code" ? a.copied : a.copyCode}
        </button>
        <button type="button" onClick={() => void copy("link")} className={buttonClass}>
          {copied === "link" ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
          {copied === "link" ? a.copied : a.copyLink}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp
        </a>
        <button type="button" onClick={() => void share()} className={`${buttonClass} sm:hidden`}>
          {a.share}
        </button>
      </div>

      <p className="mt-3 text-sm text-[var(--text-body)]">
        <span className="font-semibold text-[var(--forest-deep)]">{completed}</span>{" "}
        {a.invitedLabel}
        {pending > 0 ? (
          <span className="text-[var(--text-secondary)]">
            {" · "}
            {a.pendingLabel.replace("{count}", String(pending))}
          </span>
        ) : null}
      </p>
    </div>
  );
}
