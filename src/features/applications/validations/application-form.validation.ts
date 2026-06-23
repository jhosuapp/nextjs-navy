import { z } from "zod";

/**
 * Mensajes de validación. El cliente los inyecta localizados desde `t`;
 * el servidor usa `defaultMessages` (español) para validar el mismo payload.
 */
export type ApplicationMessages = {
    required: string;
    nombreLength: string;
    discord: string;
    edad: string;
    tooShort: string;
    tooLong: string;
    selectRequired: string;
    detailRequired: string;
    tipoRequired: string;
    modosRequired: string;
};

export const defaultApplicationMessages: ApplicationMessages = {
    required: "Este campo es obligatorio",
    nombreLength: "El nombre debe tener entre 2 y 60 caracteres",
    discord: "Ingresa un usuario de Discord válido",
    edad: "Ingresa una edad válida (13 a 99)",
    tooShort: "Desarrolla un poco más tu respuesta (mínimo 10 caracteres)",
    tooLong: "Has superado el máximo de caracteres permitido",
    selectRequired: "Selecciona una opción",
    detailRequired: "Por favor detalla tu respuesta",
    tipoRequired: "Selecciona a qué rol te postulas",
    modosRequired: "Selecciona al menos un modo",
};

const YES_NO = ["si", "no"] as const;
const TIPO = ["helper", "tester"] as const;
const MODOS = ["netherite", "crystal", "sword"] as const;

// Reglas del sistema nuevo de usernames de Discord: 2-32 chars,
// minúsculas/números/punto/guion bajo, sin puntos consecutivos.
const DISCORD_USERNAME = new RegExp("^(?!.*\\.\\.)[a-z0-9._]{2,32}$");

// Campos largos requeridos por rol (mínimo 10 caracteres).
const HELPER_LONG_FIELDS = [
    "labor_helper",
    "funciones_helper",
    "meta_principal",
    "opinion_tierlist",
    "usuarios_peleando",
    "testers_peleando",
    "ticket_tester",
    "ticket_reporte",
    "hacks_pvp",
] as const;

const HELPER_YESNO_FIELDS = [
    "claro_spam",
    "claro_flood",
    "conoce_hacks_ss",
    "tiempo_disciplina",
    "capacidad_resolucion",
    "se_enoja_facil",
] as const;

const HELPER_CONDITIONALS = [
    ["claro_spam", "detalle_spam"],
    ["claro_flood", "detalle_flood"],
    ["conoce_hacks_ss", "detalle_hacks_ss"],
] as const;

// Tester: campos cortos (min 2) y largos (min 10).
const TESTER_SHORT_FIELDS = ["region", "tier_modo"] as const;

const TESTER_LONG_FIELDS = [
    "opinion_navy",
    "por_que_tester",
    "tiempo_testeos",
    "servidores",
    "sospecha_hacks",
] as const;

const TESTER_YESNO_FIELDS = [
    "experiencia_tester",
    "baneado",
    "uso_cheats",
    "toxico",
    "clanes_pvp",
] as const;

const TESTER_CONDITIONALS = [
    ["experiencia_tester", "detalle_experiencia"],
    ["baneado", "detalle_baneado"],
    ["clanes_pvp", "detalle_clanes"],
] as const;

