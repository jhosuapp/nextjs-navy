// Config de Prisma para la base secundaria `ffa`.
// El CLI solo acepta un schema por config, asi que esta vive aparte de
// `prisma.config.ts` (que sigue apuntando a la base principal `Bot`).
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/ffa/schema.prisma",
  engine: "classic",
  datasource: {
    url: env("FFA_DATABASE_URL"),
  },
});
