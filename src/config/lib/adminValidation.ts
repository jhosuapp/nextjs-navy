import { z } from "zod";
import { ADMIN_RULES } from "@/shared/constants/admin";

/**
 * Validación de los bodies de las API routes del panel admin. Los formularios
 * del cliente tienen sus propios esquemas con mensajes localizados, pero
 * comparten las reglas de `ADMIN_RULES`.
 *
 * Convención de los PATCH: campo ausente = no tocar, `null` = quitar el override.
 */

const nick = z.string().trim().regex(ADMIN_RULES.nickRegex).nullable().optional();
const hidden = z.boolean().optional();
const hiddenReason = z.string().trim().max(ADMIN_RULES.hiddenReasonMax).nullable().optional();

const notEmpty = (value: Record<string, unknown>): boolean =>
    Object.values(value).some((v) => v !== undefined);

export const staffPatchSchema = z
    .object({
        nick,
        role_name: z.string().trim().min(1).max(ADMIN_RULES.roleNameMax).nullable().optional(),
        role_colour: z.string().trim().regex(ADMIN_RULES.colourRegex).nullable().optional(),
        role_weight: z
            .number()
            .int()
            .min(ADMIN_RULES.roleWeightMin)
            .max(ADMIN_RULES.roleWeightMax)
            .nullable()
            .optional(),
        hidden,
        hidden_reason: hiddenReason,
    })
    .strict()
    .refine(notEmpty);

export const banPatchSchema = z
    .object({
        nick,
        reason: z.string().trim().min(1).max(ADMIN_RULES.reasonMax).nullable().optional(),
        is_cheater: z.boolean().nullable().optional(),
        expiration_mode: z.enum(["permanent", "date"]).nullable().optional(),
        expiration: z.iso.datetime().nullable().optional(),
        hidden,
        hidden_reason: hiddenReason,
    })
    .strict()
    .refine(notEmpty)
    .refine((v) => v.expiration_mode !== "date" || Boolean(v.expiration), {
        path: ["expiration"],
    });

export const userPatchSchema = z
    .object({ nick, hidden, hidden_reason: hiddenReason })
    .strict()
    .refine(notEmpty);

export const searchSchema = z.string().trim().max(ADMIN_RULES.searchMax).catch("");

export const pageSchema = z.coerce.number().int().min(1).max(100000).catch(1);

export const passwordChangeSchema = z
    .object({
        current: z.string().min(1).max(ADMIN_RULES.passwordMax),
        next: z.string().min(ADMIN_RULES.passwordMin).max(ADMIN_RULES.passwordMax),
    })
    .strict()
    .refine((v) => v.current !== v.next, { path: ["next"] });
