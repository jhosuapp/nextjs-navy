import { prisma } from "@/config/lib/prisma";
import { createAdminHandler, queryString } from "@/config/lib/adminHandler";

const ALLOWED_STATUS = ["pendiente", "aceptado", "rechazado"] as const;
type AllowedStatus = (typeof ALLOWED_STATUS)[number];

const ALLOWED_KIND = ["helper", "tester"] as const;
type AllowedKind = (typeof ALLOWED_KIND)[number];

export default createAdminHandler("applications/[id]", {
    PATCH: async (req, res, session) => {
        const id = Number(queryString(req.query.id));
        if (!Number.isInteger(id) || id < 1) {
            return void res.status(400).json({ message: "Identificador inválido" });
        }

        const { status, kind } = req.body ?? {};
        if (!ALLOWED_STATUS.includes(status as AllowedStatus)) {
            return void res.status(400).json({ message: "Estado inválido" });
        }
        if (!ALLOWED_KIND.includes(kind as AllowedKind)) {
            return void res.status(400).json({ message: "Tipo inválido" });
        }

        // Actualización + auditoría (estado anterior → nuevo) en una sola transacción.
        const result = await prisma.$transaction(async (tx) => {
            const current =
                kind === "tester"
                    ? await tx.tester_applications.findUnique({ where: { id }, select: { status: true } })
                    : await tx.applications.findUnique({ where: { id }, select: { status: true } });

            if (!current) return null;
            if (current.status === status) return current;

            if (kind === "tester") {
                await tx.tester_applications.update({ where: { id }, data: { status } });
            } else {
                await tx.applications.update({ where: { id }, data: { status } });
            }

            await tx.admin_audit_log.create({
                data: {
                    admin_username: session.username,
                    action: "status_change",
                    entity: "application",
                    entity_key: `${kind}:${id}`,
                    before_data: JSON.stringify({ status: current.status }),
                    after_data: JSON.stringify({ status }),
                    created_at: new Date(),
                },
            });

            return current;
        });

        if (!result) {
            return void res.status(404).json({ message: "Postulación no encontrada" });
        }

        res.status(200).json({ message: "Estado actualizado" });
    },
});
