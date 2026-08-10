"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  BatteryMedium,
  Flame,
  Footprints,
  MapPin,
  Moon,
  Radio,
  Route,
  Waves,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import {
  Chip,
  EmptyState,
  MetricTile,
  SectionCard,
  StatusPill,
} from "@/components/dashboard/history/ui";
import { formatDate } from "@/lib/dashboard";
import {
  BEHAVIOUR_LABELS,
  COLLAR_STATUS,
  COMING_SOON,
  SAFE_ZONE_STATE,
} from "@/lib/pet-history/labels";
import type {
  BehaviouralLog,
  DailyActivityMetrics,
  SmartCollarMetrics,
} from "@/lib/pet-history/types";

/** Beyond this swing from personal baseline, a signal is worth surfacing. */
const DEVIATION_ALERT_PERCENT = 40;

function deviation(log: BehaviouralLog): number | null {
  if (log.baseline <= 0) return null;
  return ((log.count - log.baseline) / log.baseline) * 100;
}

function StepsBars({ history }: { history: DailyActivityMetrics[] }) {
  const reduceMotion = useReducedMotion();
  const days = useMemo(
    () =>
      [...history]
        .sort((a, b) => (a.date < b.date ? -1 : 1))
        .slice(-7),
    [history],
  );

  if (days.length === 0) return null;
  const max = Math.max(...days.map((day) => day.steps), 1);

  return (
    <div className="rounded-2xl border border-[#eceae5] bg-white px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        ბოლო {days.length} დღე, ნაბიჯები
      </p>
      {/* Bars and labels are separate rows: a percentage height only resolves
          against a parent with a definite height, so the bar track must be the
          `h-24` element itself, not a column that also holds the label. */}
      <div className="mt-4 flex h-24 items-end gap-2">
        {days.map((day, index) => (
          <div key={day.date} className="flex h-full flex-1 items-end">
            <motion.div
              className="w-full rounded-t-lg bg-[var(--brand-primary)]/80"
              initial={reduceMotion ? false : { height: 0 }}
              animate={{ height: `${Math.max(4, (day.steps / max) * 100)}%` }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              title={`${day.steps.toLocaleString("ka-GE")} ნაბიჯი`}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-2">
        {days.map((day) => (
          <span
            key={day.date}
            className="flex-1 text-center text-[10px] text-slate-400"
          >
            {new Date(day.date).toLocaleDateString("ka-GE", {
              weekday: "narrow",
            })}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CollarPanel({ collar }: { collar: SmartCollarMetrics | null }) {
  // The collar has not shipped yet, so there is nothing to pair with. The
  // section stays visible as a preview of what lands, but offers no action
  // that would imply the device is buyable or connectable today.
  if (!collar || collar.device.status === "not_paired") {
    return (
      <SectionCard
        id="collar"
        icon={Radio}
        title="Aylopet Smart Collar"
        description="აქტივობა, ძილი, GPS და ქცევითი სიგნალები."
        action={<StatusPill tone={COMING_SOON} />}
      >
        <EmptyState
          icon={Radio}
          title="Smart Collar მალე"
          body="საყელო ჯერ არ არის ხელმისაწვდომი. ამოქმედებისთანავე აქ გამოჩნდება ნაბიჯები, დისტანცია, ძილის ხარისხი, უსაფრთხო ზონები და ქცევითი ანალიზი რეალურ დროში."
          action={
            <Link
              href="/products/smart-collar"
              className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-5 py-2.5 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:border-[var(--brand-primary)]/30"
            >
              <Radio className="h-4 w-4" /> გაიგე მეტი
            </Link>
          }
        />
      </SectionCard>
    );
  }

  const { device, today, safeZones, lastFix, behaviour } = collar;
  const alerts = behaviour.filter((log) => {
    const value = deviation(log);
    return value !== null && Math.abs(value) >= DEVIATION_ALERT_PERCENT;
  });

  return (
    <SectionCard
      id="collar"
      icon={Radio}
      title="Aylopet Smart Collar"
      description={
        device.lastSyncAt
          ? `ბოლო სინქრონიზაცია ${formatDate(device.lastSyncAt)}`
          : "აქტივობა, ძილი, GPS და ქცევითი სიგნალები."
      }
      action={
        <div className="flex items-center gap-2">
          <StatusPill tone={COLLAR_STATUS[device.status]} />
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <BatteryMedium className="h-3.5 w-3.5" />
            {device.batteryPercent}%
          </span>
        </div>
      }
    >
      {today ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile
            icon={Footprints}
            label="ნაბიჯები"
            value={today.steps.toLocaleString("ka-GE")}
            sub={`${today.activeMinutes} აქტიური წუთი`}
          />
          <MetricTile
            icon={Route}
            label="დისტანცია"
            value={today.distanceKm.toFixed(1)}
            unit="კმ"
          />
          <MetricTile
            icon={Flame}
            label="დაწვული კალორია"
            value={today.caloriesBurned}
            unit="kcal"
          />
          <MetricTile
            icon={Moon}
            label="ძილის ხარისხი"
            value={today.sleepScore}
            unit="/100"
            sub={`${today.sleepHours} სთ ძილი`}
          />
        </div>
      ) : (
        <p className="rounded-2xl bg-[#FAFAF8] px-4 py-3 text-sm text-slate-400">
          დღევანდელი მონაცემები ჯერ არ სინქრონიზებულა.
        </p>
      )}

      {collar.history.length > 0 ? (
        <div className="mt-4">
          <StepsBars history={collar.history} />
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#eceae5] bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)]">
            <MapPin className="h-4 w-4" /> GPS და უსაფრთხო ზონები
          </h3>

          {lastFix ? (
            <p className="mt-3 rounded-2xl bg-[#FAFAF8] px-4 py-3 text-xs text-slate-500">
              ბოლო კოორდინატი{" "}
              <span className="font-mono text-[var(--brand-primary)]">
                {lastFix.latitude.toFixed(4)}, {lastFix.longitude.toFixed(4)}
              </span>
              {`, სიზუსტე ±${lastFix.accuracyMeters} მ`}
            </p>
          ) : (
            <p className="mt-3 text-sm text-slate-400">
              კოორდინატი ჯერ არ მიღებულა.
            </p>
          )}

          <ul className="mt-3 space-y-2">
            {safeZones.map((zone) => (
              <li
                key={zone.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-[#FAFAF8] px-4 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--brand-primary)]">
                    {zone.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    რადიუსი {zone.radiusMeters} მ
                  </p>
                </div>
                <StatusPill tone={SAFE_ZONE_STATE[zone.state]} />
              </li>
            ))}
            {safeZones.length === 0 ? (
              <li className="text-sm text-slate-400">
                უსაფრთხო ზონა დაყენებული არ არის.
              </li>
            ) : null}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#eceae5] bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)]">
            <Waves className="h-4 w-4" /> ქცევითი სიგნალები
          </h3>

          {alerts.length > 0 ? (
            <p className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
              <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {alerts.length} სიგნალი მკვეთრად გადაუხვია ჩვეულ ნორმას.
            </p>
          ) : null}

          <ul className="mt-3 space-y-2">
            {behaviour.map((log) => {
              const value = deviation(log);
              return (
                <li
                  key={log.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-[#FAFAF8] px-4 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--brand-primary)]">
                      {BEHAVIOUR_LABELS[log.signal]}
                    </p>
                    <p className="text-xs text-slate-400">
                      {log.count} ეპიზოდი, ნორმა {log.baseline}
                    </p>
                  </div>
                  {value !== null ? (
                    <Chip
                      tone={
                        Math.abs(value) >= DEVIATION_ALERT_PERCENT
                          ? "warning"
                          : "neutral"
                      }
                    >
                      {value > 0 ? "+" : ""}
                      {Math.round(value)}%
                    </Chip>
                  ) : null}
                </li>
              );
            })}
            {behaviour.length === 0 ? (
              <li className="text-sm text-slate-400">
                ქცევითი ჩანაწერი ჯერ არ არის.
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </SectionCard>
  );
}
