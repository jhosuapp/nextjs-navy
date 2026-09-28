import type { NextApiRequest, NextApiResponse } from "next";
import { withRateLimit } from "./rateLimit";
import { AdminRole, AdminSession, requireAdmin } from "./adminAuth";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

export type AdminApiHandler = (
    req: NextApiRequest,
    res: NextApiResponse,
    session: AdminSession
) => Promise<void>;

/**
 * Envoltorio común de las API routes del panel admin:
 * rate limit → 405 por método → 401 sin sesión → 403 sin rol → try/catch → 500.
 *
 * `options.roles` restringe la ruta a esos roles (p. ej. solo `founder`).
 */
export const createAdminHandler = (
    label: string,
    handlers: Partial<Record<Method, AdminApiHandler>>,
    options: { roles?: readonly AdminRole[] } = {}
) =>
    withRateLimit(async (req: NextApiRequest, res: NextApiResponse) => {
        const handler = handlers[req.method as Method];

        if (!handler) {
            res.setHeader("Allow", Object.keys(handlers).join(", "));
            return res.status(405).json({ message: "Method not allowed" });
        }

        try {
            const session = await requireAdmin(req);
            if (!session) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (options.roles && !options.roles.includes(session.role)) {
                return res.status(403).json({ message: "Forbidden" });
            }

            await handler(req, res, session);
        } catch (error) {
            console.error(`[api/admin/${label}] ${req.method} failed:`, error);
            if (!res.headersSent) {
                res.status(500).json({ message: "Internal error" });
            }
        }
    });

/** Primer valor de un query param como string. */
export const queryString = (value: string | string[] | undefined): string =>
    (Array.isArray(value) ? value[0] : value) ?? "";
