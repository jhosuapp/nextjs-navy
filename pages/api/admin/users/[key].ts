import { prisma } from "@/config/lib/prisma";
import { createAdminHandler, queryString } from "@/config/lib/adminHandler";
import { saveOverride } from "@/config/lib/adminOverrides";
import { refreshAfterChange } from "@/config/lib/adminRevalidate";
import { userPatchSchema } from "@/config/lib/adminValidation";

const NICK_KEY_PREFIX = "nick_";

export default createAdminHandler("users/[key]", {
    PATCH: async (req, res, session) => {
        const key = queryString(req.query.key).trim();
        if (!key || key.length > 80) {
            return void res.status(400).json({ message: "Identificador inválido" });
        }

        const parsed = userPatchSchema.safeParse(req.body);
        if (!parsed.success) {
            return void res.status(400).json({ message: "Datos inválidos" });
        }

        // La clave es el uuid o `nick_<nick>` para jugadores sin uuid.
        const where = key.startsWith(NICK_KEY_PREFIX)
            ? { uuid: null, nick: key.slice(NICK_KEY_PREFIX.length) }
            : { uuid: key };

        const exists = await prisma.tiers.findFirst({ where, select: { id: true } });
        if (!exists) {
            return void res.status(404).json({ message: "Jugador no encontrado" });
        }

        await saveOverride("user", key, parsed.data, session.username);
        await refreshAfterChange(res, ["home"]);

        res.status(200).json({ message: "Jugador actualizado" });
    },
});
