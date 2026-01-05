import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/config/lib/prisma"

const TIER_POINTS: Record<string, number> = {
  H1: 60,
  L1: 45,
  H2: 30,
  L2: 20,
  H3: 10,
  L3: 6,
  H4: 4,
  L4: 3,
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const page = Number(req.query.page || 1)
  const limit = 10
  const offset = (page - 1) * limit

  const searchNick =
    typeof req.query.nick === "string"
      ? req.query.nick.trim().toLowerCase()
      : null

  // 🔍 BÚSQUEDA EXACTA
  if (searchNick) {
    const userRows = await prisma.$queryRaw<Array<{
      nick: string
      region: string
      tier: string
      game: string
    }>>`
      SELECT nick, region, tier, game
      FROM tiers
      WHERE LOWER(nick) = ${searchNick}
    `

    if (userRows.length === 0) {
      return res.status(200).json({ data: null })
    }

    let totalPoints = 0
    const games: Record<string, GameTier> = {}

    for (const row of userRows) {
      const tierKey = row.tier.toUpperCase().replace(/^(\d)([HL])$/, "$2$1")
      totalPoints += TIER_POINTS[tierKey] || 0

      if (!games[row.game]) {
        games[row.game] = { name: row.game, tier: tierKey }
      }
    }

    // Calcular posición
    const [positionData] = await prisma.$queryRaw<[{ position: bigint }]>`
      WITH user_points AS (
        SELECT 
          nick,
          SUM(
            CASE 
              WHEN UPPER(tier) IN ('H1', '1H') THEN 60
              WHEN UPPER(tier) IN ('L1', '1L') THEN 45
              WHEN UPPER(tier) IN ('H2', '2H') THEN 30
              WHEN UPPER(tier) IN ('L2', '2L') THEN 20
              WHEN UPPER(tier) IN ('H3', '3H') THEN 10
              WHEN UPPER(tier) IN ('L3', '3L') THEN 6
              WHEN UPPER(tier) IN ('H4', '4H') THEN 4
              WHEN UPPER(tier) IN ('L4', '4L') THEN 3
              WHEN UPPER(tier) IN ('H5', '5H') THEN 2
              WHEN UPPER(tier) IN ('L5', '5L') THEN 1
              ELSE 0 
            END
          ) as points
        FROM tiers
        WHERE nick IS NOT NULL AND tier IS NOT NULL
        GROUP BY nick
      )
      SELECT COUNT(*) + 1 as position
      FROM user_points
      WHERE points > ${totalPoints}
    `

    return res.status(200).json({
      data: {
        nick: userRows[0].nick,
        region: userRows[0].region,
        points: totalPoints,
        games,
        position: Number(positionData.position),
      },
    })
  }

  // 📄 RANKING PAGINADO
  const rankingRows = await prisma.$queryRaw<Array<{
    nick: string
    region: string
    points: number
    row_num: bigint
  }>>`
    WITH user_points AS (
      SELECT 
        nick,
        MAX(region) as region,
        SUM(
          CASE 
            WHEN UPPER(tier) IN ('H1', '1H') THEN 60
            WHEN UPPER(tier) IN ('L1', '1L') THEN 45
            WHEN UPPER(tier) IN ('H2', '2H') THEN 30
            WHEN UPPER(tier) IN ('L2', '2L') THEN 20
            WHEN UPPER(tier) IN ('H3', '3H') THEN 10
            WHEN UPPER(tier) IN ('L3', '3L') THEN 6
            WHEN UPPER(tier) IN ('H4', '4H') THEN 4
            WHEN UPPER(tier) IN ('L4', '4L') THEN 3
            WHEN UPPER(tier) IN ('H5', '5H') THEN 2
            WHEN UPPER(tier) IN ('L5', '5L') THEN 1
            ELSE 0 
          END
        ) as points
      FROM tiers
      WHERE nick IS NOT NULL AND tier IS NOT NULL AND region IS NOT NULL
      GROUP BY nick
    ),
    ranked AS (
      SELECT 
        nick,
        region,
        points,
        ROW_NUMBER() OVER (ORDER BY points DESC, nick ASC) as row_num
      FROM user_points
    )
    SELECT nick, region, points, row_num
    FROM ranked
    WHERE row_num > ${offset} AND row_num <= ${offset + limit}
    ORDER BY row_num
  `

  // Obtener total
  const [totalData] = await prisma.$queryRaw<[{ total: bigint }]>`
    SELECT COUNT(DISTINCT nick) as total
    FROM tiers
    WHERE nick IS NOT NULL
  `

  // Obtener juegos
  const nicks = rankingRows.map(r => r.nick)
  
  const gamesRows = nicks.length > 0 ? await prisma.tiers.findMany({
    where: {
      nick: { in: nicks },
    },
    select: {
      nick: true,
      tier: true,
      game: true,
    },
  }) : []

  // Mapear juegos
  const gamesMap: Record<string, Record<string, GameTier>> = {}
  
  for (const row of gamesRows) {
    if (!row.nick || !row.tier || !row.game) continue

    const tierKey = row.tier.toUpperCase().replace(/^(\d)([HL])$/, "$2$1")

    if (!gamesMap[row.nick]) {
      gamesMap[row.nick] = {}
    }

    if (!gamesMap[row.nick][row.game]) {
      gamesMap[row.nick][row.game] = {
        name: row.game,
        tier: tierKey,
      }
    }
  }

  const data = rankingRows.map(row => ({
    nick: row.nick,
    region: row.region,
    points: Number(row.points),
    games: gamesMap[row.nick] || {},
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