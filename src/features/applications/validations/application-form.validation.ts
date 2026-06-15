import { z } from "zod";

/**
 * Mensajes de validación. El cliente los inyecta localizados desde `t`;
 * el servidor usa `defaultMessages` (español) para validar el mismo payload.
 */
export type ApplicationMessages = {
    required: string;
    nombreLength: string;
    email: string;
    edad: string;
    tooShort: string;
    tooLong: string;
    selectRequired: string;
    detailRequired: string;
};

export const defaultApplicationMessages: ApplicationMessages = {
    required: "Este campo es obligatorio",
    nombreLength: "El nombre debe tener entre 2 y 60 caracteres",
    email: "Ingresa un correo válido",
    edad: "Ingresa una edad válida (13 a 99)",
    tooShort: "Desarrolla un poco más tu respuesta (mínimo 10 caracteres)",
    tooLong: "Has superado el máximo de caracteres permitido",
    selectRequired: "Selecciona una opción",
    detailRequired: "Por favor detalla tu respuesta",
};

const YES_NO = ["si", "no"] as const;

export const createApplicationSchema = (
    m: ApplicationMessages = defaultApplicationMessages
) => {
    const longText = (max = 1500) =>
        z
            .string({ error: m.required })
            .trim()
            .min(10, m.tooShort)
            .max(max, m.tooLong);

    const yesNo = z.enum(YES_NO, { error: m.selectRequired });

    const optionalDetail = z
        .string()
        .trim()
        .max(1500, m.tooLong)
        .optional()
        .or(z.literal(""));

    return z
        .object({
            // Datos personales
            nombre: z
                .string({ error: m.required })
                .trim()
                .min(2, m.nombreLength)
                .max(60, m.nombreLength),
            correo: z
                .string({ error: m.required })
                .trim()
                .min(1, m.required)
                .email(m.email)
                .max(120, m.tooLong),
            edad: z.coerce
                .number({ error: m.edad })
                .int(m.edad)
                .min(13, m.edad)
                .max(99, m.edad),

            // Conocimientos / criterio
            labor_helper: longText(1000),
            funciones_helper: longText(1000),

            claro_spam: yesNo,
            detalle_spam: optionalDetail,
            claro_flood: yesNo,
            detalle_flood: optionalDetail,
            conoce_hacks_ss: yesNo,
            detalle_hacks_ss: optionalDetail,

            opinion_tierlist: longText(1500),
            usuarios_peleando: longText(1000),
            testers_peleando: longText(1000),
            ticket_tester: longText(1000),
            ticket_reporte: longText(1000),
            hacks_pvp: longText(1500),

            tiempo_disciplina: yesNo,
            meta_principal: longText(1000),
            capacidad_resolucion: yesNo,
            se_enoja_facil: yesNo,

            // Honeypot anti-bots: debe quedar vacío
            website: z.string().max(0).optional().or(z.literal("")),
        })
        .superRefine((data, ctx) => {
            const conditionals: Array<[keyof typeof data, keyof typeof data]> = [
                ["claro_spam", "detalle_spam"],
                ["claro_flood", "detalle_flood"],
                ["conoce_hacks_ss", "detalle_hacks_ss"],
            ];

            for (const [radio, detail] of conditionals) {
                if (data[radio] === "si") {
                    const value = (data[detail] as string | undefined)?.trim() ?? "";
                    if (value.length < 10) {
                        ctx.addIssue({
                            code: "custom",
                            path: [detail as string],
                            message: m.detailRequired,
                        });
                    }
                }
            }
        });
};

export type ApplicationFormInterface = z.infer<
    ReturnType<typeof createApplicationSchema>
>;
