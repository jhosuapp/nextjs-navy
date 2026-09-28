import { prisma } from "@/config/lib/prisma";
import { createAdminHandler, queryString } from "@/config/lib/adminHandler";
import { saveOverride } from "@/config/lib/adminOverrides";
import { refreshAfterChange } from "@/config/lib/adminRevalidate";
import { banPatchSchema } from "@/config/lib/adminValidation";

export default createAdminHandler("bans/[id]", {
    PATCH: async (req, res, session) => {
        const id = Number(queryString(req.query.id));
        if (!Number.isInteger(id) || id < 1) {
            return void res.status(400).json({ message: "Identificador inválido" });
        }

        const parsed = banPatchSchema.safeParse(req.body);
        if (!parsed.success) {
            return void res.status(400).json({ message: "Datos inválidos" });
        }

        const exists = await prisma.punishments.findUnique({ where: { id } });
        if (!exists) {
            return void res.status(404).json({ message: "Baneo no encontrado" });
        }

        const { expiration, expiration_mode, ...rest } = parsed.data;

        // Quitar el modo de expiración también limpia la fecha.
        const expirationPatch =
            expiration_mode === undefined
                ? {}
                : {
                      expiration_mode,
                      expiration:
                          expiration_mode === "date" && expiration ? new Date(expiration) : null,
                  };

        await saveOverride("ban", String(id), { ...rest, ...expirationPatch }, session.username);
        await refreshAfterChange(res, ["bans"]);

        res.status(200).json({ message: "Baneo actualizado" });
    },
});
