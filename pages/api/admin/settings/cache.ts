import { z } from "zod";
import { createAdminHandler } from "@/config/lib/adminHandler";
import { writeAudit } from "@/config/lib/adminOverrides";
import {
    CACHE_GROUPS,
    getCacheStats,
    purgeCacheGroup,
    purgeExpiredCache,
} from "@/config/lib/adminRevalidate";
import type {
    CachePurgeResponse,
    CacheStatsResponse,
} from "@/features/admin-settings/interfaces";

const purgeSchema = z.union([
    z.object({ group: z.enum(CACHE_GROUPS) }).strict(),
    z.object({ expired: z.literal(true) }).strict(),
]);

export default createAdminHandler("settings/cache", {
    GET: async (_req, res) => {
        const body: CacheStatsResponse = { groups: await getCacheStats() };
        res.status(200).json(body);
    },

    DELETE: async (req, res, session) => {
        const parsed = purgeSchema.safeParse(req.body);
        if (!parsed.success) {
            return void res.status(400).json({ message: "Datos inválidos" });
        }

        let body: CachePurgeResponse;
        if ("group" in parsed.data) {
            await purgeCacheGroup(parsed.data.group);
            body = { message: "Caché purgada" };
        } else {
            const removed = await purgeExpiredCache();
            body = { message: "Entradas caducadas eliminadas", removed };
        }

        await writeAudit({ admin: session.username, action: "cache_purge", after: parsed.data });
        res.status(200).json(body);
    },
});
