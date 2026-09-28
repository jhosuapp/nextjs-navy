import { prisma } from "@/config/lib/prisma";
import { createAdminHandler } from "@/config/lib/adminHandler";
import { getOverridesMap } from "@/config/lib/adminOverrides";
import { serializeStaff } from "@/config/lib/adminSerializers";
import type { AdminStaffResponse } from "@/features/admin-staff/interfaces";

// El staff es una lista corta: se devuelve entera y se filtra en el cliente.
export default createAdminHandler("staff", {
    GET: async (_req, res) => {
        const [members, overrides] = await Promise.all([
            prisma.staff.findMany(),
            getOverridesMap("staff"),
        ]);

        const data = members
            .map((member) => serializeStaff(member, overrides.get(member.discord_id)))
            .sort((a, b) => b.current.role_weight - a.current.role_weight);

        const body: AdminStaffResponse = { data };
        res.status(200).json(body);
    },
});
