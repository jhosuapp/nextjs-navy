import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/config/lib/prisma"
import { Prisma } from "@prisma/client"
import { withRateLimit } from "@/config/lib/rateLimit"

const TIER_POINTS: Record<string, number> = {
  H1: 70,
  L1: 50,
  H2: 40,
  L2: 30,
  H3: 20,
  L3: 10,
  H4: 7,
  L4: 5,
  H5: 2,
  L5: 1,
}

type GameTier = {
  name: string
  tier: string
}

type RankingEntry = {
  nick: string
  region: string
  points: number
  games: Record<string, GameTier>
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const rawPage = Number(req.query.page || 1)
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1
  const limit = 10
  const offset = (page - 1) * limit

  const searchNick =
    typeof req.query.nick === "string"
      ? req.query.nick.trim().toLowerCase()
      : null

  // 🔍 BÚSQUEDA EXACTA
  if (searchNick) {
    // Obtener el UUID o crear identificador basado en nick
    const [userIdData] = await prisma.$queryRaw<Array<{
      user_id: string
      latest_nick: string
      latest_region: string
    }>>`
      SELECT 
        COALESCE(uuid, CONCAT('nick_', nick)) as user_id,
        nick as latest_nick,
        region as latest_region
      FROM tiers
      WHERE LOWER(nick) = ${searchNick}
      ORDER BY date DESC
      LIMIT 1
    `

    if (!userIdData) {
      return res.status(200).json({ data: null })
    }

    const userId = userIdData.user_id

    // Obtener todos los juegos con sus tiers más recientes para este usuario
    const userGames = await prisma.$queryRaw<Array<{
      tier: string
      game: string
    }>>`
      WITH ranked_games AS (
        SELECT 
          tier,
          game,
          ROW_NUMBER() OVER (PARTITION BY game ORDER BY date DESC) as rn
        FROM tiers
        WHERE COALESCE(uuid, CONCAT('nick_', nick)) = ${userId}
      )
      SELECT tier, game
      FROM ranked_games
      WHERE rn = 1
    `

    let totalPoints = 0
    const games: Record<string, GameTier> = {}

    for (const row of userGames) {
      const tierKey = row.tier.toUpperCase().replace(/^(\d)([HL])$/, "$2$1")
      totalPoints += TIER_POINTS[tierKey] || 0

      games[row.game] = { name: row.game, tier: tierKey }
    }

    // Obtener la fecha más reciente del usuario
    const [userDateData] = await prisma.$queryRaw<[{ latest_date: Date }]>`
      SELECT MAX(date) as latest_date
      FROM tiers
      WHERE COALESCE(uuid, CONCAT('nick_', nick)) = ${userId}
    `
    const userLatestDate = userDateData.latest_date

    // Calcular posición
    const [positionData] = await prisma.$queryRaw<[{ position: bigint }]>`
      WITH latest_tiers AS (
        SELECT 
          COALESCE(uuid, CONCAT('nick_', nick)) as user_id,
          tier, 
          game,
          date,
          ROW_NUMBER() OVER (
            PARTITION BY 
              COALESCE(uuid, CONCAT('nick_', nick)), 
              game 
            ORDER BY date DESC
          ) as rn
        FROM tiers
        WHERE nick IS NOT NULL AND tier IS NOT NULL
      ),
      user_points AS (
        SELECT 
          user_id,
          MAX(date) as latest_date,
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
          ) as points
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
            COALESCE(uuid, CONCAT('nick_', nick)) as user_id,
            nick,
            ROW_NUMBER() OVER (
              PARTITION BY COALESCE(uuid, CONCAT('nick_', nick))
              ORDER BY date DESC
            ) as rn
          FROM tiers
        ) t ON t.user_id = up.user_id AND t.rn = 1
      )
      SELECT COUNT(*) + 1 as position
      FROM user_data
      WHERE points > ${totalPoints}
         OR (points = ${totalPoints} AND latest_date > ${userLatestDate})
         OR (points = ${totalPoints} AND latest_date = ${userLatestDate} AND nick < ${userIdData.latest_nick})
    `

    return res.status(200).json({
      data: {
        nick: userIdData.latest_nick,
        region: userIdData.latest_region,
        points: totalPoints,
        games,
        position: Number(positionData.position),
      },
    })
  }

  // 📄 RANKING PAGINADO
  const rankingRows = await prisma.$queryRaw<Array<{
    user_id: string
    nick: string
    region: string
    points: number
    latest_date: Date
    row_num: bigint
  }>>`
    WITH latest_tiers AS (
      SELECT 
        COALESCE(uuid, CONCAT('nick_', nick)) as user_id,
        tier, 
        game,
        date,
        ROW_NUMBER() OVER (
          PARTITION BY 
            COALESCE(uuid, CONCAT('nick_', nick)), 
            game 
          ORDER BY date DESC
        ) as rn
      FROM tiers
      WHERE nick IS NOT NULL AND tier IS NOT NULL
    ),
    user_points AS (
      SELECT 
        user_id,
        MAX(date) as latest_date,
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
        ) as points
      FROM latest_tiers
      WHERE rn = 1
      GROUP BY user_id
    ),
    user_latest_info AS (
      SELECT 
        COALESCE(uuid, CONCAT('nick_', nick)) as user_id,
        nick,
        region,
        ROW_NUMBER() OVER (
          PARTITION BY COALESCE(uuid, CONCAT('nick_', nick))
          ORDER BY date DESC
        ) as rn
      FROM tiers
      WHERE nick IS NOT NULL AND region IS NOT NULL
    ),
    ranked AS (
      SELECT 
        up.user_id,
        uli.nick,
        uli.region,
        up.points,
        up.latest_date,
        ROW_NUMBER() OVER (
          ORDER BY 
            up.points DESC, 
            up.latest_date DESC, 
            uli.nick ASC
        ) as row_num
      FROM user_points up
      INNER JOIN user_latest_info uli 
        ON up.user_id = uli.user_id AND uli.rn = 1
    )
    SELECT user_id, nick, region, points, latest_date, row_num
    FROM ranked
    WHERE row_num > ${offset} AND row_num <= ${offset + limit}
    ORDER BY row_num
  `

  // Obtener total
  const [totalData] = await prisma.$queryRaw<[{ total: bigint }]>`
    SELECT COUNT(DISTINCT COALESCE(uuid, CONCAT('nick_', nick))) as total
    FROM tiers
    WHERE nick IS NOT NULL
  `

  // Obtener juegos (solo los más recientes por cada UUID/nick y game)
  const userIds = rankingRows.map(r => r.user_id)
  
  const gamesRows = userIds.length > 0 ? await prisma.$queryRaw<Array<{
    user_id: string
    tier: string
    game: string
  }>>`
    WITH latest_games AS (
      SELECT 
        COALESCE(uuid, CONCAT('nick_', nick)) as user_id,
        tier, 
        game,
        ROW_NUMBER() OVER (
          PARTITION BY 
            COALESCE(uuid, CONCAT('nick_', nick)), 
            game 
          ORDER BY date DESC
        ) as rn
      FROM tiers
      WHERE COALESCE(uuid, CONCAT('nick_', nick)) IN (${Prisma.join(userIds)})
    )
    SELECT user_id, tier, game
    FROM latest_games
    WHERE rn = 1
  ` : []

  // Mapear juegos por user_id
  const gamesMap: Record<string, Record<string, GameTier>> = {}
  
  for (const row of gamesRows) {
    if (!row.user_id || !row.tier || !row.game) continue

    const tierKey = row.tier.toUpperCase().replace(/^(\d)([HL])$/, "$2$1")

    if (!gamesMap[row.user_id]) {
      gamesMap[row.user_id] = {}
    }

    gamesMap[row.user_id][row.game] = {
      name: row.game,
      tier: tierKey,
    }
  }

  const data = rankingRows.map(row => ({
    nick: row.nick,
    region: row.region,
    points: Number(row.points),
    games: gamesMap[row.user_id] || {},
    position: Number(row.row_num),
  }))

  const total = Number(totalData.total)

  return res.status(200).json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data,
  })
}

export default withRateLimit(handler)