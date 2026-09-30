import { prisma } from "@/config/lib/prisma";
import { createAdminHandler, queryString } from "@/config/lib/adminHandler";
import { saveOverride } from "@/config/lib/adminOverrides";
import { refreshAfterChange } from "@/config/lib/adminRevalidate";
import { testerPatchSchema } from "@/config/lib/adminValidation";
import { SYSTEM_TESTER_ID } from "@/config/lib/testers";

export default createAdminHandler("testers/[discordId]", {
    PATCH: async (req, res, session) => {
        const discordId = queryString(req.query.discordId);
        if (!/^\d{1,32}$/.test(discordId) || discordId === SYSTEM_TESTER_ID) {
            return void res.status(400).json({ message: "Identificador inválido" });
        }

        const parsed = testerPatchSchema.safeParse(req.body);
        if (!parsed.success) {
            return void res.status(400).json({ message: "Datos inválidos" });
        }

        const [total, activity] = await Promise.all([
            prisma.tier_testers.findUnique({ where: { discord_id: discordId } }),
            prisma.$queryRaw<Array<{ n: bigint }>>`SELECT COUNT(*) AS n FROM tester_activity WHERE tester_id = ${discordId}`,
        ]);
        if (!total && Number(activity[0]?.n ?? 0) === 0) {
            return void res.status(404).json({ message: "Tester no encontrado" });
        }

        await saveOverride("tester", discordId, parsed.data, session.username);
        await refreshAfterChange(res, ["testers"]);

        res.status(200).json({ message: "Tester actualizado" });
    },
});
