"use client";

import Image from "next/image";
import { Camera, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  addPublicReview,
  listReviews,
  reviewPhotoSrc,
  type UserReview,
} from "@/lib/reviews/store";

const MAX_PHOTO_BYTES = 800_000;

function readPhotoFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_PHOTO_BYTES) {
      reject(new Error("too_large"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function ReviewCard({ item }: { item: UserReview }) {
  const photo = reviewPhotoSrc(item);

  return (
    <blockquote className="flex h-full flex-col overflow-hidden rounded-[var(--radius-organic-xl)] border border-[var(--border-light)] bg-white shadow-soft transition-shadow duration-200 hover:shadow-organic">
      {photo ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--background-secondary)]">
          <Image
            src={photo}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 380px"
            unoptimized={photo.startsWith("data:")}
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          {!photo ? (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand-accent-soft)] text-sm font-bold text-[var(--brand-primary)]">
              {item.authorName.charAt(0)}
            </div>
          ) : null}
          <div>
            <p className="font-medium text-[var(--text-primary)]">{item.authorName}</p>
            {item.dogInfo ? (
              <p className="text-xs text-[var(--text-secondary)]">{item.dogInfo}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 flex gap-0.5" aria-label={`${item.rating} stars`}>
          {Array.from({ length: item.rating }).map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-[var(--trust-gold)] text-[var(--trust-gold)]"
              aria-hidden
            />
          ))}
        </div>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-body)]">
          &ldquo;{item.quote}&rdquo;
        </p>
      </div>
    </blockquote>
  );
}

export function LandingReviewSection() {
  const { dict } = useLocale();
  const copy = dict.reviews;
  const fileRef = useRef<HTMLInputElement>(null);

  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [dogInfo, setDogInfo] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  useEffect(() => {
    setReviews(listReviews());
  }, []);

  const clearPhoto = () => {
    setPhotoPreview(null);
    setPhotoDataUrl(undefined);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handlePhoto = async (file: File | null) => {
    if (!file) return;
    setPhotoError(null);
    try {
      const dataUrl = await readPhotoFile(file);
      setPhotoDataUrl(dataUrl);
      setPhotoPreview(dataUrl);
    } catch {
      setPhotoError(copy.photoTooLarge);
    }
  };

  const handleSubmit = () => {
    if (authorName.trim().length < 2 || quote.trim().length < 10) return;
    addPublicReview({ authorName, dogInfo, quote, rating, photoDataUrl });
    setAuthorName("");
    setDogInfo("");
    setQuote("");
    setRating(5);
    clearPhoto();
    setSaved(true);
    setReviews(listReviews());
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mt-12 space-y-10">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((item) => (
          <ReviewCard key={item.id} item={item} />
        ))}
      </div>

      <div className="rounded-[var(--radius-organic-xl)] border border-[var(--brand-primary)]/15 bg-white p-6 shadow-soft sm:p-8">
        <h3 className="font-display text-xl font-semibold text-[var(--forest-deep)] sm:text-2xl">
          {copy.formTitle}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-body)] sm:text-base">
          {copy.formSubtitle}
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[var(--text-primary)]">{copy.nameLabel}</span>
            <input
              className="mt-1.5 w-full rounded-xl border border-[var(--border-light)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-primary)]/40 focus:ring-2 focus:ring-[var(--brand-primary)]/10"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={copy.namePlaceholder}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[var(--text-primary)]">{copy.dogInfo}</span>
            <input
              className="mt-1.5 w-full rounded-xl border border-[var(--border-light)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-primary)]/40 focus:ring-2 focus:ring-[var(--brand-primary)]/10"
              value={dogInfo}
              onChange={(e) => setDogInfo(e.target.value)}
              placeholder={copy.dogInfoPlaceholder}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">{copy.quote}</span>
            <textarea
              className="mt-1.5 min-h-[120px] w-full resize-y rounded-xl border border-[var(--border-light)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-primary)]/40 focus:ring-2 focus:ring-[var(--brand-primary)]/10"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder={copy.quotePlaceholder}
            />
          </label>

          <div className="sm:col-span-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">{copy.photoLabel}</span>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{copy.photoHint}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {photoPreview ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-[var(--border-light)]">
                  <Image
                    src={photoPreview}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={clearPhoto}
                    className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white"
                    aria-label={copy.removePhoto}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-[var(--border-light)] bg-[var(--background-secondary)] text-[var(--text-secondary)] transition-colors hover:border-[var(--brand-primary)]/30 hover:text-[var(--brand-primary)]"
                >
                  <Camera className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{copy.addPhoto}</span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => void handlePhoto(e.target.files?.[0] ?? null)}
              />
            </div>
            {photoError ? (
              <p className="mt-2 text-xs text-[var(--terracotta)]">{photoError}</p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
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
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={authorName.trim().length < 2 || quote.trim().length < 10}
          className="mt-6 rounded-full bg-[var(--brand-primary)] px-8 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          {saved ? copy.saved : copy.submitReview}
        </button>
      </div>
    </div>
  );
}
