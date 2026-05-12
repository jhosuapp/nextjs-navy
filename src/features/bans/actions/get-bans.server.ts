import { prisma } from "@/config/lib/prisma";
import { BansResponse } from "../interfaces";

const EMPTY: BansResponse = { active: [], inactive: [] };

export async function fetchBansData(): Promise<{ data: BansResponse; revalidate: number }> {
    try {
        const punishments = await prisma.punishments.findMany({
            orderBy: { applied: 'desc' },
        });

        const now = new Date();

        const formatted = punishments.map((p) => ({
            id: p.id,
            uuid: p.uuid,
            nick: p.nick,
            is_premium: p.is_premium,
            applied: p.applied.toISOString(),
            expiration: p.expiration?.toISOString() ?? null,
            permanent: p.expiration === null,
            active: p.expiration === null || p.expiration > now,
            reason: p.reason,
            is_cheater: p.is_cheater,
        }));

        return {
            data: {
                active: formatted.filter((p) => p.active),
                inactive: formatted.filter((p) => !p.active),
            },
            revalidate: 86400,
        };
    } catch {
        return { data: EMPTY, revalidate: 1 };
    }
}
