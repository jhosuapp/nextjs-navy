import { z } from "zod";
import { ADMIN_RULES } from "@/shared/constants/admin";

export type PasswordMessages = {
    required: string;
    length: string;
    mismatch: string;
    same: string;
};

export const createPasswordSchema = (m: PasswordMessages) =>
    z
        .object({
            current: z.string().min(1, m.required),
            next: z.string().min(ADMIN_RULES.passwordMin, m.length).max(ADMIN_RULES.passwordMax, m.length),
            confirm: z.string().min(1, m.required),
        })
        .refine((v) => v.next === v.confirm, { path: ["confirm"], message: m.mismatch })
        .refine((v) => v.next !== v.current, { path: ["next"], message: m.same });

export type PasswordFormValues = z.infer<ReturnType<typeof createPasswordSchema>>;
