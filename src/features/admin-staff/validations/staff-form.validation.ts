import { z } from "zod";
import { ADMIN_RULES } from "@/shared/constants/admin";

export type StaffFormMessages = {
    required: string;
    nick: string;
    colour: string;
    weight: string;
    roleName: string;
};

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
    });

export type StaffFormValues = z.infer<ReturnType<typeof createStaffFormSchema>>;
