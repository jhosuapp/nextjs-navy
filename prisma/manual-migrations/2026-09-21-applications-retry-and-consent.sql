-- Navy — migración manual sobre la base de datos `Bot`
-- Fecha: 2026-09-21
--
-- 1. Permite postulaciones repetidas (histórico) en lugar de una única por discord+tipo.
-- 2. Añade un índice de apoyo para la consulta de cooldown (última postulación).
-- 3. Añade la prueba de consentimiento de TyC / Política de Privacidad.
--
-- Ejecutar con un cliente MySQL contra `Bot` y después:
--   npm run prisma:pull && npm run prisma:generate
--   git diff prisma/schema.prisma   (db pull reescribe el fichero entero)

-- 1) Quitar el UNIQUE que impedía volver a postularse
ALTER TABLE applications        DROP INDEX discord_tipo;
ALTER TABLE tester_applications DROP INDEX discord_tipo_tester;

-- 2) Índice de apoyo para buscar la última postulación por discord+tipo
ALTER TABLE applications        ADD INDEX discord_tipo_created (discord, tipo, created_at);
ALTER TABLE tester_applications ADD INDEX discord_tipo_created_tester (discord, tipo, created_at);

-- 3) Consentimiento explícito de los términos (las filas previas quedan en 0)
ALTER TABLE applications
  ADD COLUMN acepta_terminos TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN terminos_version VARCHAR(16) NULL;

ALTER TABLE tester_applications
  ADD COLUMN acepta_terminos TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN terminos_version VARCHAR(16) NULL;
