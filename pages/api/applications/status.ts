import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/config/lib/prisma";
import { withRateLimit } from "@/config/lib/rateLimit";
import { CooldownInfo, getCooldown } from "@/features/applications/helpers";

type StatusResponse = { canApply: true } | ({ canApply: false } & CooldownInfo);

// Mismo formato de username que el schema del formulario.
const DISCORD_USERNAME = new RegExp("^(?!.*\\.\\.)[a-z0-9._]{2,32}$");

const TIPOS = ["helper", "tester"] as const;
type Tipo = (typeof TIPOS)[number];

const parseTipo = (value: unknown): Tipo | null =>
    value === "helper" || value === "tester" ? value : null;

/**
 * Consulta si un usuario de Discord puede volver a postularse a un rol.
 * El formulario la usa en el primer paso para avisar antes de rellenarlo entero;
 * la validación real vuelve a hacerse al enviar en `POST /api/applications`.
 *
 * Sin `getCache`: cachear esta respuesta devolvería un cooldown desfasado.
 */
async function handler(req: NextApiRequest, res: NextApiResponse<StatusResponse>) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).end();
    }

    const discord = String(req.query.discord ?? "").trim().toLowerCase();
    const tipo = parseTipo(req.query.tipo);

    // Entrada inválida: que falle en el submit, no aquí.
    if (!tipo || !DISCORD_USERNAME.test(discord)) {
        return res.status(200).json({ canApply: true });
    }

    try {
        res.setHeader("Cache-Control", "no-store");

        const last =
            tipo === "tester"
                ? await prisma.tester_applications.findFirst({
                      where: { discord, tipo },
                      orderBy: { created_at: "desc" },
                      select: { created_at: true },
                  })
                : await prisma.applications.findFirst({
                      where: { discord, tipo },
                      orderBy: { created_at: "desc" },
                      select: { created_at: true },
                  });

        const cooldown = getCooldown(last?.created_at);

        return res
            .status(200)
            .json(cooldown ? { canApply: false, ...cooldown } : { canApply: true });
    } catch (error) {
        console.error("[api/applications/status] GET failed:", error);
        // No bloqueamos al usuario por un fallo de lectura.
        return res.status(200).json({ canApply: true });
    }
}

export default withRateLimit(handler);
