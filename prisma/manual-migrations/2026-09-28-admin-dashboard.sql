-- Navy — migración manual sobre la base de datos `Bot`
-- Fecha: 2026-09-28
--
-- Panel admin: overrides + soft delete + auditoría.
--
-- SOLO AÑADE TABLAS NUEVAS. No modifica, vacía ni borra nada existente.
-- Las tablas del bot (`staff`, `punishments`, `tiers`) NO se tocan: el bot las
-- sincroniza, así que los cambios del panel viven en `admin_overrides` y se
-- aplican al leer.
--
-- Ejecutar con un cliente MySQL contra `Bot` ANTES de desplegar el panel
-- (las consultas públicas de tierlist hacen JOIN contra `admin_overrides`).
-- NO usar `prisma db pull`: los modelos ya están escritos a mano en schema.prisma.
--
-- Charset/collation: `utf8mb4_general_ci`, igual que `tiers`/`staff`/`punishments`
-- (verificado el 2026-09-28 en MariaDB 10.11). `admin_overrides.entity_key` se
-- compara con columnas de `tiers` en un JOIN; con collations distintas MariaDB
-- lanzaría "Illegal mix of collations".

-- 1) Overrides por entidad. Una fila por entidad (staff/ban/user).
--    Cada columna NULL = "sin override, usa el valor del bot".
--    `hidden_at` no NULL = soft delete (oculto en la web pública).
CREATE TABLE IF NOT EXISTS admin_overrides (
  id              INT          NOT NULL AUTO_INCREMENT,
  entity          VARCHAR(16)  NOT NULL,              -- 'staff' | 'ban' | 'user'
  entity_key      VARCHAR(80)  NOT NULL,              -- staff.discord_id | punishments.id | COALESCE(uuid, CONCAT('nick_', nick))
  nick            VARCHAR(32)  NULL,
  role_name       VARCHAR(64)  NULL,
  role_colour     VARCHAR(7)   NULL,
  role_weight     INT          NULL,
  reason          TEXT         NULL,
  is_cheater      TINYINT(1)   NULL,
  expiration_mode VARCHAR(10)  NULL,                  -- NULL | 'permanent' | 'date'
  expiration      DATETIME     NULL,
  hidden_at       DATETIME     NULL,
  hidden_reason   VARCHAR(255) NULL,
  updated_by      VARCHAR(60)  NOT NULL,
  updated_at      DATETIME     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY entity_entity_key (entity, entity_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2) Registro de auditoría de todas las acciones del panel.
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id             INT         NOT NULL AUTO_INCREMENT,
  admin_username VARCHAR(60) NOT NULL,
  action         VARCHAR(32) NOT NULL,                -- update | hide | restore | revalidate | cache_purge | password_change
  entity         VARCHAR(16) NULL,
  entity_key     VARCHAR(80) NULL,
  before_data    TEXT        NULL,
  after_data     TEXT        NULL,
  created_at     DATETIME    NOT NULL,
  PRIMARY KEY (id),
  KEY created_at_idx (created_at),
  KEY entity_idx (entity, entity_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
