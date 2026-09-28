import { Prisma } from "@prisma/client";
import { prisma } from "@/config/lib/prisma";
import { TestEntry, TierlistResumeResponse } from "../interfaces";

const EMPTY: TierlistResumeResponse = { latest_h_tests: [], latest_l_tests: [], total_tests: {} };

// Precisión de segundo en `tiers.date`: se desempata por `id` para que el orden sea determinista.
const HIGH_TIERS = ['H1', '1H', 'H2', '2H', 'H3', '3H', 'H4', '4H', 'H5', '5H'];
const LOW_TIERS = ['L1', '1L', 'L2', '2L', 'L3', '3L', 'L4', '4L', 'L5', '5L'];

type RawTest = {
    id: number;
    nick: string;
    region: string;
    tier: string;
    game: string;
    date: Date;
};

const mapEntry = (t: RawTest): TestEntry => ({
    id: t.id,
    nick: t.nick ?? '',
    region: (t.region ?? '') as TestEntry['region'],
    tier: (t.tier ?? '') as TestEntry['tier'],
    game: (t.game ?? '') as TestEntry['game'],
    date: t.date.toISOString(),
});

const latestTests = (isHigh: boolean, tiers: string[]): Promise<RawTest[]> =>
    prisma.$queryRaw<RawTest[]>`
        WITH latest_per_user_game AS (
            SELECT
                id, nick, region, tier, game, date,
                ROW_NUMBER() OVER (PARTITION BY nick, game ORDER BY date DESC, id DESC) as rn
            FROM tiers
            WHERE is_high = ${isHigh}
            AND tier IN (${Prisma.join(tiers)})
        )
        SELECT id, nick, region, tier, game, date
        FROM latest_per_user_game
        WHERE rn = 1
        ORDER BY date DESC, id DESC
        LIMIT 7
    `;

/**
 * Fuente única de la consulta de "últimos resultados".
 * Lanza si la base de datos falla: quien la consuma decide cómo degradar.
 */
export async function getResumeData(): Promise<TierlistResumeResponse> {
    const [latestHTests, latestLTests, testsByGame] = await Promise.all([
        latestTests(true, HIGH_TIERS),
        latestTests(false, LOW_TIERS),
        prisma.tiers.groupBy({ by: ['game'], _count: { game: true } }),
    ]);

    const total_tests: Record<string, number> = {};
    for (const item of testsByGame) {
        if (item.game?.trim()) {
            total_tests[item.game] = item._count.game;
        }
    }

    return {
        latest_h_tests: latestHTests.map(mapEntry),
        latest_l_tests: latestLTests.map(mapEntry),
        total_tests,
    };
}

/**
 * Wrapper para `getStaticProps`: nunca lanza, para que el build de CI funcione
 * sin `DATABASE_URL`. El cliente revalida esta misma data vía React Query.
 */
export async function fetchResumeData(): Promise<{ data: TierlistResumeResponse; revalidate: number }> {
    try {
        return { data: await getResumeData(), revalidate: 300 };
    } catch (error) {
        console.error('[home/get-resume] fetchResumeData failed:', error);
        return { data: EMPTY, revalidate: 1 };
    }
}
