export interface AdopterSession {
  ownerName: string;
  email: string;
  dogName: string;
  position?: number;
  registeredAt: string;
}

const STORAGE_KEY = "aylopet-adopter.v1";

export function saveAdopterSession(session: AdopterSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore quota errors
  }
}

export function getAdopterSession(): AdopterSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdopterSession;
  } catch {
    return null;
  }
}

export function isAdopterRegistered(): boolean {
  return getAdopterSession() !== null;
}
