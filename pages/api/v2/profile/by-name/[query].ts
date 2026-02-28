import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/config/lib/prisma"
import { withRateLimit } from "@/config/lib/rateLimit"
import { getCache, setCache } from "@/config/lib/cache"
import { buildProfileData, ProfileData } from "@/config/lib/profileHelper"

const CACHE_TTL = 300 // 5 minutes

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const rawQuery = typeof req.query.query === "string" ? req.query.query.trim() : null

  if (!rawQuery) {
    return res.status(400).json({ message: "Missing query" })
  }

  const nick = rawQuery.toLowerCase()

  try {
    const cacheKey = `profile:nick:${nick}`
    const cached = await getCache<ProfileData>(cacheKey)
    if (cached) {
      return res.status(200).json(cached)
    }

    // Fetch latest player info from tiers by case-insensitive nick
    const [latest] = await prisma.$queryRaw<
      Array<{
        uuid: string | null
        nick: string
        region: string
        is_premium: boolean
        discord_id: string
      }>
    >`
      SELECT uuid, nick, region, is_premium, discord_id
      FROM tiers
      WHERE LOWER(nick) = ${nick}
        AND nick IS NOT NULL
      ORDER BY date DESC
      LIMIT 1
    `

    if (!latest) {
      return res.status(404).json({ message: "Player not found" })
    }

    // user_id follows the same COALESCE pattern used across the codebase
    const user_id = latest.uuid ?? `nick_${latest.nick}`

    const profile = await buildProfileData(
      user_id,
      latest.uuid,
      latest.nick,
      latest.region,
      latest.is_premium,
      latest.discord_id,
    )

    // Cache under nick key
    await setCache(cacheKey, profile, CACHE_TTL)

    // Also warm the UUID cache if the player has a UUID
    if (latest.uuid) {
      await setCache(`profile:uuid:${latest.uuid}`, profile, CACHE_TTL)
    }

    return res.status(200).json(profile)
  } catch (error) {
    return res.status(500).json({ message: "Error fetching profile" })
  }
}

export default withRateLimit(handler)
