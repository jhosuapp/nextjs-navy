import { prisma } from "@/config/lib/prisma";
import { createAdminHandler } from "@/config/lib/adminHandler";
import { getOverridesMap } from "@/config/lib/adminOverrides";
import { serializeStaff } from "@/config/lib/adminSerializers";
import { getStaffProfilesMap, resolveStaffStatus } from "@/config/lib/staffProfiles";
import { daysAgo, getTesterCountsSince } from "@/config/lib/testers";
import { STAFF_ACTIVE_WINDOW_DAYS } from "@/shared/constants/staffProfile";
import type { AdminStaffResponse } from "@/features/admin-staff/interfaces";

// El staff es una lista corta: se devuelve entera y se filtra en el cliente.
export default createAdminHandler("staff", {
    GET: async (_req, res) => {
        const [members, overrides, profiles, totals] = await Promise.all([
            prisma.staff.findMany(),
            getOverridesMap("staff"),
            getStaffProfilesMap(),
            prisma.tier_testers.findMany(),
        ]);

        const ids = members.map((member) => member.discord_id);
        const recent = await getTesterCountsSince(daysAgo(STAFF_ACTIVE_WINDOW_DAYS), ids);
        const totalById = new Map(totals.map((row) => [row.discord_id, row.count]));

        const data = members
            .map((member) => {
                const total = totalById.get(member.discord_id) ?? 0;
                const recentTests = recent.get(member.discord_id) ?? 0;
                return serializeStaff(member, overrides.get(member.discord_id), profiles.get(member.discord_id), {
                    total_tests: total,
                    recent_tests: recentTests,
                    auto_status: resolveStaffStatus(null, recentTests, total > 0),
                });
            })
            .sort((a, b) => b.current.role_weight - a.current.role_weight);

        const body: AdminStaffResponse = { data };
        res.status(200).json(body);
    },
});
