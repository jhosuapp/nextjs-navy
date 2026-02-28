import { prisma } from "./prisma"
import { Prisma } from "@prisma/client"

const TIER_POINTS: Record<string, number> = {
  H1: 70, L1: 50,
  H2: 40, L2: 30,
  H3: 20, L3: 10,
  H4: 7,  L4: 5,
  H5: 2,  L5: 1,
}

export type GameTier = {
  name: string
  tier: string
}

export type StaffInfo = {
  role_name: string
  role_colour: string
  role_id: string
  role_weight: number
}

export type BanInfo = {
  id: number
  reason: string
  applied: string
  expiration: string | null
  permanent: boolean
  is_cheater: boolean
}

export type ProfileData = {
  uuid: string | null
  nick: string
  region: string
  is_premium: boolean
  discord_id: string
  is_staff: boolean
  staff: StaffInfo | null
  ban: BanInfo | null
  games: Record<string, GameTier>
  points: number
}

export function normalizeTierKey(tier: string): string {
  return tier.toUpperCase().replace(/^(\d)([HL])$/, "$2$1")
}

export async function buildProfileData(
  user_id: string,
  uuid: string | null,
  nick: string,
  region: string,
  is_premium: boolean,
  discord_id: string,
): Promise<ProfileData> {
  // Fetch latest tier per game for this user
  const userGames = await prisma.$queryRaw<Array<{ tier: string; game: string }>>`
    WITH ranked_games AS (
      SELECT
        tier,
        game,
        ROW_NUMBER() OVER (PARTITION BY game ORDER BY date DESC) AS rn
      FROM tiers
      WHERE COALESCE(uuid, CONCAT('nick_', nick)) = ${user_id}
        AND tier IS NOT NULL
    )
    SELECT tier, game
    FROM ranked_games
    WHERE rn = 1
  `

  let points = 0
  const games: Record<string, GameTier> = {}

  for (const row of userGames) {
    const key = normalizeTierKey(row.tier)
    points += TIER_POINTS[key] ?? 0
    games[row.game] = { name: row.game, tier: key }
  }

  // Staff check — prefer UUID match, fall back to nick
  const staffWhere: Prisma.staffWhereInput = uuid
    ? { uuid }
    : { nick: { equals: nick, mode: "insensitive" } }

  const staffRecord = await prisma.staff.findFirst({ where: staffWhere })

  const staffInfo: StaffInfo | null = staffRecord
    ? {
        role_name: staffRecord.staff_role_name,
        role_colour: staffRecord.staff_role_colour,
        role_id: staffRecord.staff_role_id,
        role_weight: staffRecord.staff_role_weight,
      }
    : null

  // Active ban check — prefer UUID match, fall back to nick
  const now = new Date()
  const banWhere: Prisma.punishmentsWhereInput = uuid
    ? {
        uuid,
        OR: [{ expiration: null }, { expiration: { gt: now } }],
      }
    : {
        nick,
        OR: [{ expiration: null }, { expiration: { gt: now } }],
      }

  const activeBan = await prisma.punishments.findFirst({
    where: banWhere,
    orderBy: { applied: "desc" },
  })

  const banInfo: BanInfo | null = activeBan
    ? {
        id: activeBan.id,
        reason: activeBan.reason,
        applied: activeBan.applied.toISOString(),
        expiration: activeBan.expiration?.toISOString() ?? null,
        permanent: activeBan.expiration === null,
        is_cheater: activeBan.is_cheater,
      }
    : null

  return {
    uuid,
    nick,
    region,
    is_premium,
    discord_id,
    is_staff: staffRecord !== null,
    staff: staffInfo,
    ban: banInfo,
    games,
    points,
  }
}
