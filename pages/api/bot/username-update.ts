import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/config/lib/prisma";
import { withRateLimit } from "@/config/lib/rateLimit";
import { invalidateCacheByPrefix } from "@/config/lib/cache";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { uuid, nick } = req.body;

        if (!uuid || !nick) {
            return res.status(400).json({ message: "uuid y nick son requeridos" });
        }

        const cleanUuid: string = uuid.replace(/-/g, "");
        const user = await prisma.staff.findFirst({ where: { uuid: cleanUuid } });

        if (!user) {
            return res.status(404).json({ message: "No existe un usuario con ese uuid" });
        }

        const mojangResponse = await fetch(
            `https://api.mojang.com/user/profile/${cleanUuid}`
        );

        if (!mojangResponse.ok) {
            return res.status(502).json({ message: "No se pudo verificar el nick con Mojang" });
        }

        const mojangData = await mojangResponse.json();

        if (!mojangData?.name || mojangData.name.toLowerCase() !== nick.toLowerCase()) {
            return res.status(400).json({ message: "El nick no coincide con el registrado en Mojang" });
        }

        // Actualizar el nick en los 3 modelos que lo tienen
        await Promise.all([
            prisma.staff.update({
                where: { discord_id: user.discord_id },
                data: { nick: mojangData.name },
            }),
            prisma.punishments.updateMany({
                where: { uuid },
                data: { nick: mojangData.name },
            }),
            prisma.tiers.updateMany({
                where: { uuid },
                data: { nick: mojangData.name },
            }),
        ]);

        await invalidateCacheByPrefix("profile:");

        return res.status(200).json({ message: "Nick actualizado correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error actualizando el nick" });
    }
}

export default withRateLimit(handler);