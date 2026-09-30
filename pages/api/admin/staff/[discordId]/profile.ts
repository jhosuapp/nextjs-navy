import { Prisma } from "@prisma/client";
import { prisma } from "@/config/lib/prisma";
import { createAdminHandler, queryString } from "@/config/lib/adminHandler";
import { refreshAfterChange } from "@/config/lib/adminRevalidate";
import { saveStaffProfile } from "@/config/lib/staffProfiles";
import { staffProfilePatchSchema } from "@/config/lib/adminValidation";

export default createAdminHandler("staff/[discordId]/profile", {
    PATCH: async (req, res, session) => {
        const discordId = queryString(req.query.discordId);
        if (!/^[\w-]{1,32}$/.test(discordId)) {
            return void res.status(400).json({ message: "Identificador inválido" });
        }

        const parsed = staffProfilePatchSchema.safeParse(req.body);
        if (!parsed.success) {
            return void res.status(400).json({ message: "Datos inválidos" });
        }

        const exists = await prisma.staff.findUnique({ where: { discord_id: discordId } });
        if (!exists) {
            return void res.status(404).json({ message: "Miembro no encontrado" });
        }

        try {
            await saveStaffProfile(discordId, parsed.data, session.username);
        } catch (error) {
            // P2021 = la tabla no existe: falta aplicar la migración manual.
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
                return void res.status(503).json({
                    message: "Falta la tabla staff_profiles: aplica prisma/manual-migrations/2026-09-30-staff-profiles.sql",
                });
            }
            throw error;
        }
        await refreshAfterChange(res, ["staff"]);

        res.status(200).json({ message: "Perfil actualizado" });
    },
});
