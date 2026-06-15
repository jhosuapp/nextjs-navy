// Seed manual de usuarios del panel admin.
//
// Uso:
//   node prisma/seed-admin.mjs <username> <password>
//
// No hay credenciales por defecto: las contraseñas no deben quedar en el repo.
// Requiere `npx prisma db push && npx prisma generate` previo (tabla admin_users).

import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "crypto";

const prisma = new PrismaClient();

// Mismo algoritmo que src/config/lib/adminAuth.ts -> hashPassword.
const hashPassword = (plain) => {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(plain, salt, 64).toString("hex");
    return `${salt}:${hash}`;
};

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
    console.error("Uso: node prisma/seed-admin.mjs <username> <password>");
    process.exit(1);
}

async function main() {
    const password_hash = hashPassword(password);

    const user = await prisma.admin_users.upsert({
        where: { username },
        update: { password_hash },
        create: { username, password_hash, created_at: new Date() },
    });

    console.log(`✓ Usuario admin "${user.username}" (id ${user.id}) listo.`);
}

main()
    .catch((error) => {
        console.error("✗ Error creando el usuario admin:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
