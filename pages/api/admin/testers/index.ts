import { createAdminHandler } from "@/config/lib/adminHandler";
import { getOverridesMap } from "@/config/lib/adminOverrides";
import { serializeMeta } from "@/config/lib/adminSerializers";
import {
    daysAgo,
    getAllTimeTesterCounts,
    getTesterCountsSince,
    getTesterIdentities,
    monthStart,
} from "@/config/lib/testers";
import { STAFF_ACTIVE_WINDOW_DAYS } from "@/shared/constants/staffProfile";
import type { AdminTester, AdminTestersResponse } from "@/features/admin-testers/interfaces";

// ~300 testers: se devuelven todos y se filtran/paginan en el cliente.
export default createAdminHandler("testers", {
    GET: async (_req, res) => {
        const [allTime, recent, month] = await Promise.all([
            getAllTimeTesterCounts(),
            getTesterCountsSince(daysAgo(STAFF_ACTIVE_WINDOW_DAYS)),
            getTesterCountsSince(monthStart(new Date())),
        ]);

        // Testers con actividad reciente que aún no figuran en el acumulado.
        const ids = [...new Set([...allTime.map((row) => row.discord_id), ...recent.keys(), ...month.keys()])];
        const totals = new Map(allTime.map((row) => [row.discord_id, row.tests]));

        const [identities, overrides] = await Promise.all([getTesterIdentities(ids), getOverridesMap("tester", ids)]);

        const data: AdminTester[] = ids
            .map((id) => {
                const identity = identities.get(id);
                const override = overrides.get(id);
                return {
                    discord_id: id,
                    uuid: identity?.uuid ?? null,
                    nick: identity?.nick ?? null,
                    base_nick: identity?.base_nick ?? null,
                    nick_override: identity?.nick_override ?? null,
                    role_name: identity?.role_name ?? null,
                    role_colour: identity?.role_colour ?? null,
                    total_tests: totals.get(id) ?? 0,
                    recent_tests: recent.get(id) ?? 0,
                    month_tests: month.get(id) ?? 0,
                    hidden: identity?.hidden ?? false,
                    hidden_reason: identity?.hidden_reason ?? null,
                    hidden_at: override?.hidden_at?.toISOString() ?? null,
                    ...serializeMeta(override),
                };
            })
            .sort((a, b) => b.total_tests - a.total_tests || b.month_tests - a.month_tests);

        const body: AdminTestersResponse = { data };
        res.status(200).json(body);
    },
});
