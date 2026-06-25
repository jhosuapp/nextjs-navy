import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/config/lib/prisma";
import { withRateLimit } from "@/config/lib/rateLimit";
import { requireAdmin } from "@/config/lib/adminAuth";

const PAGE_SIZE = 20;
// Cota de seguridad para el merge en memoria (volumen bajo esperado).
const MERGE_CAP = 500;

type KindFilter = "all" | "helper" | "tester";

const parseKind = (value: unknown): KindFilter =>
    value === "helper" || value === "tester" ? value : "all";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    if (!requireAdmin(req)) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const rawPage = Number(req.query.page ?? 1);
        const page =
            Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
        const skip = (page - 1) * PAGE_SIZE;
        const kind = parseKind(req.query.kind);

        if (kind === "helper") {
            const [total, rows] = await prisma.$transaction([
                prisma.applications.count(),
                prisma.applications.findMany({
                    orderBy: { created_at: "desc" },
                    skip,
                    take: PAGE_SIZE,
                }),
            ]);
            const data = rows.map((row) => ({
                ...row,
                kind: "helper" as const,
                created_at: row.created_at.toISOString(),
            }));
            return res.status(200).json({
                page,
                limit: PAGE_SIZE,
                total,
                totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
                data,
            });
        }

        if (kind === "tester") {
            const [total, rows] = await prisma.$transaction([
                prisma.tester_applications.count(),
                prisma.tester_applications.findMany({
                    orderBy: { created_at: "desc" },
                    skip,
                    take: PAGE_SIZE,
                }),
            ]);
            const data = rows.map((row) => ({
                ...row,
                kind: "tester" as const,
                created_at: row.created_at.toISOString(),
            }));
            return res.status(200).json({
                page,
                limit: PAGE_SIZE,
                total,
                totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
                data,
            });
        }

        // kind === "all": unir ambas tablas, ordenar por fecha y paginar en memoria.
        const [helperCount, testerCount, helperRows, testerRows] =
            await prisma.$transaction([
                prisma.applications.count(),
                prisma.tester_applications.count(),
                prisma.applications.findMany({
                    orderBy: { created_at: "desc" },
                    take: MERGE_CAP,
                }),
                prisma.tester_applications.findMany({
                    orderBy: { created_at: "desc" },
                    take: MERGE_CAP,
                }),
            ]);

        const merged = [
            ...helperRows.map((row) => ({ ...row, kind: "helper" as const })),
            ...testerRows.map((row) => ({ ...row, kind: "tester" as const })),
        ]
            .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
            .map((row) => ({ ...row, created_at: row.created_at.toISOString() }));

        const total = helperCount + testerCount;
        const data = merged.slice(skip, skip + PAGE_SIZE);

        return res.status(200).json({
            page,
            limit: PAGE_SIZE,
            total,
            totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
            data,
        });
    } catch (error) {
        console.error("[api/admin/applications] GET failed:", error);
        return res.status(500).json({ message: "Error al obtener postulaciones" });
    }
}

export default withRateLimit(handler);
