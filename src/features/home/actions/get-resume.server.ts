import { prisma } from "@/config/lib/prisma";
import { TestEntry, TierlistResumeResponse } from "../interfaces";

export async function fetchResumeData(): Promise<TierlistResumeResponse> {
    const latestHTests = await prisma.$queryRaw<Array<{
        id: number; nick: string; region: string; tier: string; game: string; date: Date;
    }>>`
        WITH latest_per_user_game AS (
            SELECT
                id, nick, region, tier, game, date,
                ROW_NUMBER() OVER (PARTITION BY nick, game ORDER BY date DESC) as rn
            FROM tiers
            WHERE is_high = true
            AND tier IN ('H1','1H','H2','2H','H3','3H','H4','4H','H5','5H','L1','1L','L2','2L','L3','3L','L4','4L','L5','5L')
        )
        SELECT id, nick, region, tier, game, date
        FROM latest_per_user_game
        WHERE rn = 1
        ORDER BY date DESC
        LIMIT 7
    `

    const latestLTests = await prisma.$queryRaw<Array<{
        id: number; nick: string; region: string; tier: string; game: string; date: Date;
    }>>`
        WITH latest_per_user_game AS (
            SELECT
                id, nick, region, tier, game, date,
                ROW_NUMBER() OVER (PARTITION BY nick, game ORDER BY date DESC) as rn
            FROM tiers
            WHERE is_high = false
            AND tier IN ('L1','1L','L2','2L','L3','3L','L4','4L','L5','5L')
        )
        SELECT id, nick, region, tier, game, date
        FROM latest_per_user_game
        WHERE rn = 1
        ORDER BY date DESC
        LIMIT 7
    `

    const testsByGame = await prisma.tiers.groupBy({
        by: ['game'],
        _count: { game: true },
    });

    const total_tests: Record<string, number> = {};
    for (const item of testsByGame) {
        if (item.game?.trim()) {
            total_tests[item.game] = item._count.game;
        }
    }

    const mapEntry = (t: { id: number; nick: string; region: string; tier: string; game: string; date: Date }): TestEntry => ({
        id: t.id,
        nick: t.nick ?? '',
        region: (t.region ?? '') as TestEntry['region'],
        tier: (t.tier ?? '') as TestEntry['tier'],
        game: (t.game ?? '') as TestEntry['game'],
        date: t.date.toISOString(),
    });

    return {
        latest_h_tests: latestHTests.map(mapEntry),
        latest_l_tests: latestLTests.map(mapEntry),
        total_tests,
    };
}
