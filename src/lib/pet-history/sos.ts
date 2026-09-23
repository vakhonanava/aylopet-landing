import type { Account, Pet } from "@/lib/dashboard";
import { chipOwnerContact } from "@/lib/pet-history/owner-contact";
import { MAX_QR_PAYLOAD_BYTES } from "@/lib/pet-history/qr";

const encoder = new TextEncoder();

/** Georgian national romanisation (2002), without the ejective apostrophes. */
const GEORGIAN_TO_LATIN: Record<string, string> = {
  ა: "a", ბ: "b", გ: "g", დ: "d", ე: "e", ვ: "v", ზ: "z", თ: "t", ი: "i",
  კ: "k", ლ: "l", მ: "m", ნ: "n", ო: "o", პ: "p", ჟ: "zh", რ: "r", ს: "s",
  ტ: "t", უ: "u", ფ: "p", ქ: "k", ღ: "gh", ყ: "q", შ: "sh", ჩ: "ch", ც: "ts",
  ძ: "dz", წ: "ts", ჭ: "ch", ხ: "kh", ჯ: "j", ჰ: "h",
};

/**
 * Georgian letters cost 3 bytes each, which leaves room for only ~30 of them in
 * the code. Latin transliteration fits about three times as much and reads on
 * any phone. Words are capitalised so names stay recognisable.
 */
export function romanizeGeorgian(text: string): string {
  const latin = Array.from(text, (char) => GEORGIAN_TO_LATIN[char] ?? char).join("");
  return latin.replace(/(^|[\s,.\-/(])([a-z])/g, (_, lead: string, letter: string) =>
    lead + letter.toUpperCase(),
  );
}

function byteLength(text: string): number {
  return encoder.encode(text).length;
}

/**
 * Shortens `text` to fit `maxBytes` of UTF-8, dropping whole words so an
 * address ends at „Tbilisi, Vake“ rather than „Tbilisi, Va“.
 */
function fitBytes(text: string, maxBytes: number): string {
  if (byteLength(text) <= maxBytes) return text;
  const words = text.split(" ");
  while (words.length > 1 && byteLength(words.join(" ")) > maxBytes) {
    words.pop();
  }
  const fitted = words.join(" ").replace(/[\s,.;:-]+$/, "");
  return byteLength(fitted) <= maxBytes ? fitted : "";
}

/**
 * The SOS code carries the contact details as plain text rather than a URL, so
 * a finder gets them straight from the scan with no network or public profile.
 *
 * The encoder tops out at MAX_QR_PAYLOAD_BYTES, so lines go in by priority and
 * whatever doesn't fit is shortened or left out.
 */
export function buildSosPayload(pet: Pet, account: Account | null): string {
  const owner = chipOwnerContact(pet, account);
  const chip = pet.history?.microchip?.code || pet.microchipId || "";

  // The finder needs a way to reach the owner first; the chip number is last
  // since any vet scanner reads it straight from the chip.
  const candidates: [prefix: string, value: string][] = [
    ["Tel: ", owner.phone],
    ["Owner: ", romanizeGeorgian(owner.name)],
    ["Dog: ", romanizeGeorgian(pet.name)],
    ["Addr: ", romanizeGeorgian(owner.address)],
    ["Chip: ", chip],
  ];

  const lines = ["AYLOPET SOS"];
  let used = byteLength(lines[0]);
  for (const [prefix, value] of candidates) {
    if (!value.trim()) continue;
    // +1 for the newline joining this line to the previous one.
    const room = MAX_QR_PAYLOAD_BYTES - used - 1 - byteLength(prefix);
    if (room < 4) break;
    const fitted = fitBytes(value.trim(), room);
    if (!fitted) continue;
    const line = prefix + fitted;
    lines.push(line);
    used += 1 + byteLength(line);
  }
  return lines.join("\n");
}
