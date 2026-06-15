import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/config/lib/prisma";
import { withRateLimit } from "@/config/lib/rateLimit";
import { requireAdmin } from "@/config/lib/adminAuth";

const PAGE_SIZE = 20;

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
            created_at: row.created_at.toISOString(),
        }));

        return res.status(200).json({
            page,
            limit: PAGE_SIZE,
            total,
            totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
            data,
        });
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener postulaciones" });
    }
}

export default withRateLimit(handler);
