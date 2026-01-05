import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/config/lib/prisma"

type TierItem = {
    nick: string
    region: string
    is_h: boolean
}

type GameGroup = {
    game: string
    total_users: number
    tiers: Record<string, TierItem[]>
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" })
    }

    const gameFilter = typeof req.query.game === "string" ? req.query.game : null
    const tierFilter = typeof req.query.tier === "string" ? req.query.tier : null
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 50)
    const offset = (page - 1) * limit
    
    // 🚀 Límite para vista general (sin filtros)
    const overviewLimit = 10

    // 🧠 PAGINACIÓN CON FILTROS ESPECÍFICOS
    if (gameFilter && tierFilter) {
        const rows = await prisma.tiers.findMany({
            where: { 
                game: gameFilter,
                tier: {
                    contains: tierFilter.replace('t', ''),
                }
            },
            select: {
                nick: true,
                region: true,
                tier: true,
                game: true,
            },
            skip: offset,
            take: limit,
        })

        const [totalCount] = await prisma.$queryRaw<[{ count: bigint }]>`
            SELECT COUNT(*) as count 
            FROM tiers 
            WHERE game = ${gameFilter} 
            AND LOWER(tier) LIKE ${`%${tierFilter.replace('t', '')}%`}
        `

        const items = rows.map(row => {
            const normalizedTier = row.tier
                .toUpperCase()
                .replace(/^(\d)([HL])$/, "$2$1")
            
            return {
                nick: row.nick,
                region: row.region,
                is_h: normalizedTier.startsWith("H"),
            }
        })

        return res.status(200).json({
            game: gameFilter,
            tier: tierFilter,
            page,
            limit,
            total: Number(totalCount.count),
            totalPages: Math.ceil(Number(totalCount.count) / limit),
            data: items,
        })
    }

    // 🔁 VISTA GENERAL: Limitar en la query
    const rows = await prisma.$queryRaw<Array<{
        game: string
        tier: string
        nick: string
        region: string
        row_num: bigint
    }> >`
        WITH ranked_tiers AS (
            SELECT 
                game,
                tier,
                nick,
                region,
                ROW_NUMBER() OVER (PARTITION BY game, tier ORDER BY nick) as row_num
            FROM tiers
            WHERE nick IS NOT NULL 
            AND region IS NOT NULL 
            AND tier IS NOT NULL 
            AND game IS NOT NULL
        )
        SELECT game, tier, nick, region, row_num
        FROM ranked_tiers
        WHERE row_num <= ${overviewLimit}
        ORDER BY game, tier, nick
    `

    // Contar totales por juego
    const totals = await prisma.$queryRaw<Array<{
        game: string
        total_users: bigint
    }>>`
        SELECT game, COUNT(DISTINCT nick) as total_users
        FROM tiers
        WHERE game IS NOT NULL AND nick IS NOT NULL
        GROUP BY game
    `

    const gamesMap: Record<string, GameGroup> = {}

    // Inicializar juegos con totales
    for (const total of totals) {
        gamesMap[total.game] = {
            game: total.game,
            total_users: Number(total.total_users),
            tiers: {
                t1: [],
                t2: [],
                t3: [],
                t4: [],
                t5: [],
            },
        }
    }

    // Llenar con datos limitados
    for (const row of rows) {
        const normalizedTier = row.tier
            .toUpperCase()
            .replace(/^(\d)([HL])$/, "$2$1")

        const isH = normalizedTier.startsWith("H")
        const level = normalizedTier.slice(1)
        const tierKey = `t${level}`

        if (gamesMap[row.game]) {
            gamesMap[row.game].tiers[tierKey].push({
                nick: row.nick,
                region: row.region,
                is_h: isH,
            })
        }
    }

    return res.status(200).json({
        data: Object.values(gamesMap),
    })
}