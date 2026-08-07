/** Configurable cap for Early Adopter scarcity messaging */
export const EARLY_ADOPTER_CAP = 200;

/**
 * Public WhatsApp community invite (https://chat.whatsapp.com/...).
 * Set NEXT_PUBLIC_WHATSAPP_GROUP_URL to publish it; the join button stays
 * hidden while it is empty so we never ship a dead invite link.
 */
export const WHATSAPP_GROUP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL ?? "";
