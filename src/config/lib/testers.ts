import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { applyStaffOverride, getOverridesMap, isHidden } from "./adminOverrides";

/**
 * Testers.
 *
 * El bot registra cada test en `tester_activity` (una fila por test, con fecha)
 * y el acumulado histórico en `tier_testers`. Ninguna de las dos guarda el nick:
 * se resuelve con, por orden, el override del panel (`entity = 'tester'`), el
 * staff actual y `user_profiles`. `tester_id = '0'` son registros del sistema.
 */

export const SYSTEM_TESTER_ID = "0";

export type TesterIdentity = {
    discord_id: string;
    /** Nick efectivo (override > staff > perfil). `null` = tester retirado sin nick. */
    nick: string | null;
    /** Nick sin override, para mostrarlo como "valor del bot" en el panel. */
    base_nick: string | null;
    nick_override: string | null;
    uuid: string | null;
    role_name: string | null;
    role_colour: string | null;
    hidden: boolean;
    hidden_reason: string | null;
};

type ProfileRow = { discord_id: string; uuid: string | null; nick: string | null };

/** Resuelve nick, skin y rol de staff de una lista de testers. */
export async function getTesterIdentities(ids: string[]): Promise<Map<string, TesterIdentity>> {
    const unique = [...new Set(ids)].filter((id) => id !== SYSTEM_TESTER_ID);
    if (unique.length === 0) return new Map();

    const [staffRows, staffOverrides, testerOverrides, profiles] = await Promise.all([
        prisma.staff.findMany({ where: { discord_id: { in: unique } } }),
        getOverridesMap("staff", unique),
        getOverridesMap("tester", unique),
        prisma.$queryRaw<ProfileRow[]>`
            SELECT discord_id, uuid, nick
            FROM user_profiles
            WHERE discord_id IN (${Prisma.join(unique)})
        `,
    ]);

    const staffById = new Map(
        staffRows
            .filter((row) => !isHidden(staffOverrides.get(row.discord_id)))
            .map((row) => [row.discord_id, applyStaffOverride(row, staffOverrides.get(row.discord_id))])
    );
    const profileById = new Map(profiles.map((row) => [row.discord_id, row]));

    return new Map(
        unique.map((id) => {
            const staff = staffById.get(id);
            const profile = profileById.get(id);
            const override = testerOverrides.get(id);
            const baseNick = staff?.nick ?? profile?.nick ?? null;

            return [
                id,
                {
                    discord_id: id,
                    nick: override?.nick ?? baseNick,
                    base_nick: baseNick,
                    nick_override: override?.nick ?? null,
                    uuid: staff?.uuid ?? profile?.uuid ?? null,
                    role_name: staff?.staff_role_name ?? null,
                    role_colour: staff?.staff_role_colour ?? null,
                    hidden: isHidden(override),
                    hidden_reason: override?.hidden_reason ?? null,
                },
            ];
        })
    );
}

export type TesterCounts = { discord_id: string; tests: number };

/** Acumulado histórico por tester (`tier_testers`), de mayor a menor. */
export async function getAllTimeTesterCounts(): Promise<TesterCounts[]> {
    const rows = await prisma.tier_testers.findMany({
        where: { discord_id: { not: SYSTEM_TESTER_ID }, count: { gt: 0 } },
        orderBy: { count: "desc" },
    });
    return rows.map((row) => ({ discord_id: row.discord_id, tests: row.count }));
}

/** Tests por tester y mes (`YYYY-MM`) desde `since`. */
export async function getMonthlyTesterCounts(
    since: Date
): Promise<Array<TesterCounts & { month: string }>> {
    const rows = await prisma.$queryRaw<Array<{ tester_id: string; month: string; tests: bigint }>>`
        SELECT tester_id, DATE_FORMAT(tested_at, '%Y-%m') AS month, COUNT(*) AS tests
        FROM tester_activity
        WHERE tester_id <> ${SYSTEM_TESTER_ID} AND tested_at >= ${since}
        GROUP BY tester_id, month
        ORDER BY month DESC, tests DESC
    `;
    return rows.map((row) => ({ discord_id: row.tester_id, month: row.month, tests: Number(row.tests) }));
}

/** Tests de cada tester en una ventana (p. ej. últimos 30 días). */
export async function getTesterCountsSince(
    since: Date,
    ids?: string[]
): Promise<Map<string, number>> {
    if (ids && ids.length === 0) return new Map();

    const idFilter = ids ? Prisma.sql`AND tester_id IN (${Prisma.join(ids)})` : Prisma.empty;
    const rows = await prisma.$queryRaw<Array<{ tester_id: string; tests: bigint }>>`
        SELECT tester_id, COUNT(*) AS tests
        FROM tester_activity
        WHERE tester_id <> ${SYSTEM_TESTER_ID} AND tested_at >= ${since} ${idFilter}
        GROUP BY tester_id
    `;
    return new Map(rows.map((row) => [row.tester_id, Number(row.tests)]));
}

export const daysAgo = (days: number): Date => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

/** Primer día del mes de `date` desplazado `offset` meses (UTC). */
export const monthStart = (date: Date, offset = 0): Date =>
    new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1));

export const monthKey = (date: Date): string =>
    `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
