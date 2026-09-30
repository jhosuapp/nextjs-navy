import type { punishments, staff, staff_profiles } from "@prisma/client";
import type { AdminOverride } from "./adminOverrides";
import { applyBanOverride, applyStaffOverride } from "./adminOverrides";
import { pickProfile } from "./staffProfiles";
import type { HiddenState, OverrideMeta } from "@/features/admin-core/interfaces";
import type { AdminStaffMember, StaffActivity, StaffEditableFields, StaffProfileFields } from "@/features/admin-staff/interfaces";
import type { AdminBan, BanEditableFields, BanOverrides } from "@/features/admin-bans/interfaces";

/**
 * Convierte filas del bot + override en el formato que consume el panel:
 * valores efectivos, originales y qué campos tienen override.
 */

export const serializeHidden = (override?: AdminOverride): HiddenState => ({
    hidden: Boolean(override?.hidden_at),
    hidden_reason: override?.hidden_reason ?? null,
    hidden_at: override?.hidden_at?.toISOString() ?? null,
});

export const serializeMeta = (override?: AdminOverride): OverrideMeta => ({
    updated_by: override?.updated_by ?? null,
    updated_at: override?.updated_at?.toISOString() ?? null,
});

const staffFields = (row: staff): StaffEditableFields => ({
    nick: row.nick,
    role_name: row.staff_role_name,
    role_colour: row.staff_role_colour,
    role_weight: row.staff_role_weight,
});

export const serializeStaff = (
    row: staff,
    override: AdminOverride | undefined,
    profile: staff_profiles | undefined,
    activity: StaffActivity
): AdminStaffMember => {
    const overrides: Partial<StaffEditableFields> = {};
    if (override?.nick != null) overrides.nick = override.nick;
    if (override?.role_name != null) overrides.role_name = override.role_name;
    if (override?.role_colour != null) overrides.role_colour = override.role_colour;
    if (override?.role_weight != null) overrides.role_weight = override.role_weight;

    return {
        discord_id: row.discord_id,
        uuid: row.uuid,
        is_premium: row.is_premium,
        role_id: row.staff_role_id,
        current: staffFields(applyStaffOverride(row, override)),
        original: staffFields(row),
        overrides,
        profile: pickProfile(profile) as StaffProfileFields,
        activity,
        ...serializeHidden(override),
        ...serializeMeta(override),
    };
};

const banFields = (row: punishments): BanEditableFields => ({
    nick: row.nick,
    reason: row.reason,
    is_cheater: row.is_cheater,
    expiration: row.expiration?.toISOString() ?? null,
});

export const serializeBan = (
    row: punishments,
    override: AdminOverride | undefined,
    now: Date
): AdminBan => {
    const effective = applyBanOverride(row, override);

    const overrides: BanOverrides = {};
    if (override?.nick != null) overrides.nick = override.nick;
    if (override?.reason != null) overrides.reason = override.reason;
    if (override?.is_cheater != null) overrides.is_cheater = override.is_cheater;
    if (override?.expiration_mode === "permanent" || override?.expiration_mode === "date") {
        overrides.expiration_mode = override.expiration_mode;
        overrides.expiration = override.expiration?.toISOString() ?? null;
    }

    return {
        id: row.id,
        uuid: row.uuid,
        is_premium: row.is_premium,
        punisher_id: row.punisher_id,
        applied: row.applied.toISOString(),
        active: effective.expiration === null || effective.expiration > now,
        current: banFields(effective),
        original: banFields(row),
        overrides,
        ...serializeHidden(override),
        ...serializeMeta(override),
    };
};

/** Pagina un array ya filtrado. */
export const paginate = <T,>(items: T[], page: number, limit: number) => {
    const totalPages = Math.max(1, Math.ceil(items.length / limit));
    const safePage = Math.min(page, totalPages);
    return {
        page: safePage,
        limit,
        total: items.length,
        totalPages,
        data: items.slice((safePage - 1) * limit, safePage * limit),
    };
};

/** Búsqueda insensible a mayúsculas sobre varios campos. */
export const matchesSearch = (search: string, ...values: (string | null | undefined)[]): boolean => {
    if (!search) return true;
    const needle = search.toLowerCase();
    return values.some((value) => value?.toLowerCase().includes(needle));
};
