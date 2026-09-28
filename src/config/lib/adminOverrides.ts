import { Prisma } from "@prisma/client";
import type { admin_overrides, punishments, staff } from "@prisma/client";
import { prisma } from "./prisma";

/**
 * Overrides del panel admin.
 *
 * El bot de Discord sincroniza `staff`, `punishments` y `tiers`, así que el panel
 * nunca edita esas filas: guarda sus cambios en `admin_overrides` y se aplican
 * al leer. Cada columna NULL significa "sin override, usar el valor del bot" y
 * `hidden_at` no NULL es el soft delete (oculto en la web pública).
 */

export type OverrideEntity = "staff" | "ban" | "user";

export type AdminOverride = admin_overrides;

export type ExpirationMode = "permanent" | "date";

/** Campos editables de un override. `null` = quitar el override de ese campo. */
export type OverridePatch = Partial<
    Pick<
        admin_overrides,
        | "nick"
        | "role_name"
        | "role_colour"
        | "role_weight"
        | "reason"
        | "is_cheater"
        | "expiration_mode"
        | "expiration"
        | "hidden_reason"
    >
> & { hidden?: boolean };

export type AuditAction =
    | "update"
    | "hide"
    | "restore"
    | "revalidate"
    | "cache_purge"
    | "password_change"
    | "status_change";

const OVERRIDE_FIELDS = [
    "nick",
    "role_name",
    "role_colour",
    "role_weight",
    "reason",
    "is_cheater",
    "expiration_mode",
    "expiration",
    "hidden_at",
    "hidden_reason",
] as const;

type OverrideSnapshot = Partial<Record<(typeof OVERRIDE_FIELDS)[number], unknown>>;

const snapshot = (row: AdminOverride | null): OverrideSnapshot | null => {
    if (!row) return null;
    const out: OverrideSnapshot = {};
    for (const field of OVERRIDE_FIELDS) out[field] = row[field];
    return out;
};

/** Mapa `entity_key → override` de una entidad (opcionalmente acotado a claves). */
export async function getOverridesMap(
    entity: OverrideEntity,
    keys?: string[]
): Promise<Map<string, AdminOverride>> {
    if (keys && keys.length === 0) return new Map();

    const rows = await prisma.admin_overrides.findMany({
        where: keys ? { entity, entity_key: { in: keys } } : { entity },
    });

    return new Map(rows.map((row) => [row.entity_key, row]));
}

export const isHidden = (override?: AdminOverride | null): boolean =>
    Boolean(override?.hidden_at);

/* -------------------------------------------------------------------------- */
/* Staff                                                                      */
/* -------------------------------------------------------------------------- */

export const applyStaffOverride = (
    row: staff,
    override?: AdminOverride
): staff => ({
    ...row,
    nick: override?.nick ?? row.nick,
    staff_role_name: override?.role_name ?? row.staff_role_name,
    staff_role_colour: override?.role_colour ?? row.staff_role_colour,
    staff_role_weight: override?.role_weight ?? row.staff_role_weight,
});

/** Staff visible en la web pública, con overrides aplicados y reordenado por peso. */
export async function getPublicStaff(): Promise<staff[]> {
    const [members, overrides] = await Promise.all([
        prisma.staff.findMany(),
        getOverridesMap("staff"),
    ]);

    return members
        .filter((member) => !isHidden(overrides.get(member.discord_id)))
        .map((member) => applyStaffOverride(member, overrides.get(member.discord_id)))
        .sort((a, b) => b.staff_role_weight - a.staff_role_weight);
}

/* -------------------------------------------------------------------------- */
/* Baneos                                                                     */
/* -------------------------------------------------------------------------- */

export const applyBanOverride = (
    row: punishments,
    override?: AdminOverride
): punishments => {
    let expiration = row.expiration;
    if (override?.expiration_mode === "permanent") expiration = null;
    if (override?.expiration_mode === "date" && override.expiration) {
        expiration = override.expiration;
    }

    return {
        ...row,
        nick: override?.nick ?? row.nick,
        reason: override?.reason ?? row.reason,
        is_cheater: override?.is_cheater ?? row.is_cheater,
        expiration,
    };
};

