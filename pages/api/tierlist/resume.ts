import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/config/lib/prisma"

type TestEntry = {
  id: number
  nick: string
  region: string
  tier: string
  game: string
  date: Date
}

type ResponseData = {
  latest_h_tests: TestEntry[]
  latest_l_tests: TestEntry[]
  total_tests: Record<string, number>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  try {
    // Obtener últimos 5 tests con is_high = true (solo el más reciente por nick+game)
    const latestHTests = await prisma.$queryRaw<Array<{
      id: number
      nick: string
      region: string
      tier: string
      game: string
      date: Date
    }>>`
      WITH latest_per_user_game AS (
        SELECT 
          id,
          nick,
          region,
          tier,
          game,
          date,
          ROW_NUMBER() OVER (PARTITION BY nick, game ORDER BY date DESC) as rn
        FROM tiers
        WHERE is_high = true
        AND tier IN ('H1', '1H', 'H2', '2H', 'H3', '3H', 'H4', '4H', 'H5', '5H', 'L1', '1L', 'L2', '2L', 'L3', '3L', 'L4', '4L', 'L5', '5L')
      )
      SELECT id, nick, region, tier, game, date
      FROM latest_per_user_game
      WHERE rn = 1
      ORDER BY date DESC
      LIMIT 5
    `

    // Obtener últimos 5 tests con is_high = false (solo el más reciente por nick+game)
    const latestLTests = await prisma.$queryRaw<Array<{
      id: number
      nick: string
      region: string
      tier: string
      game: string
      date: Date
    }>>`
      WITH latest_per_user_game AS (
        SELECT 
          id,
          nick,
          region,
          tier,
          game,
          date,
          ROW_NUMBER() OVER (PARTITION BY nick, game ORDER BY date DESC) as rn
        FROM tiers
        WHERE is_high = false
        AND tier IN ('L1', '1L', 'L2', '2L', 'L3', '3L', 'L4', '4L', 'L5', '5L')
      )
      SELECT id, nick, region, tier, game, date
      FROM latest_per_user_game
      WHERE rn = 1
      ORDER BY date DESC
      LIMIT 5
    `

    // Obtener conteo de tests por juego (conteo total original)
    const testsByGame = await prisma.tiers.groupBy({
      by: ["game"],
      _count: {
        game: true,
      },
    })

    // Convertir el conteo a formato Record<string, number>
    const totalTests: Record<string, number> = {}
    for (const item of testsByGame) {
      // Filtrar valores nulos o vacíos
      if (item.game && item.game.trim() !== "") {
        totalTests[item.game] = item._count.game
      }
    }

    const responseData: ResponseData = {
      latest_h_tests: latestHTests.map(test => ({
        id: test.id,
        nick: test.nick || "",
        region: test.region || "",
        tier: test.tier || "",
        game: test.game || "",
        date: test.date,
      })),
      latest_l_tests: latestLTests.map(test => ({
        id: test.id,
        nick: test.nick || "",
        region: test.region || "",
        tier: test.tier || "",
        game: test.game || "",
        date: test.date,
      })),
      total_tests: totalTests,
    }

    return res.status(200).json(responseData)
  } catch (error) {
    console.error("Error fetching tests stats:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}