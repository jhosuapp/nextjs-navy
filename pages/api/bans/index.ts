import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/config/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const punishments = await prisma.punishments.findMany({
            orderBy: {
                applied: "desc",
            },
        });

        const now = new Date();

        const formatted = punishments.map((p) => {
            const isPermanent = p.expiration === null;
            const isActive =
                isPermanent || (p.expiration && p.expiration > now);

            return {
                id: p.id,
                discord_id: p.discord_id,
                uuid: p.uuid,
                nick: p.nick,
                is_premium: p.is_premium,
                punisher_id: p.punisher_id,
                applied: p.applied,
                expiration: p.expiration,
                permanent: isPermanent,
                active: isActive,
                reason: p.reason,
                is_cheater: p.is_cheater,
            };
        });

        const active = formatted.filter((p) => p.active);
        const inactive = formatted.filter((p) => !p.active);

        res.status(200).json({
            active, 
            inactive,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo punishments" });
    }
}
