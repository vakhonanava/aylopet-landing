"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAdopterSession } from "@/lib/adopter-session";
import {
  getReviewByEmail,
  listReviews,
  upsertUserReview,
  type UserReview,
} from "@/lib/reviews/store";

export function UserReviewEditor({ onSaved }: { onSaved?: () => void }) {
  const { dict } = useLocale();
  const copy = dict.reviews;
  const { user, ready, displayName, email } = useAuth();
  const [adopterOk, setAdopterOk] = useState(false);
  const [dogInfo, setDogInfo] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const session = getAdopterSession();
      setAdopterOk(session !== null || user !== null);
      if (user?.email) {
        const existing = getReviewByEmail(user.email);
        if (existing) {
          setDogInfo(existing.dogInfo);
          setQuote(existing.quote);
          setRating(existing.rating);
        } else if (session) {
          setDogInfo(`${session.dogName} · `);
        }
      }
    });
  }, [user]);

  if (!ready) return null;

  const canEdit = user && adopterOk;

  if (!canEdit) {
    return (
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 text-center shadow-soft">
        <p className="text-sm text-[var(--text-body)]">{copy.loginPrompt}</p>
        <Link
          href="/onboarding/platform"
          className="mt-4 inline-flex rounded-full bg-[var(--brand-primary)] px-6 py-2.5 text-sm font-medium text-white"
        >
          {copy.loginCta}
        </Link>
      </div>
    );
  }

  const handleSave = () => {
    if (!user?.email || quote.trim().length < 10 || dogInfo.trim().length < 3) return;
    upsertUserReview(user.email, displayName, { dogInfo, quote, rating });
    setSaved(true);
    onSaved?.();
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 shadow-soft">
      <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
        {copy.editTitle}
      </h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">{copy.editSubtitle}</p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[var(--text-primary)]">{copy.dogInfo}</span>
          <input
            className="mt-1.5 w-full rounded-xl border border-[var(--border-light)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-primary)]/40 focus:ring-2 focus:ring-[var(--brand-primary)]/10"
            value={dogInfo}
            onChange={(e) => setDogInfo(e.target.value)}
            placeholder={copy.dogInfoPlaceholder}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[var(--text-primary)]">{copy.quote}</span>
          <textarea
            className="mt-1.5 min-h-[100px] w-full resize-y rounded-xl border border-[var(--border-light)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-primary)]/40 focus:ring-2 focus:ring-[var(--brand-primary)]/10"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder={copy.quotePlaceholder}
          />
        </label>
        <div>
          <span className="text-sm font-medium text-[var(--text-primary)]">{copy.rating}</span>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} stars`}
                className="rounded p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-6 w-6 ${n <= rating ? "fill-[var(--trust-gold)] text-[var(--trust-gold)]" : "text-[var(--border-light)]"}`}
                />
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={quote.trim().length < 10}
          className="rounded-full bg-[var(--brand-primary)] px-6 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          {saved ? copy.saved : copy.save}
        </button>
      </div>
    </div>
  );
}

export function ReviewsList() {
  const { dict } = useLocale();
  const copy = dict.reviews;
  const [reviews, setReviews] = useState<UserReview[]>([]);

  useEffect(() => {
    queueMicrotask(() => setReviews(listReviews()));
  }, []);

  if (reviews.length === 0) {
    return <p className="text-center text-sm text-[var(--text-secondary)]">{copy.noReviews}</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {reviews.map((item) => (
        <blockquote
          key={item.id}
          className="flex h-full flex-col rounded-2xl border border-[var(--border-light)] bg-white p-6 shadow-soft"
        >
          <div className="flex gap-0.5" aria-label={`${item.rating} stars`}>
            {Array.from({ length: item.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[var(--trust-gold)] text-[var(--trust-gold)]" aria-hidden />
            ))}
          </div>
          <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--text-body)]">
            &ldquo;{item.quote}&rdquo;
          </p>
          <footer className="mt-5 border-t border-[var(--border-light)] pt-4">
            <cite className="not-italic">
              <p className="font-medium text-[var(--text-primary)]">{item.authorName}</p>
              <p className="text-xs text-[var(--text-secondary)]">{item.dogInfo}</p>
            </cite>
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
