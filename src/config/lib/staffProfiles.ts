import { Prisma } from "@prisma/client";
import type { staff_profiles } from "@prisma/client";
import { prisma } from "./prisma";
import { StaffStatus } from "@/shared/constants/staffProfile";

/**
 * Perfil público del staff (redes, bio y estado), editado desde el panel.
 * Vive en `staff_profiles` porque `staff` la re-sincroniza el bot.
 */

export type StaffProfileFields = Pick<
    staff_profiles,
    "bio" | "status_mode" | "instagram" | "tiktok" | "youtube" | "twitch" | "x" | "github" | "linkedin" | "discord_username" | "show_namemc"
>;

export type StaffProfilePatch = Partial<StaffProfileFields>;

export const PROFILE_FIELDS = [
    "bio",
    "status_mode",
    "instagram",
    "tiktok",
    "youtube",
    "twitch",
    "x",
    "github",
    "linkedin",
    "discord_username",
    "show_namemc",
] as const satisfies ReadonlyArray<keyof StaffProfileFields>;

export const EMPTY_PROFILE: StaffProfileFields = {
    bio: null,
    status_mode: null,
    instagram: null,
    tiktok: null,
    youtube: null,
    twitch: null,
    x: null,
    github: null,
    linkedin: null,
    discord_username: null,
    show_namemc: true,
};

export const pickProfile = (row?: staff_profiles | null): StaffProfileFields => {
    if (!row) return { ...EMPTY_PROFILE };
    const out = { ...EMPTY_PROFILE };
    for (const field of PROFILE_FIELDS) (out as Record<string, unknown>)[field] = row[field];
    return out;
};

export async function getStaffProfilesMap(ids?: string[]): Promise<Map<string, staff_profiles>> {
    if (ids && ids.length === 0) return new Map();
    try {
        const rows = await prisma.staff_profiles.findMany(ids ? { where: { discord_id: { in: ids } } } : undefined);
        return new Map(rows.map((row) => [row.discord_id, row]));
    } catch (error) {
        // P2021 = la tabla no existe: la migración manual aún no se ha aplicado.
        // Se degrada a "sin perfiles" para no tumbar la página de staff.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
            console.warn("[staffProfiles] tabla staff_profiles no encontrada; aplica prisma/manual-migrations/2026-09-30-staff-profiles.sql");
            return new Map();
        }
        throw error;
    }
}

/**
 * Estado efectivo: el que fije el panel o, en automático, "activo" si ha hecho
 * tests en la ventana reciente. Quien no es tester nunca pasa a "inactivo" en
 * automático (su rol no hace tests).
 */
export const resolveStaffStatus = (
    mode: string | null,
    recentTests: number,
    isTester: boolean
): StaffStatus | null => {
    if (mode === "active" || mode === "inactive" || mode === "paused") return mode;
    if (!isTester) return null;
    return recentTests > 0 ? "active" : "inactive";
};

/** Crea/actualiza el perfil y lo registra en la auditoría, en una transacción. */
export async function saveStaffProfile(
    discordId: string,
    patch: StaffProfilePatch,
    admin: string
): Promise<staff_profiles> {
    const now = new Date();

    return prisma.$transaction(async (tx) => {
        const before = await tx.staff_profiles.findUnique({ where: { discord_id: discordId } });

        const after = await tx.staff_profiles.upsert({
            where: { discord_id: discordId },
            create: { ...EMPTY_PROFILE, ...patch, discord_id: discordId, updated_by: admin, updated_at: now },
            update: { ...patch, updated_by: admin, updated_at: now },
        });

        await tx.admin_audit_log.create({
            data: {
                admin_username: admin,
                action: "update",
                entity: "staff_profile",
                entity_key: discordId,
                before_data: before ? JSON.stringify(pickProfile(before)) : null,
                after_data: JSON.stringify(pickProfile(after)),
                created_at: now,
            },
        });

        return after;
    });
}
