import { prisma } from "@/config/lib/prisma";
import { createAdminHandler } from "@/config/lib/adminHandler";
import { hashPassword, verifyPassword } from "@/config/lib/adminAuth";
import { writeAudit } from "@/config/lib/adminOverrides";
import { passwordChangeSchema } from "@/config/lib/adminValidation";

export default createAdminHandler("settings/password", {
    POST: async (req, res, session) => {
        const parsed = passwordChangeSchema.safeParse(req.body);
        if (!parsed.success) {
            return void res.status(400).json({ message: "Datos inválidos" });
        }

        const user = await prisma.admin_users.findUnique({ where: { id: session.uid } });
        if (!user || !verifyPassword(parsed.data.current, user.password_hash)) {
            return void res.status(403).json({ message: "La contraseña actual no es correcta" });
        }

        await prisma.admin_users.update({
            where: { id: user.id },
            data: { password_hash: hashPassword(parsed.data.next) },
        });

        // Nunca se registra la contraseña, solo el hecho.
        await writeAudit({ admin: session.username, action: "password_change" });

        res.status(200).json({ message: "Contraseña actualizada" });
    },
});
