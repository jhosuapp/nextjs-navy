import type { NextApiRequest, NextApiResponse } from "next";
import { withRateLimit } from "./rateLimit";
import { AdminSession, requireAdmin } from "./adminAuth";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

export type AdminApiHandler = (
    req: NextApiRequest,
    res: NextApiResponse,
    session: AdminSession
) => Promise<void>;

/**
 * Envoltorio común de las API routes del panel admin:
 * rate limit → 405 por método → 401 sin sesión → try/catch → 500.
 */
export const createAdminHandler = (
    label: string,
    handlers: Partial<Record<Method, AdminApiHandler>>
) =>
    withRateLimit(async (req: NextApiRequest, res: NextApiResponse) => {
        const handler = handlers[req.method as Method];

        if (!handler) {
            res.setHeader("Allow", Object.keys(handlers).join(", "));
            return res.status(405).json({ message: "Method not allowed" });
        }

        const session = requireAdmin(req);
        if (!session) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        try {
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
