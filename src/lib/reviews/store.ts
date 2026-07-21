export interface UserReview {
  id: string;
  email: string;
  authorName: string;
  dogInfo: string;
  quote: string;
  rating: number;
  updatedAt: string;
}

const STORAGE_KEY = "aylopet-reviews.v1";

export const SEED_REVIEWS: UserReview[] = [
  {
    id: "seed-1",
    email: "seed@aylopet.ge",
    authorName: "ნინო კ.",
    dogInfo: "ბელი · Golden Retriever",
    quote:
      "რექსის ენერგია და ბეწვის ხარისხი ნამდვილად შეიცვალა. პორციები ზუსტად მისი წონის მიხედვითაა.",
    rating: 5,
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "seed-2",
    email: "seed2@aylopet.ge",
    authorName: "გიორგი მ.",
    dogInfo: "ლუკა · French Bulldog",
    quote:
      "ყველაზე მომწონს, რომ ყველაფერი ერთ აპშია · კვება, ვაქცინები და AI რჩევები.",
    rating: 5,
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "seed-3",
    email: "seed3@aylopet.ge",
    authorName: "მარიამ თ.",
    dogInfo: "ჩიპი · Mixed breed",
    quote:
      "Early Adopter პროგრამამ საშუაღამოს კონსულტაცია მოგვცა. პირველი კვილი უკვე შედეგიანია.",
    rating: 5,
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

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
    // ignore
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
  input: Pick<UserReview, "dogInfo" | "quote" | "rating">,
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
    updatedAt: new Date().toISOString(),
  };

  const merged = existing
    ? all.map((r) => (r.email === normalized ? next : r))
    : [next, ...all];

  writeAll(merged);
  return next;
}
