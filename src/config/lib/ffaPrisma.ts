import { PrismaClient } from "../../../prisma/generated/ffa"

const globalForFfaPrisma = globalThis as unknown as {
    ffaPrisma: PrismaClient | undefined
}

export const ffaPrisma =
    globalForFfaPrisma.ffaPrisma ??
    new PrismaClient({
        log: ["error"],
    })

if (process.env.NODE_ENV !== "production") {
    globalForFfaPrisma.ffaPrisma = ffaPrisma
}
