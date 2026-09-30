import { RankedTester, RankingEntry, RankTrend, TesterInfo, TopTestersPeriod, TopTestersSummary } from "../interfaces";

/** Posiciones con empates estilo competición: 1, 2, 2, 4. */
const toPositions = (entries: RankingEntry[]): Map<string, number> => {
    const positions = new Map<string, number>();
    entries.forEach(([id, tests], index) => {
        const previous = entries[index - 1];
        positions.set(id, previous && previous[1] === tests ? positions.get(previous[0])! : index + 1);
    });
    return positions;
};

const toTrend = (position: number, previous: Map<string, number> | null, id: string): RankTrend => {
    if (!previous) return { kind: "none" };
    const before = previous.get(id);
    if (before === undefined) return { kind: "new" };
    if (before === position) return { kind: "same" };
    return before > position
        ? { kind: "up", delta: before - position }
        : { kind: "down", delta: position - before };
};

const UNKNOWN_TESTER = (id: string): TesterInfo => ({ discord_id: id, nick: null, role_name: null, role_colour: null });

export const buildRanking = (
    entries: RankingEntry[],
    testers: Record<string, TesterInfo>,
    previousEntries: RankingEntry[] | null
): RankedTester[] => {
    const total = entries.reduce((sum, [, tests]) => sum + tests, 0);
    const top = entries[0]?.[1] ?? 0;
    const positions = toPositions(entries);
    const previous = previousEntries ? toPositions(previousEntries) : null;

    return entries.map(([id, tests]) => {
        const position = positions.get(id)!;
        return {
            ...(testers[id] ?? UNKNOWN_TESTER(id)),
            position,
            tests,
            share: total ? (tests / total) * 100 : 0,
            relative: top ? (tests / top) * 100 : 0,
            trend: toTrend(position, previous, id),
        };
    });
};

export const buildSummary = (entries: RankingEntry[]): TopTestersSummary => {
    const totalTests = entries.reduce((sum, [, tests]) => sum + tests, 0);
    const activeTesters = entries.length;
    return {
        totalTests,
        activeTesters,
        average: activeTesters ? Math.round(totalTests / activeTesters) : 0,
    };
};

/** Mes anterior a `month` (`YYYY-MM`). */
export const previousMonth = (month: string): string => {
    const [year, m] = month.split("-").map(Number);
    const date = new Date(Date.UTC(year, m - 2, 1));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
};

export const isMonthPeriod = (value: unknown): value is Exclude<TopTestersPeriod, "all"> =>
    typeof value === "string" && /^\d{4}-\d{2}$/.test(value);

/** "septiembre de 2026" / "September 2026" según el idioma. */
export const formatMonth = (month: string, locale: string, style: "long" | "short" = "long"): string => {
    const [year, m] = month.split("-").map(Number);
    const label = new Intl.DateTimeFormat(locale, { month: style, year: "numeric", timeZone: "UTC" })
        .format(new Date(Date.UTC(year, m - 1, 1)));
    return label.charAt(0).toUpperCase() + label.slice(1);
};

/** Skin por defecto para testers sin nick. */
export const FALLBACK_SKIN = "MHF_Steve";

export const skinName = (nick: string | null): string => encodeURIComponent(nick ?? FALLBACK_SKIN);
