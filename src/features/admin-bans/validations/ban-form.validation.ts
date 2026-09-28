import { z } from "zod";
import { ADMIN_RULES } from "@/shared/constants/admin";

export type BanFormMessages = {
    required: string;
    nick: string;
    reason: string;
    date: string;
};

export const createBanFormSchema = (m: BanFormMessages) =>
    z
        .object({
            nick: z
                .string()
                .trim()
                .refine((v) => v === "" || ADMIN_RULES.nickRegex.test(v), m.nick),
            reason: z.string().trim().min(1, m.required).max(ADMIN_RULES.reasonMax, m.reason),
            is_cheater: z.boolean(),
            permanent: z.boolean(),
            /** Valor de `<input type="datetime-local">`. */
            expiration: z.string(),
        })
        .refine((v) => v.permanent || !Number.isNaN(new Date(v.expiration).getTime()), {
            path: ["expiration"],
            message: m.date,
        });

export type BanFormValues = z.infer<ReturnType<typeof createBanFormSchema>>;
