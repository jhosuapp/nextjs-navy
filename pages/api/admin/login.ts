import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/config/lib/prisma";
import { withRateLimit } from "@/config/lib/rateLimit";
import {
    buildSessionCookie,
    createSessionToken,
    verifyPassword,
} from "@/config/lib/adminAuth";
import {
    createLoginSchema,
    defaultLoginMessages,
} from "@/features/admin-applications/validations/login.validation";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const schema = createLoginSchema(defaultLoginMessages);
        const parsed = schema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ message: "Datos inválidos" });
        }

        const { username, password } = parsed.data;

        const user = await prisma.admin_users.findUnique({
            where: { username },
        });

        // Mensaje genérico: no revelar si el usuario existe.
        if (!user || !verifyPassword(password, user.password_hash)) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const token = createSessionToken({ uid: user.id, username: user.username });
        res.setHeader("Set-Cookie", buildSessionCookie(token));

        return res.status(200).json({ username: user.username });
    } catch (error) {
        console.error("[api/admin/login] POST failed:", error);
        return res.status(500).json({ message: "Error al iniciar sesión" });
    }
}

export default withRateLimit(handler);
