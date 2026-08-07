/**
 * Aylopet referral program · single flat tier.
 *
 * There is deliberately no multi-tier ladder: everyone who joins is an
 * Ambassador and receives the same base reward. The only progression is the
 * status upgrade unlocked by inviting ACTIVE_INVITES_FOR_UPGRADE members.
 */

export const AMBASSADOR_TIER_ID = "ambassadors" as const;

/** Points every member receives on joining · no tier maths. */
export const AMBASSADOR_BASE_POINTS = 200;

/** Active invites required to auto-upgrade a member's status. */
export const ACTIVE_INVITES_FOR_UPGRADE = 5;

export interface AmbassadorStatus {
  /** Points currently held · base package plus any earned. */
  points: number;
  /** Invited users who completed registration. */
  activeInvites: number;
  /** True once activeInvites reaches the upgrade threshold. */
  upgraded: boolean;
  /** Invites still needed for the upgrade · 0 once upgraded. */
  invitesToUpgrade: number;
  /** 0 to 1 progress toward the upgrade, for progress bars. */
  progress: number;
}

export function getAmbassadorStatus(
  activeInvites: number,
  earnedPoints = 0,
): AmbassadorStatus {
  const invites = Math.max(0, Math.floor(activeInvites));
  const upgraded = invites >= ACTIVE_INVITES_FOR_UPGRADE;

  return {
    points: AMBASSADOR_BASE_POINTS + Math.max(0, Math.floor(earnedPoints)),
    activeInvites: invites,
    upgraded,
    invitesToUpgrade: upgraded ? 0 : ACTIVE_INVITES_FOR_UPGRADE - invites,
    progress: Math.min(1, invites / ACTIVE_INVITES_FOR_UPGRADE),
  };
}
