import type { NextApiRequest, NextApiResponse } from "next";
import { withRateLimit } from "@/config/lib/rateLimit";
import { buildClearCookie } from "@/config/lib/adminAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    res.setHeader("Set-Cookie", buildClearCookie());
    return res.status(200).json({ message: "Sesión cerrada" });
}

export default withRateLimit(handler);
