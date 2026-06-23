import type { NextApiRequest, NextApiResponse } from "next";
import { createHash } from "crypto";
import { prisma } from "@/config/lib/prisma";
import { withRateLimit } from "@/config/lib/rateLimit";
import { getCache, setCache } from "@/config/lib/cache";
import {
    createApplicationSchema,
    defaultApplicationMessages,
} from "@/features/applications/validations/application-form.validation";

// Una postulación por IP cada 30 min (anti-spam ligero, además del rate limit global)
const IP_THROTTLE_TTL = 30 * 60;

const getClientIp = (req: NextApiRequest): string =>
    (req.headers["x-real-ip"] as string) ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "unknown";

const hashIp = (ip: string): string =>
    createHash("sha256").update(ip).digest("hex").slice(0, 64);

// Elimina bytes nulos / caracteres de control que zod no filtra (sin tocar espacios)
const CONTROL_CHARS = new RegExp("[\\u0000-\\u001F\\u007F]", "g");
const sanitize = (value: string): string =>
    value.replace(CONTROL_CHARS, "").trim();

const toBool = (value: "si" | "no"): boolean => value === "si";

const cleanDetail = (
    radio: "si" | "no",
    detail?: string
): string | null => (radio === "si" && detail ? sanitize(detail) : null);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        // Honeypot: si un bot rellena el campo oculto, descartamos en silencio
        if (typeof req.body?.website === "string" && req.body.website.length > 0) {
            return res.status(200).json({ message: "ok" });
        }

        // Validación con el mismo schema del front (mensajes por defecto en español)
        const schema = createApplicationSchema(defaultApplicationMessages);
        const parsed = schema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Datos inválidos",
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const data = parsed.data;

        // Anti-spam por IP
        const ipHash = hashIp(getClientIp(req));
        const throttleKey = `apply:ip:${ipHash}`;
        const recent = await getCache<boolean>(throttleKey);
        if (recent) {
            return res.status(429).json({
                message: "Ya enviaste una postulación recientemente. Inténtalo más tarde.",
            });
        }

        // Una postulación por usuario de Discord y rol (helper/tester)
        const discord = sanitize(data.discord).toLowerCase();

        if (data.tipo === "tester") {
            const duplicated = await prisma.tester_applications.findFirst({
                where: { discord, tipo: data.tipo },
                select: { id: true },
            });
            if (duplicated) {
                return res.status(409).json({
                    message: "Ya existe una postulación de Discord para este rol.",
                });
            }

            await prisma.tester_applications.create({
                data: {
                    nombre: sanitize(data.nombre),
                    discord,
                    tipo: data.tipo,
                    edad: data.edad,
                    region: sanitize(data.region ?? ""),
                    modos: (data.modos ?? []).join(","),
                    tier_modo: sanitize(data.tier_modo ?? ""),
                    experiencia_tester: toBool(data.experiencia_tester ?? "no"),
                    detalle_experiencia: cleanDetail(
                        data.experiencia_tester ?? "no",
                        data.detalle_experiencia
                    ),
                    baneado: toBool(data.baneado ?? "no"),
                    detalle_baneado: cleanDetail(
                        data.baneado ?? "no",
                        data.detalle_baneado
                    ),
                    uso_cheats: toBool(data.uso_cheats ?? "no"),
                    opinion_navy: sanitize(data.opinion_navy ?? ""),
                    por_que_tester: sanitize(data.por_que_tester ?? ""),
                    tiempo_testeos: sanitize(data.tiempo_testeos ?? ""),
                    servidores: sanitize(data.servidores ?? ""),
                    clanes_pvp: toBool(data.clanes_pvp ?? "no"),
                    detalle_clanes: cleanDetail(
                        data.clanes_pvp ?? "no",
                        data.detalle_clanes
                    ),
                    toxico: toBool(data.toxico ?? "no"),
                    sospecha_hacks: sanitize(data.sospecha_hacks ?? ""),
                    ip_hash: ipHash,
                    created_at: new Date(),
                },
            });
        } else {
            const duplicated = await prisma.applications.findFirst({
                where: { discord, tipo: data.tipo },
                select: { id: true },
            });
            if (duplicated) {
                return res.status(409).json({
                    message: "Ya existe una postulación de Discord para este rol.",
                });
            }

            await prisma.applications.create({
                data: {
                    nombre: sanitize(data.nombre),
                    discord,
                    tipo: data.tipo,
                    edad: data.edad,
                    labor_helper: sanitize(data.labor_helper ?? ""),
                    funciones_helper: sanitize(data.funciones_helper ?? ""),
                    claro_spam: toBool(data.claro_spam ?? "no"),
                    detalle_spam: cleanDetail(data.claro_spam ?? "no", data.detalle_spam),
                    claro_flood: toBool(data.claro_flood ?? "no"),
                    detalle_flood: cleanDetail(data.claro_flood ?? "no", data.detalle_flood),
                    conoce_hacks_ss: toBool(data.conoce_hacks_ss ?? "no"),
                    detalle_hacks_ss: cleanDetail(
                        data.conoce_hacks_ss ?? "no",
                        data.detalle_hacks_ss
                    ),
                    opinion_tierlist: sanitize(data.opinion_tierlist ?? ""),
                    usuarios_peleando: sanitize(data.usuarios_peleando ?? ""),
                    testers_peleando: sanitize(data.testers_peleando ?? ""),
                    ticket_tester: sanitize(data.ticket_tester ?? ""),
                    ticket_reporte: sanitize(data.ticket_reporte ?? ""),
                    hacks_pvp: sanitize(data.hacks_pvp ?? ""),
                    tiempo_disciplina: toBool(data.tiempo_disciplina ?? "no"),
                    meta_principal: sanitize(data.meta_principal ?? ""),
                    capacidad_resolucion: toBool(data.capacidad_resolucion ?? "no"),
                    se_enoja_facil: toBool(data.se_enoja_facil ?? "no"),
                    ip_hash: ipHash,
                    created_at: new Date(),
                },
            });
        }

        await setCache(throttleKey, true, IP_THROTTLE_TTL);

        return res.status(201).json({ message: "Postulación enviada correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error al enviar la postulación" });
    }
}

export default withRateLimit(handler);
