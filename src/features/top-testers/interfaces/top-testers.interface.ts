/** Periodo del ranking: histórico o un mes `YYYY-MM`. */
export type TopTestersPeriod = "all" | `${number}-${number}`;

export type TesterInfo = {
    discord_id: string;
    /** `null` = tester retirado sin nick conocido. */
    nick: string | null;
    role_name: string | null;
    role_colour: string | null;
};

/** `[discord_id, tests]`, ordenado de más a menos tests (compacto para las props). */
export type RankingEntry = [string, number];

export type TopTestersData = {
    /** Meses con datos, del más reciente al más antiguo. El primero es el mes en curso. */
    months: string[];
    currentMonth: string;
    testers: Record<string, TesterInfo>;
    rankings: Record<string, RankingEntry[]>;
    generatedAt: string;
};

/** Movimiento respecto al mes anterior. */
export type RankTrend =
    | { kind: "up" | "down"; delta: number }
    | { kind: "same" }
    | { kind: "new" }
    | { kind: "none" };

export type RankedTester = TesterInfo & {
    position: number;
    tests: number;
    /** % de los tests del periodo. */
    share: number;
    /** % respecto al #1 (para la barra de progreso). */
    relative: number;
    trend: RankTrend;
};

export type TopTestersSummary = {
    totalTests: number;
    activeTesters: number;
    average: number;
};
