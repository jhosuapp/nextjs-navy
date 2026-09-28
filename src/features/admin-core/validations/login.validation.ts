import { z } from "zod";

/**
 * Validación del login admin. El cliente inyecta mensajes localizados desde `t`;
 * el servidor usa `defaultLoginMessages` (español) para el mismo payload.
 */
export type LoginMessages = {
    required: string;
    usernameLength: string;
    passwordLength: string;
};

export const defaultLoginMessages: LoginMessages = {
    required: "Este campo es obligatorio",
    usernameLength: "El usuario debe tener entre 3 y 60 caracteres",
    passwordLength: "La contraseña debe tener al menos 6 caracteres",
};

export const createLoginSchema = (
    m: LoginMessages = defaultLoginMessages
) =>
    z.object({
        username: z
            .string({ error: m.required })
            .trim()
            .min(3, m.usernameLength)
            .max(60, m.usernameLength),
        password: z
            .string({ error: m.required })
            .min(6, m.passwordLength)
            .max(200, m.passwordLength),
    });

export type LoginFormInterface = z.infer<ReturnType<typeof createLoginSchema>>;
