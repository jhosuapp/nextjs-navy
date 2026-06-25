import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/config/lib/prisma"
import { withRateLimit } from "@/config/lib/rateLimit"
import { getCache, setCache } from "@/config/lib/cache"

const CACHE_KEY = "modes:list"
const CACHE_TTL = 3600 // 1 hour

type ModeListResponse = {
  modes: string[]
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const cached = await getCache<ModeListResponse>(CACHE_KEY)
    if (cached) {
      return res.status(200).json(cached)
    }

    const rows = await prisma.tiers.findMany({
      select: { game: true },
      distinct: ["game"],
      orderBy: { game: "asc" },
    })

    const result: ModeListResponse = {
      modes: rows.map((r) => r.game),
    }

    await setCache(CACHE_KEY, result, CACHE_TTL)

    return res.status(200).json(result)
  } catch (error) {
    console.error("[api/v2/mode/list] GET failed:", error)
    return res.status(500).json({ message: "Error fetching mode list" })
  }
}

export default withRateLimit(handler)
