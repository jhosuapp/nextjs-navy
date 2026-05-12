import { prisma } from "@/config/lib/prisma";
import { BansResponse } from "../interfaces";

export async function fetchBansData(): Promise<BansResponse> {
    const punishments = await prisma.punishments.findMany({
        orderBy: { applied: 'desc' },
    });

    const now = new Date();

    const formatted = punishments.map((p) => ({
        id: p.id,
        discord_id: p.discord_id,
        uuid: p.uuid,
        nick: p.nick,
        is_premium: p.is_premium,
        punisher_id: p.punisher_id,
        applied: p.applied.toISOString(),
        expiration: p.expiration?.toISOString() ?? null,
        permanent: p.expiration === null,
        active: p.expiration === null || p.expiration > now,
        reason: p.reason,
        is_cheater: p.is_cheater,
    }));

    return {
        active: formatted.filter((p) => p.active),
        inactive: formatted.filter((p) => !p.active),
    };
}
