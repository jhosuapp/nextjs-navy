import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/config/lib/prisma";
import { withRateLimit } from "@/config/lib/rateLimit";
import { requireAdmin } from "@/config/lib/adminAuth";

const ALLOWED_STATUS = ["pendiente", "aceptado", "rechazado"] as const;
type AllowedStatus = (typeof ALLOWED_STATUS)[number];

const ALLOWED_KIND = ["helper", "tester"] as const;
type AllowedKind = (typeof ALLOWED_KIND)[number];

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PATCH") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    if (!requireAdmin(req)) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const rawId = Number(req.query.id);
    if (!Number.isInteger(rawId) || rawId < 1) {
        return res.status(400).json({ message: "Identificador inválido" });
    }

    const { status, kind } = req.body ?? {};
    if (!ALLOWED_STATUS.includes(status as AllowedStatus)) {
        return res.status(400).json({ message: "Estado inválido" });
    }
    if (!ALLOWED_KIND.includes(kind as AllowedKind)) {
        return res.status(400).json({ message: "Tipo inválido" });
    }

    try {
        if (kind === "tester") {
            await prisma.tester_applications.update({
                where: { id: rawId },
                data: { status: status as AllowedStatus },
            });
        } else {
            await prisma.applications.update({
                where: { id: rawId },
                data: { status: status as AllowedStatus },
            });
        }

        return res.status(200).json({ message: "Estado actualizado" });
    } catch (error) {
        console.error("[api/admin/applications/[id]] PATCH failed:", error);
        return res
            .status(500)
            .json({ message: "Error al actualizar el estado" });
    }
}

export default withRateLimit(handler);
