import type { Pet } from "@/lib/dashboard";

/** Keeps a Georgian name from pushing the QR payload past QR version 6. */
const MAX_NAME_LENGTH = 20;

/**
 * The SOS code carries the contact details as plain text rather than a URL.
 * A finder gets the chip number and a callback number straight from the scan —
 * no network, no public profile endpoint, and nothing exposed beyond what the
 * owner already put in the profile.
 */
export function buildSosPayload(pet: Pet, chip: string | null): string {
  const lines = ["AYLOPET SOS", `Dog: ${pet.name.slice(0, MAX_NAME_LENGTH)}`];
  if (chip) lines.push(`Chip: ${chip}`);

  const vet = pet.history?.vet;
  if (vet?.phone) lines.push(`Vet: ${vet.phone}`);
  if (vet?.emergencyPhone) lines.push(`SOS: ${vet.emergencyPhone}`);

  lines.push("aylopet.com");
  return lines.join("\n");
}
