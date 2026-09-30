import {
    getAllTimeTesterCounts,
    getMonthlyTesterCounts,
    getTesterIdentities,
    monthKey,
    monthStart,
} from "@/config/lib/testers";
import { RankingEntry, TesterInfo, TopTestersData } from "../interfaces";

/** Meses de histórico mensual que se envían a la página. */
const MONTHS_BACK = 12;

const emptyData = (now: Date): TopTestersData => ({
    months: [monthKey(now)],
    currentMonth: monthKey(now),
    testers: {},
    rankings: { all: [], [monthKey(now)]: [] },
    generatedAt: now.toISOString(),
});

export async function fetchTopTestersData(): Promise<{ data: TopTestersData; revalidate: number }> {
    const now = new Date();

    try {
        const [allTime, monthly] = await Promise.all([
            getAllTimeTesterCounts(),
            getMonthlyTesterCounts(monthStart(now, -(MONTHS_BACK - 1))),
        ]);

        const identities = await getTesterIdentities([
            ...allTime.map((row) => row.discord_id),
            ...monthly.map((row) => row.discord_id),
        ]);

        // Los testers ocultos desde el panel no aparecen en ningún periodo.
        const isVisible = (id: string): boolean => identities.get(id)?.hidden !== true;

        const currentMonth = monthKey(now);
        const rankings: Record<string, RankingEntry[]> = { all: [], [currentMonth]: [] };

        rankings.all = allTime
            .filter((row) => isVisible(row.discord_id))
            .map((row): RankingEntry => [row.discord_id, row.tests]);

        for (const row of monthly) {
            if (!isVisible(row.discord_id)) continue;
            (rankings[row.month] ??= []).push([row.discord_id, row.tests]);
        }

        const testers: Record<string, TesterInfo> = {};
        for (const entries of Object.values(rankings)) {
            for (const [id] of entries) {
                const identity = identities.get(id);
                testers[id] ??= {
                    discord_id: id,
                    nick: identity?.nick ?? null,
                    role_name: identity?.role_name ?? null,
                    role_colour: identity?.role_colour ?? null,
                };
            }
        }

        const months = Object.keys(rankings)
            .filter((key) => key !== "all")
            .sort((a, b) => b.localeCompare(a));

        return {
            data: { months, currentMonth, testers, rankings, generatedAt: now.toISOString() },
            revalidate: 3600,
        };
    } catch (error) {
        console.error("[top-testers] fetch failed:", error);
        return { data: emptyData(now), revalidate: 1 };
    }
}
