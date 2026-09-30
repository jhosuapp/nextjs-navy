import type { NextApiResponse } from "next";
import { prisma } from "./prisma";
import { invalidateCacheByPrefix } from "./cache";

/**
 * Revalidación bajo demanda de las páginas ISR públicas y purga de `api_cache`.
 * Staff y baneos se regeneran cada 24 h; desde el panel se fuerza al instante.
 */

export const REVALIDATE_TARGETS = ["home", "staff", "bans", "testers"] as const;
export type RevalidateTarget = (typeof REVALIDATE_TARGETS)[number];

const TARGET_PATHS: Record<RevalidateTarget, string> = {
    home: "/",
    staff: "/staff-navy",
    bans: "/bans",
    testers: "/top-testers",
};

// Debe coincidir con `next-i18next.config.js`. El locale por defecto no lleva prefijo.
const DEFAULT_LOCALE = "es";
const LOCALES = ["es", "en", "pt"] as const;

const localizedPaths = (path: string): string[] =>
    LOCALES.map((locale) => {
        if (locale === DEFAULT_LOCALE) return path;
        return path === "/" ? `/${locale}` : `/${locale}${path}`;
    });

export type RevalidateResult = {
    target: RevalidateTarget;
    ok: boolean;
};

export async function revalidatePublic(
    res: NextApiResponse,
    targets: readonly RevalidateTarget[]
): Promise<RevalidateResult[]> {
    return Promise.all(
        targets.map(async (target) => {
            try {
                await Promise.all(
                    localizedPaths(TARGET_PATHS[target]).map((path) =>
                        res.revalidate(path)
                    )
                );
                return { target, ok: true };
            } catch (error) {
                console.error(`[adminRevalidate] ${target} failed:`, error);
                return { target, ok: false };
            }
        })
    );
}

/* -------------------------------------------------------------------------- */
/* api_cache                                                                  */
/* -------------------------------------------------------------------------- */

export const CACHE_GROUPS = ["profiles", "modes"] as const;
export type CacheGroup = (typeof CACHE_GROUPS)[number];

const CACHE_PREFIXES: Record<CacheGroup, string> = {
    profiles: "profile:",
    modes: "modes:",
};

// Claves que el panel NUNCA purga (anti-spam de postulaciones).
const PROTECTED_PREFIX = "apply:";

export type CacheGroupStats = {
    group: CacheGroup;
    total: number;
    expired: number;
};

export async function getCacheStats(): Promise<CacheGroupStats[]> {
    const now = new Date();

    return Promise.all(
        CACHE_GROUPS.map(async (group) => {
            const prefix = CACHE_PREFIXES[group];
            const [total, expired] = await Promise.all([
                prisma.api_cache.count({ where: { cache_key: { startsWith: prefix } } }),
                prisma.api_cache.count({
                    where: { cache_key: { startsWith: prefix }, expires_at: { lt: now } },
                }),
            ]);
            return { group, total, expired };
        })
    );
}

export async function purgeCacheGroup(group: CacheGroup): Promise<void> {
    await invalidateCacheByPrefix(CACHE_PREFIXES[group]);
}

/** Borra solo entradas caducadas (sin tocar las protegidas). Devuelve cuántas. */
export async function purgeExpiredCache(): Promise<number> {
    const { count } = await prisma.api_cache.deleteMany({
        where: {
            expires_at: { lt: new Date() },
            NOT: { cache_key: { startsWith: PROTECTED_PREFIX } },
        },
    });
    return count;
}

/**
 * Tras un cambio en el panel: purga cachés derivadas y revalida las páginas
 * afectadas. Nunca lanza: el cambio ya está guardado.
 */
export async function refreshAfterChange(
    res: NextApiResponse,
    targets: readonly RevalidateTarget[]
): Promise<void> {
    try {
        await purgeCacheGroup("profiles");
        await revalidatePublic(res, targets);
    } catch (error) {
        console.error("[adminRevalidate] refreshAfterChange failed:", error);
    }
}
