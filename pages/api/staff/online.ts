import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/config/lib/prisma";
import { withRateLimit } from "@/config/lib/rateLimit";
import type { OnlineStaffResponse } from "@/features/staff/interfaces";

/**
 * Staff conectado ahora mismo. El bot mantiene `online_staff` (una fila por
 * `discord_id`). Es una tabla mínima, así que en vez de `api_cache` (que
 * escribiría en BD en cada refresco) se cachea en el CDN unos segundos.
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        // `online_staff` está @@ignore en Prisma (no tiene clave primaria).
        const rows = await prisma.$queryRaw<Array<{ discord_id: string }>>`
            SELECT DISTINCT discord_id FROM online_staff
        `;

        const body: OnlineStaffResponse = { ids: rows.map((row) => row.discord_id) };
        res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=30");
        return res.status(200).json(body);
    } catch (error) {
        console.error("[api/staff/online] GET failed:", error);
        return res.status(500).json({ message: "Error fetching online staff" });
    }
}

export default withRateLimit(handler);
