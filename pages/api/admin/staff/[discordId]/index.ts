import { prisma } from "@/config/lib/prisma";
import { createAdminHandler, queryString } from "@/config/lib/adminHandler";
import { saveOverride } from "@/config/lib/adminOverrides";
import { refreshAfterChange } from "@/config/lib/adminRevalidate";
import { staffPatchSchema } from "@/config/lib/adminValidation";

export default createAdminHandler("staff/[discordId]", {
    PATCH: async (req, res, session) => {
        const discordId = queryString(req.query.discordId);
        if (!/^[\w-]{1,32}$/.test(discordId)) {
            return void res.status(400).json({ message: "Identificador inválido" });
        }

        const parsed = staffPatchSchema.safeParse(req.body);
        if (!parsed.success) {
            return void res.status(400).json({ message: "Datos inválidos" });
        }

        const exists = await prisma.staff.findUnique({ where: { discord_id: discordId } });
        if (!exists) {
            return void res.status(404).json({ message: "Miembro no encontrado" });
        }

        await saveOverride("staff", discordId, parsed.data, session.username);
        await refreshAfterChange(res, ["staff", "testers"]);

        res.status(200).json({ message: "Staff actualizado" });
    },
});
