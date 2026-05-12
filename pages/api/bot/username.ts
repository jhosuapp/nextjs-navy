import type { NextApiRequest, NextApiResponse } from "next";
import { withRateLimit } from "@/config/lib/rateLimit";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { uuid } = req.query;

    if (!uuid || typeof uuid !== "string") {
        return res.status(400).json({ message: "UUID requerido" });
    }

    try {
        // Mojang necesita el UUID sin guiones
        const cleanUuid = uuid.replace(/-/g, "");

        const response = await fetch(
            `https://api.mojang.com/user/profile/${cleanUuid}`
        );

        if (!response.ok) {
            return res.status(response.status).json({
                message: "Usuario no encontrado en Mojang",
            });
        }

        const data = await response.json();

        return res.status(200).json({
            uuid: data.id,
            username: data.name,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error consultando Mojang",
        });
    }
}

export default withRateLimit(handler);
