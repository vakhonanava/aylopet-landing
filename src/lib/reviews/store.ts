import { IMAGES } from "@/lib/images";

export type ReviewImageKey = keyof typeof IMAGES;

export interface UserReview {
  id: string;
  email: string;
  authorName: string;
  dogInfo: string;
  quote: string;
  rating: number;
  updatedAt: string;
  /** Built-in image for seed / demo entries */
  imageKey?: ReviewImageKey;
  /** User-uploaded photo (data URL, stored locally) */
  photoDataUrl?: string;
}

const STORAGE_KEY = "aylopet-reviews.v2";

/** No seeded/demo reviews · the wall only shows what real users wrote. */
export const SEED_REVIEWS: UserReview[] = [];

function readAll(): UserReview[] {
  if (typeof window === "undefined") return SEED_REVIEWS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_REVIEWS;
    const parsed = JSON.parse(raw) as UserReview[];
    return parsed.length > 0 ? parsed : SEED_REVIEWS;
  } catch {
    return SEED_REVIEWS;
  }
}

function writeAll(reviews: UserReview[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    // ignore quota errors
  }
}

export function listReviews(): UserReview[] {
  return readAll();
}

export function getReviewByEmail(email: string): UserReview | null {
  const normalized = email.trim().toLowerCase();
  return readAll().find((r) => r.email === normalized) ?? null;
}

export function upsertUserReview(
  email: string,
  authorName: string,
  input: Pick<UserReview, "dogInfo" | "quote" | "rating" | "photoDataUrl">,
): UserReview {
  const normalized = email.trim().toLowerCase();
  const all = readAll();
  const existing = all.find((r) => r.email === normalized);
  const next: UserReview = {
    id: existing?.id ?? `user-${Date.now()}`,
    email: normalized,
    authorName: authorName.trim(),
    dogInfo: input.dogInfo.trim(),
    quote: input.quote.trim(),
    rating: Math.min(5, Math.max(1, input.rating)),
    photoDataUrl: input.photoDataUrl,
    updatedAt: new Date().toISOString(),
  };

  const merged = existing
    ? all.map((r) => (r.email === normalized ? next : r))
    : [next, ...all];

  writeAll(merged);
  return next;
}

export function addPublicReview(input: {
  authorName: string;
  dogInfo: string;
  quote: string;
  rating: number;
  photoDataUrl?: string;
}): UserReview {
  const next: UserReview = {
    id: `pub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    email: `guest-${Date.now()}@local`,
    authorName: input.authorName.trim(),
    dogInfo: input.dogInfo.trim(),
    quote: input.quote.trim(),
    rating: Math.min(5, Math.max(1, input.rating)),
    photoDataUrl: input.photoDataUrl,
    updatedAt: new Date().toISOString(),
  };

  writeAll([next, ...readAll()]);
  return next;
}

export function reviewPhotoSrc(review: UserReview): string | null {
  if (review.photoDataUrl) return review.photoDataUrl;
  if (review.imageKey && review.imageKey in IMAGES) {
    return IMAGES[review.imageKey];
  }
  return null;
}
