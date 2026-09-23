import type { Account, Pet } from "@/lib/dashboard";

export interface OwnerContact {
  name: string;
  phone: string;
  address: string;
}

/**
 * Who to call if the dog is found. Whatever the owner saved in the chip
 * section wins; otherwise fall back to the account profile.
 */
export function chipOwnerContact(pet: Pet, account: Account | null): OwnerContact {
  const chip = pet.history?.microchip;
  return {
    name: chip?.ownerName?.trim() || account?.name?.trim() || "",
    phone: chip?.ownerPhone?.trim() || account?.phone?.trim() || "",
    address: chip?.ownerAddress?.trim() || "",
  };
}