/** Baneos visibles en la web pública, con overrides aplicados. */
export async function getPublicPunishments(): Promise<punishments[]> {
    const [rows, overrides] = await Promise.all([
        prisma.punishments.findMany({ orderBy: { applied: "desc" } }),
        getOverridesMap("ban"),
    ]);

    return rows
        .filter((row) => !isHidden(overrides.get(String(row.id))))
        .map((row) => applyBanOverride(row, overrides.get(String(row.id))));
}

/* -------------------------------------------------------------------------- */
/* Usuarios (tierlist)                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Tabla derivada que sustituye a `tiers` en las consultas públicas: excluye a
 * los usuarios ocultos y aplica el nick override. Se interpola así:
 *
 *     FROM ${visibleTiersSql} AS tiers
 *
 * La clave de usuario es la misma que usa toda la tierlist:
 * `COALESCE(uuid, CONCAT('nick_', nick))` calculada sobre el nick ORIGINAL.
 */
export const visibleTiersSql = Prisma.sql`(
    SELECT
        t.id, t.uuid, COALESCE(o.nick, t.nick) AS nick, t.is_premium,
        t.discord_id, t.tester_id, t.game, t.region, t.tier, t.is_high, t.date
    FROM tiers t
    LEFT JOIN admin_overrides o
        ON o.entity = 'user'
        AND o.entity_key = COALESCE(t.uuid, CONCAT('nick_', t.nick))
    WHERE o.hidden_at IS NULL
)`;

/* -------------------------------------------------------------------------- */
/* Escritura + auditoría                                                      */
/* -------------------------------------------------------------------------- */

const toAuditJson = (value: unknown): string | null =>
    value === null || value === undefined ? null : JSON.stringify(value);

export async function writeAudit(params: {
    admin: string;
    action: AuditAction;
    entity?: OverrideEntity | null;
    entityKey?: string | null;
    before?: unknown;
    after?: unknown;
}): Promise<void> {
    await prisma.admin_audit_log.create({
        data: {
            admin_username: params.admin,
            action: params.action,
            entity: params.entity ?? null,
            entity_key: params.entityKey ?? null,
            before_data: toAuditJson(params.before),
            after_data: toAuditJson(params.after),
            created_at: new Date(),
        },
    });
}

/**
 * Crea/actualiza el override de una entidad y deja constancia en la auditoría,
 * todo en una transacción. Nunca borra filas: "restaurar" es `hidden_at = NULL`
 * y "restablecer un campo" es ponerlo a `NULL`.
 */
export async function saveOverride(
    entity: OverrideEntity,
    entityKey: string,
    patch: OverridePatch,
    admin: string
): Promise<AdminOverride> {
    const { hidden, ...fields } = patch;
    const now = new Date();

    return prisma.$transaction(async (tx) => {
        const before = await tx.admin_overrides.findUnique({
            where: { entity_entity_key: { entity, entity_key: entityKey } },
        });

        const data: Prisma.admin_overridesUncheckedUpdateInput = {
            ...fields,
            updated_by: admin,
            updated_at: now,
        };

        if (hidden === true) {
            data.hidden_at = before?.hidden_at ?? now;
        } else if (hidden === false) {
            data.hidden_at = null;
            data.hidden_reason = null;
        }

        const after = await tx.admin_overrides.upsert({
            where: { entity_entity_key: { entity, entity_key: entityKey } },
            create: {
                entity,
                entity_key: entityKey,
                ...fields,
                hidden_at: hidden === true ? now : null,
                hidden_reason: hidden === true ? fields.hidden_reason ?? null : null,
                updated_by: admin,
                updated_at: now,
            },
            update: data,
        });

        let action: AuditAction = "update";
        if (hidden === true && !before?.hidden_at) action = "hide";
        if (hidden === false && before?.hidden_at) action = "restore";

        await tx.admin_audit_log.create({
            data: {
                admin_username: admin,
                action,
                entity,
                entity_key: entityKey,
                before_data: toAuditJson(snapshot(before)),
                after_data: toAuditJson(snapshot(after)),
                created_at: now,
            },
        });

        return after;
    });
}
