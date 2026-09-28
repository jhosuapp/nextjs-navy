import { z } from "zod";
import { createAdminHandler } from "@/config/lib/adminHandler";
import { writeAudit } from "@/config/lib/adminOverrides";
import { REVALIDATE_TARGETS, revalidatePublic } from "@/config/lib/adminRevalidate";
import type { RevalidateResponse } from "@/features/admin-settings/interfaces";

const bodySchema = z
    .object({ targets: z.array(z.enum(REVALIDATE_TARGETS)).min(1).max(REVALIDATE_TARGETS.length) })
    .strict();

export default createAdminHandler("settings/revalidate", {
    POST: async (req, res, session) => {
        const parsed = bodySchema.safeParse(req.body);
        if (!parsed.success) {
            return void res.status(400).json({ message: "Datos inválidos" });
        }

        const targets = [...new Set(parsed.data.targets)];
        const results = await revalidatePublic(res, targets);

        await writeAudit({ admin: session.username, action: "revalidate", after: results });

        const body: RevalidateResponse = { results };
        res.status(results.every((r) => r.ok) ? 200 : 207).json(body);
    },
});
