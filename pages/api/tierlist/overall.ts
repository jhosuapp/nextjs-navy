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
      ? req.query.nick.trim()
      : null

  // ✅ SIEMPRE traer todos (la posición depende del ranking completo)
  const rows = await prisma.tiers.findMany({
    select: {
      nick: true,
      tier: true,
      game: true,
      region: true,
    },
  })

  const rankingMap: Record<string, RankingEntry> = {}

  for (const row of rows) {
    if (!row.nick || !row.tier || !row.game || !row.region) continue

    // Normalizar tier → "1H" => "H1"
    const tierKey = row.tier
      .toUpperCase()
      .replace(/^(\d)([HL])$/, "$2$1")

    const points = TIER_POINTS[tierKey] || 0

    if (!rankingMap[row.nick]) {
      rankingMap[row.nick] = {
        nick: row.nick,
        region: row.region,
        points: 0,
        games: {},
      }
    }

    rankingMap[row.nick].points += points

    if (!rankingMap[row.nick].games[row.game]) {
      rankingMap[row.nick].games[row.game] = {
        name: row.game,
        tier: tierKey,
      }
    }
  }

  // 🏆 Ordenar ranking por puntos
  const ranking = Object.values(rankingMap).sort(
    (a, b) => b.points - a.points
  )

  // 🔍 BÚSQUEDA EXACTA → devuelve usuario + posición REAL
  if (searchNick) {
    const index = ranking.findIndex(
      user => user.nick.toLowerCase() === searchNick.toLowerCase()
    )

    const user =
      index !== -1
        ? { ...ranking[index], position: index + 1 }
        : null

    return res.status(200).json({
      data: user,
    })
  }

  // 📄 RANKING NORMAL → paginado
  const total = ranking.length
  const data = ranking.slice(offset, offset + limit)

  return res.status(200).json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data,
  })
}
