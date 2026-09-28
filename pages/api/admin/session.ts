import type { NextApiRequest, NextApiResponse } from "next";
import { withRateLimit } from "@/config/lib/rateLimit";
import { requireAdmin } from "@/config/lib/adminAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const session = await requireAdmin(req);

        if (!session) {
            return res.status(200).json({ authenticated: false });
        }

        return res.status(200).json({
            authenticated: true,
            username: session.username,
            role: session.role,
        });
    } catch (error) {
        console.error("[api/admin/session] GET failed:", error);
        return res.status(500).json({ message: "Error al validar la sesión" });
    }
}

export default withRateLimit(handler);
