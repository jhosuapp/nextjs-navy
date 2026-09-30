-- Navy — migración manual sobre la base de datos `Bot`
-- Fecha: 2026-09-30
--
-- Perfil público del staff (redes, bio, estado) editable desde el panel.
--
-- SOLO AÑADE UNA TABLA NUEVA. No modifica, vacía ni borra nada existente.
-- `staff` la sincroniza el bot, así que los datos extra viven aparte, una fila
-- por `staff.discord_id`. Las redes se guardan como handle (sin URL): la URL
-- se construye en el cliente.
--
-- Los nicks/ocultos de testers NO necesitan tabla: usan `admin_overrides`
-- con entity = 'tester' y entity_key = discord_id.
--
-- Ejecutar con un cliente MySQL contra `Bot` ANTES de desplegar.
-- NO usar `prisma db pull`: el modelo ya está escrito a mano en schema.prisma.

CREATE TABLE IF NOT EXISTS staff_profiles (
  discord_id       VARCHAR(32)  NOT NULL,
  bio              VARCHAR(160) NULL,
  status_mode      VARCHAR(10)  NULL,                 -- NULL = automático | 'active' | 'inactive' | 'paused'
  instagram        VARCHAR(40)  NULL,
  tiktok           VARCHAR(40)  NULL,
  youtube          VARCHAR(60)  NULL,
  twitch           VARCHAR(40)  NULL,
  x                VARCHAR(40)  NULL,
  discord_username VARCHAR(40)  NULL,
  github           VARCHAR(40)  NULL,
  linkedin         VARCHAR(100) NULL,
  show_namemc      TINYINT(1)   NOT NULL DEFAULT 1,
  updated_by       VARCHAR(60)  NOT NULL,
  updated_at       DATETIME     NOT NULL,
  PRIMARY KEY (discord_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
