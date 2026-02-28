import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/config/lib/prisma"
import { withRateLimit } from "@/config/lib/rateLimit"
import { getCache, setCache } from "@/config/lib/cache"
import { normalizeTierKey } from "@/config/lib/profileHelper"

const TIER_POINTS: Record<string, number> = {
  H1: 70, L1: 50,
  H2: 40, L2: 30,
  H3: 20, L3: 10,
  H4: 7,  L4: 5,
  H5: 2,  L5: 1,
}

const CACHE_TTL = 300 // 5 minutes

type GameRanking = {
  tier: string
  position: number
}

type RankingsResponse = {
  uuid: string
  nick: string
  overall: {
    points: number
    position: number
  }
  games: Record<string, GameRanking>
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const uuid = typeof req.query.uuid === "string" ? req.query.uuid.trim() : null

  if (!uuid) {
    return res.status(400).json({ message: "Missing uuid" })
  }

  try {
    const cacheKey = `profile:uuid:${uuid}:rankings`
    const cached = await getCache<RankingsResponse>(cacheKey)
    if (cached) {
      return res.status(200).json(cached)
    }

    // Fetch latest player nick from tiers
    const [latest] = await prisma.$queryRaw<Array<{ nick: string }>>`
      SELECT nick FROM tiers
      WHERE uuid = ${uuid} AND nick IS NOT NULL
      ORDER BY date DESC
      LIMIT 1
    `

    if (!latest) {
      return res.status(404).json({ message: "Player not found" })
    }

    const nick = latest.nick

    // Fetch latest tier per game for this user
    const userGames = await prisma.$queryRaw<Array<{ tier: string; game: string }>>`
      WITH ranked_games AS (
        SELECT
          tier,
          game,
          ROW_NUMBER() OVER (PARTITION BY game ORDER BY date DESC) AS rn
        FROM tiers
        WHERE uuid = ${uuid}
          AND tier IS NOT NULL
      )
      SELECT tier, game
      FROM ranked_games
      WHERE rn = 1
    `

    let totalPoints = 0
    const gameTiers: Record<string, string> = {}

    for (const row of userGames) {
      const key = normalizeTierKey(row.tier)
      totalPoints += TIER_POINTS[key] ?? 0
      gameTiers[row.game] = key
    }

    // Fetch latest date for tie-breaking
    const [dateData] = await prisma.$queryRaw<[{ latest_date: Date }]>`
      SELECT MAX(date) as latest_date
      FROM tiers
      WHERE uuid = ${uuid}
    `
    const latestDate = dateData.latest_date

    // Calculate overall position
    const [positionData] = await prisma.$queryRaw<[{ position: bigint }]>`
      WITH latest_tiers AS (
        SELECT
          COALESCE(uuid, CONCAT('nick_', nick)) AS user_id,
          tier,
          game,
          date,
          ROW_NUMBER() OVER (
            PARTITION BY COALESCE(uuid, CONCAT('nick_', nick)), game
            ORDER BY date DESC
          ) AS rn
        FROM tiers
        WHERE nick IS NOT NULL AND tier IS NOT NULL
      ),
      user_points AS (
        SELECT
          user_id,
          MAX(date) AS latest_date,
          SUM(
            CASE
              WHEN UPPER(tier) IN ('H1', '1H') THEN 70
              WHEN UPPER(tier) IN ('L1', '1L') THEN 50
              WHEN UPPER(tier) IN ('H2', '2H') THEN 40
              WHEN UPPER(tier) IN ('L2', '2L') THEN 30
              WHEN UPPER(tier) IN ('H3', '3H') THEN 20
              WHEN UPPER(tier) IN ('L3', '3L') THEN 10
              WHEN UPPER(tier) IN ('H4', '4H') THEN 7
              WHEN UPPER(tier) IN ('L4', '4L') THEN 5
              WHEN UPPER(tier) IN ('H5', '5H') THEN 2
              WHEN UPPER(tier) IN ('L5', '5L') THEN 1
              ELSE 0
            END
          ) AS points
        FROM latest_tiers
        WHERE rn = 1
        GROUP BY user_id
      ),
      user_data AS (
        SELECT
          t.nick,
          up.user_id,
          up.points,
          up.latest_date
        FROM user_points up
        INNER JOIN (
          SELECT
            COALESCE(uuid, CONCAT('nick_', nick)) AS user_id,
            nick,
            ROW_NUMBER() OVER (
              PARTITION BY COALESCE(uuid, CONCAT('nick_', nick))
              ORDER BY date DESC
            ) AS rn
          FROM tiers
        ) t ON t.user_id = up.user_id AND t.rn = 1
      )
      SELECT COUNT(*) + 1 AS position
      FROM user_data
      WHERE points > ${totalPoints}
         OR (points = ${totalPoints} AND latest_date > ${latestDate})
         OR (points = ${totalPoints} AND latest_date = ${latestDate} AND nick < ${nick})
    `

    // Calculate per-game position for each game the user has a tier in
    const games: Record<string, GameRanking> = {}

    for (const [game, tier] of Object.entries(gameTiers)) {
      const gamePoints = TIER_POINTS[tier] ?? 0

      const [gamePos] = await prisma.$queryRaw<[{ position: bigint }]>`
        WITH latest_game_tiers AS (
          SELECT
            COALESCE(uuid, CONCAT('nick_', nick)) AS user_id,
            tier,
            date,
            ROW_NUMBER() OVER (
              PARTITION BY COALESCE(uuid, CONCAT('nick_', nick))
              ORDER BY date DESC
            ) AS rn
          FROM tiers
          WHERE game = ${game}
            AND nick IS NOT NULL
            AND tier IS NOT NULL
        ),
        game_data AS (
          SELECT
            user_id,
            tier,
            date,
            CASE
              WHEN UPPER(tier) IN ('H1', '1H') THEN 70
              WHEN UPPER(tier) IN ('L1', '1L') THEN 50
              WHEN UPPER(tier) IN ('H2', '2H') THEN 40
              WHEN UPPER(tier) IN ('L2', '2L') THEN 30
              WHEN UPPER(tier) IN ('H3', '3H') THEN 20
              WHEN UPPER(tier) IN ('L3', '3L') THEN 10
              WHEN UPPER(tier) IN ('H4', '4H') THEN 7
              WHEN UPPER(tier) IN ('L4', '4L') THEN 5
              WHEN UPPER(tier) IN ('H5', '5H') THEN 2
              WHEN UPPER(tier) IN ('L5', '5L') THEN 1
              ELSE 0
            END AS pts
          FROM latest_game_tiers
          WHERE rn = 1
        ),
        nick_data AS (
          SELECT
            t.nick,
            gd.user_id,
            gd.pts,
            gd.date AS latest_date
          FROM game_data gd
          INNER JOIN (
            SELECT
              COALESCE(uuid, CONCAT('nick_', nick)) AS user_id,
              nick,
              ROW_NUMBER() OVER (
                PARTITION BY COALESCE(uuid, CONCAT('nick_', nick))
                ORDER BY date DESC
              ) AS rn
            FROM tiers
          ) t ON t.user_id = gd.user_id AND t.rn = 1
        )
        SELECT COUNT(*) + 1 AS position
        FROM nick_data
        WHERE pts > ${gamePoints}
           OR (pts = ${gamePoints} AND latest_date > ${latestDate})
           OR (pts = ${gamePoints} AND latest_date = ${latestDate} AND nick < ${nick})
      `

      games[game] = {
        tier,
        position: Number(gamePos.position),
      }
    }

    const result: RankingsResponse = {
      uuid,
      nick,
      overall: {
        points: totalPoints,
        position: Number(positionData.position),
      },
      games,
    }

    await setCache(cacheKey, result, CACHE_TTL)

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({ message: "Error fetching rankings" })
  }
}

export default withRateLimit(handler)
