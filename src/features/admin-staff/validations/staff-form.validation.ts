import { z } from "zod";
import { ADMIN_RULES } from "@/shared/constants/admin";
import { normalizeHandle, socialRegex, STAFF_PROFILE_RULES, STAFF_STATUS_MODES, StaffSocialKey } from "@/shared/constants/staffProfile";

export type StaffFormMessages = {
    required: string;
    nick: string;
    colour: string;
    weight: string;
    roleName: string;
    bio: string;
    handle: string;
};

/** Campos del formulario que van a `admin_overrides` (el resto, a `staff_profiles`). */
export const STAFF_OVERRIDE_FORM_FIELDS = ["nick", "role_name", "role_colour", "role_weight"] as const;

/** Red social opcional: vacío = sin red; si no, se normaliza y valida como en la API. */
const social = (key: StaffSocialKey, message: string) =>
    z
        .string()
        .trim()
        .refine((v) => v === "" || socialRegex(key).test(normalizeHandle(key, v)), message);

/** Valores del formulario como strings (inputs nativos); se convierten al enviar. */
export const createStaffFormSchema = (m: StaffFormMessages) =>
    z.object({
        nick: z
            .string()
            .trim()
            .refine((v) => v === "" || ADMIN_RULES.nickRegex.test(v), m.nick),
        role_name: z.string().trim().min(1, m.required).max(ADMIN_RULES.roleNameMax, m.roleName),
        role_colour: z.string().trim().regex(ADMIN_RULES.colourRegex, m.colour),
        role_weight: z
            .string()
            .trim()
            .regex(/^-?\d+$/, m.weight)
            .refine((v) => {
                const n = Number(v);
                return n >= ADMIN_RULES.roleWeightMin && n <= ADMIN_RULES.roleWeightMax;
            }, m.weight),
        // Perfil público
        bio: z.string().trim().max(STAFF_PROFILE_RULES.bioMax, m.bio),
        status_mode: z.enum(["auto", ...STAFF_STATUS_MODES]),
        instagram: social("instagram", m.handle),
        tiktok: social("tiktok", m.handle),
        youtube: social("youtube", m.handle),
        twitch: social("twitch", m.handle),
        x: social("x", m.handle),
        github: social("github", m.handle),
        linkedin: social("linkedin", m.handle),
        discord_username: social("discord_username", m.handle),
        show_namemc: z.boolean(),
        song: z
            .object({
                id: z.string().regex(/^[A-Za-z0-9]{22}$/),
                title: z.string(),
                artist: z.string(),
                cover: z.string().nullable(),
            })
            .nullable(),
    });

export type StaffFormValues = z.infer<ReturnType<typeof createStaffFormSchema>>;
