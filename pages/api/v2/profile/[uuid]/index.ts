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

  const uuid = typeof req.query.uuid === "string" ? req.query.uuid.trim() : null

  if (!uuid) {
    return res.status(400).json({ message: "Missing uuid" })
  }

  if (uuid.length > 64) {
    return res.status(400).json({ message: "Invalid uuid" })
  }

  try {
    const cacheKey = `profile:uuid:${uuid}`
    const cached = await getCache<ProfileData>(cacheKey)
    if (cached) {
      return res.status(200).json(cached)
    }

    // Fetch latest player info from tiers by UUID
    const [latest] = await prisma.$queryRaw<
      Array<{ nick: string; region: string; is_premium: boolean }>
    >`
      SELECT nick, region, is_premium
      FROM tiers
      WHERE uuid = ${uuid}
        AND nick IS NOT NULL
      ORDER BY date DESC
      LIMIT 1
    `

    if (!latest) {
      return res.status(404).json({ message: "Player not found" })
    }

    const profile = await buildProfileData(
      uuid,
      uuid,
      latest.nick,
      latest.region,
      latest.is_premium,
    )

    await setCache(cacheKey, profile, CACHE_TTL)

    return res.status(200).json(profile)
  } catch (error) {
    return res.status(500).json({ message: "Error fetching profile" })
  }
}

export default withRateLimit(handler)