export const createApplicationSchema = (
    m: ApplicationMessages = defaultApplicationMessages
) => {
    const optText = (max = 1500) =>
        z.string().trim().max(max, m.tooLong).optional().or(z.literal(""));

    const optYesNo = z.enum(YES_NO).optional();

    const optionalDetail = z
        .string()
        .trim()
        .max(1500, m.tooLong)
        .optional()
        .or(z.literal(""));

    return z
        .object({
            // Datos personales (compartidos)
            nombre: z
                .string({ error: m.required })
                .trim()
                .min(2, m.nombreLength)
                .max(60, m.nombreLength),
            tipo: z.enum(TIPO, { error: m.tipoRequired }),
            discord: z
                .string({ error: m.required })
                .trim()
                .toLowerCase()
                .min(2, m.discord)
                .max(32, m.tooLong)
                .regex(DISCORD_USERNAME, m.discord),
            edad: z.coerce
                .number({ error: m.edad })
                .int(m.edad)
                .min(13, m.edad)
                .max(99, m.edad),

            // Campos de Helper (requeridos sólo si tipo === 'helper')
            labor_helper: optText(1000),
            funciones_helper: optText(1000),
            meta_principal: optText(1000),
            opinion_tierlist: optText(1500),
            usuarios_peleando: optText(1000),
            testers_peleando: optText(1000),
            ticket_tester: optText(1000),
            ticket_reporte: optText(1000),
            hacks_pvp: optText(1500),
            claro_spam: optYesNo,
            detalle_spam: optionalDetail,
            claro_flood: optYesNo,
            detalle_flood: optionalDetail,
            conoce_hacks_ss: optYesNo,
            detalle_hacks_ss: optionalDetail,
            tiempo_disciplina: optYesNo,
            capacidad_resolucion: optYesNo,
            se_enoja_facil: optYesNo,

            // Campos de Tester (requeridos sólo si tipo === 'tester')
            region: optText(60),
            modos: z.array(z.enum(MODOS)).optional(),
            tier_modo: optText(1000),
            opinion_navy: optText(1500),
            por_que_tester: optText(1500),
            tiempo_testeos: optText(1000),
            servidores: optText(1000),
            sospecha_hacks: optText(1500),
            experiencia_tester: optYesNo,
            detalle_experiencia: optionalDetail,
            baneado: optYesNo,
            detalle_baneado: optionalDetail,
            uso_cheats: optYesNo,
            toxico: optYesNo,
            clanes_pvp: optYesNo,
            detalle_clanes: optionalDetail,

            // Honeypot anti-bots: debe quedar vacío
            website: z.string().max(0).optional().or(z.literal("")),
        })
        .superRefine((data, ctx) => {
            const requireText = (field: string, min: number) => {
                const value = (data[field as keyof typeof data] as string | undefined)?.trim() ?? "";
                if (value.length < min) {
                    ctx.addIssue({
                        code: "custom",
                        path: [field],
                        message: min >= 10 ? m.tooShort : m.required,
                    });
                }
            };

            const requireYesNo = (field: string) => {
                if (!data[field as keyof typeof data]) {
                    ctx.addIssue({
                        code: "custom",
                        path: [field],
                        message: m.selectRequired,
                    });
                }
            };

            const requireDetails = (
                pairs: ReadonlyArray<readonly [string, string]>
            ) => {
                for (const [radio, detail] of pairs) {
                    if (data[radio as keyof typeof data] === "si") {
                        const value =
                            (data[detail as keyof typeof data] as string | undefined)?.trim() ?? "";
                        if (value.length < 10) {
                            ctx.addIssue({
                                code: "custom",
                                path: [detail],
                                message: m.detailRequired,
                            });
                        }
                    }
                }
            };

            if (data.tipo === "helper") {
                HELPER_LONG_FIELDS.forEach((f) => requireText(f, 10));
                HELPER_YESNO_FIELDS.forEach((f) => requireYesNo(f));
                requireDetails(HELPER_CONDITIONALS);
            }

            if (data.tipo === "tester") {
                TESTER_SHORT_FIELDS.forEach((f) => requireText(f, 2));
                TESTER_LONG_FIELDS.forEach((f) => requireText(f, 10));
                TESTER_YESNO_FIELDS.forEach((f) => requireYesNo(f));
                requireDetails(TESTER_CONDITIONALS);
                if (!data.modos || data.modos.length === 0) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["modos"],
                        message: m.modosRequired,
                    });
                }
            }
        });
};

export type ApplicationFormInterface = z.infer<
    ReturnType<typeof createApplicationSchema>
>;
