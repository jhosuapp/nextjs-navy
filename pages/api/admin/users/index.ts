import { prisma } from "@/config/lib/prisma";
import { createAdminHandler, queryString } from "@/config/lib/adminHandler";
import { getOverridesMap } from "@/config/lib/adminOverrides";
import {
    matchesSearch,
    paginate,
    serializeHidden,
    serializeMeta,
} from "@/config/lib/adminSerializers";
import { pageSchema, searchSchema } from "@/config/lib/adminValidation";
import { normalizeTierKey, TIER_POINTS } from "@/config/lib/profileHelper";
import { ADMIN_PAGE_SIZE } from "@/shared/constants/admin";
import type {
    AdminUser,
    AdminUsersResponse,
    UserStatusFilter,
} from "@/features/admin-users/interfaces";

type LatestTierRow = {
    user_key: string;
    uuid: string | null;
    nick: string;
    region: string;
    is_premium: boolean | number;
    game: string;
    tier: string;
    date: Date;
};

const parseStatus = (value: string): UserStatusFilter =>
    value === "hidden" ? "hidden" : "visible";

/**
 * Jugadores únicos de la tierlist, leídos de `tiers` SIN filtrar (el panel debe
 * ver también a los ocultos) y con los overrides aplicados en memoria.
 * Misma identidad que la tierlist pública: `COALESCE(uuid, CONCAT('nick_', nick))`.
 */
export default createAdminHandler("users", {
    GET: async (req, res) => {
        const page = pageSchema.parse(queryString(req.query.page));
        const search = searchSchema.parse(queryString(req.query.search));
        const status = parseStatus(queryString(req.query.status));

        const [rows, overrides] = await Promise.all([
            prisma.$queryRaw<LatestTierRow[]>`
                WITH ranked AS (
                    SELECT
                        COALESCE(uuid, CONCAT('nick_', nick)) AS user_key,
                        uuid, nick, region, is_premium, game, tier, date,
                        ROW_NUMBER() OVER (
                            PARTITION BY COALESCE(uuid, CONCAT('nick_', nick)), game
                            ORDER BY date DESC, id DESC
                        ) AS rn
                    FROM tiers
                    WHERE nick IS NOT NULL AND tier IS NOT NULL AND game IS NOT NULL
                )
                SELECT user_key, uuid, nick, region, is_premium, game, tier, date
                FROM ranked
                WHERE rn = 1
                ORDER BY date DESC
            `,
            getOverridesMap("user"),
        ]);

        // Filas ordenadas por fecha desc: la primera de cada usuario trae su nick/región actual.
        const users = new Map<string, AdminUser>();
        for (const row of rows) {
            const tier = normalizeTierKey(row.tier);
            const existing = users.get(row.user_key);

            if (existing) {
                existing.points += TIER_POINTS[tier] ?? 0;
                existing.games.push({ game: row.game, tier });
                continue;
            }

            const override = overrides.get(row.user_key);
            users.set(row.user_key, {
                key: row.user_key,
                uuid: row.uuid,
                is_premium: Boolean(row.is_premium),
                region: row.region,
                nick: override?.nick ?? row.nick,
                original_nick: row.nick,
                nick_override: override?.nick ?? null,
                points: TIER_POINTS[tier] ?? 0,
                games: [{ game: row.game, tier }],
                last_test: row.date.toISOString(),
                ...serializeHidden(override),
                ...serializeMeta(override),
            });
        }

        const counts: Record<UserStatusFilter, number> = { visible: 0, hidden: 0 };
        const filtered: AdminUser[] = [];

        for (const user of users.values()) {
            const userStatus: UserStatusFilter = user.hidden ? "hidden" : "visible";
            counts[userStatus] += 1;
            if (userStatus === status && matchesSearch(search, user.nick, user.original_nick, user.uuid)) {
                filtered.push(user);
            }
        }

        filtered.sort((a, b) => b.points - a.points || a.nick.localeCompare(b.nick));

        const body: AdminUsersResponse = { ...paginate(filtered, page, ADMIN_PAGE_SIZE), counts };
        res.status(200).json(body);
    },
});
