import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/config/lib/prisma"
import { Prisma } from "@prisma/client"

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
    const limit = Number(req.query.limit || 8)
    const offset = (page - 1) * limit
    
    // 🚀 Límite para vista general (sin filtros)
    const overviewLimit = 8

    // 🧠 PAGINACIÓN CON FILTROS ESPECÍFICOS
    if (gameFilter && tierFilter) {
        const rows = await prisma.$queryRaw<Array<{
            nick: string
            region: string
            tier: string
            game: string
        }>>`
            WITH latest_tiers AS (
                SELECT 
                    COALESCE(uuid, CONCAT('nick_', nick)) as user_id,
                    nick, 
                    region, 
                    tier, 
                    game,
                    date,
                    ROW_NUMBER() OVER (
                        PARTITION BY COALESCE(uuid, CONCAT('nick_', nick)), game 
                        ORDER BY date DESC
                    ) as rn
                FROM tiers
                WHERE game = ${gameFilter}
                AND LOWER(tier) LIKE ${`%${tierFilter.replace('t', '').toLowerCase()}%`}
            ),
            latest_user_info AS (
                SELECT 
                    user_id,
                    nick,
                    region,
                    tier,
                    game
                FROM latest_tiers
                WHERE rn = 1
            )
            SELECT nick, region, tier, game
            FROM latest_user_info
            ORDER BY 
                CASE WHEN UPPER(tier) LIKE 'H%' OR UPPER(tier) LIKE '%H' THEN 0 ELSE 1 END,
                nick
            LIMIT ${limit}
            OFFSET ${offset}
        `

        const [totalCount] = await prisma.$queryRaw<[{ count: bigint }]>`
            WITH latest_tiers AS (
                SELECT 
                    COALESCE(uuid, CONCAT('nick_', nick)) as user_id,
                    game,
                    ROW_NUMBER() OVER (
                        PARTITION BY COALESCE(uuid, CONCAT('nick_', nick)), game 
                        ORDER BY date DESC
                    ) as rn
                FROM tiers
                WHERE game = ${gameFilter}
                AND LOWER(tier) LIKE ${`%${tierFilter.replace('t', '').toLowerCase()}%`}
            )
            SELECT COUNT(DISTINCT user_id) as count 
            FROM latest_tiers
            WHERE rn = 1
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

    // 🔁 VISTA GENERAL: Solo tiers más recientes por UUID
    const rows = await prisma.$queryRaw<Array<{
        game: string
        tier: string
        nick: string
        region: string
        row_num: bigint
    }>>`
        WITH latest_tiers AS (
            SELECT 
                COALESCE(uuid, CONCAT('nick_', nick)) as user_id,
                game,
                tier,
                date,
                ROW_NUMBER() OVER (
                    PARTITION BY COALESCE(uuid, CONCAT('nick_', nick)), game 
                    ORDER BY date DESC
                ) as rn
            FROM tiers
            WHERE nick IS NOT NULL 
            AND region IS NOT NULL 
            AND tier IS NOT NULL 
            AND game IS NOT NULL
        ),
        latest_user_data AS (
            SELECT 
                lt.user_id,
                lt.game,
                lt.tier,
                t.nick,
                t.region,
                ROW_NUMBER() OVER (
                    PARTITION BY lt.user_id
                    ORDER BY t.date DESC
                ) as user_rn
            FROM latest_tiers lt
            INNER JOIN tiers t 
                ON COALESCE(t.uuid, CONCAT('nick_', t.nick)) = lt.user_id
            WHERE lt.rn = 1
        ),
        final_user_data AS (
            SELECT 
                user_id,
                game,
                tier,
                nick,
                region
            FROM latest_user_data
            WHERE user_rn = 1
        ),
        ranked_latest AS (
            SELECT 
                game,
                tier,
                nick,
                region,
                ROW_NUMBER() OVER (
                    PARTITION BY game, tier
                    ORDER BY 
                        CASE WHEN UPPER(tier) LIKE 'H%' OR UPPER(tier) LIKE '%H' THEN 0 ELSE 1 END,
                        nick
                ) as row_num
            FROM final_user_data
        )
        SELECT game, tier, nick, region, row_num
        FROM ranked_latest
        WHERE row_num <= ${overviewLimit}
        ORDER BY game, tier, 
            CASE WHEN UPPER(tier) LIKE 'H%' OR UPPER(tier) LIKE '%H' THEN 0 ELSE 1 END,
            nick
    `

    // Contar totales por juego (solo usuarios únicos por UUID con su tier más reciente)
    const totals = await prisma.$queryRaw<Array<{
        game: string
        total_users: bigint
    }>>`
        WITH latest_tiers AS (
            SELECT 
                COALESCE(uuid, CONCAT('nick_', nick)) as user_id,
                game,
                ROW_NUMBER() OVER (
                    PARTITION BY COALESCE(uuid, CONCAT('nick_', nick)), game 
                    ORDER BY date DESC
                ) as rn
            FROM tiers
            WHERE game IS NOT NULL
        )
        SELECT game, COUNT(DISTINCT user_id) as total_users
        FROM latest_tiers
        WHERE rn = 1
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