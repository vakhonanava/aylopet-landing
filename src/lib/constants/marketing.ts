/** Configurable cap for Early Adopter scarcity messaging */
export const EARLY_ADOPTER_CAP = 200;

/**
 * Public WhatsApp community invite. NEXT_PUBLIC_WHATSAPP_GROUP_URL overrides it
 * (e.g. after the invite is reset); an empty value hides the join buttons.
 */
export const WHATSAPP_GROUP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL?.trim() ??
  "https://chat.whatsapp.com/LDULGwbtHQE1eGi91hJiCC?mode=gi_t";

/** Public support contacts shown in the site footer. */
export const SUPPORT_EMAIL = "support@aylopet.com";
export const SUPPORT_PHONE = "+995568888424";
export const SUPPORT_PHONE_DISPLAY = "568 88 84 24";
