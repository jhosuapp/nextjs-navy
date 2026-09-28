import { z } from "zod";
import { ADMIN_RULES } from "@/shared/constants/admin";

export const createUserFormSchema = (nickMessage: string) =>
    z.object({
        nick: z
            .string()
            .trim()
            .refine((v) => v === "" || ADMIN_RULES.nickRegex.test(v), nickMessage),
    });

export type UserFormValues = z.infer<ReturnType<typeof createUserFormSchema>>;
