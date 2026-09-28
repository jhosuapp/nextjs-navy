-- Navy — migración manual sobre la base de datos `Bot`
-- Fecha: 2026-09-28
--
-- Roles del panel admin. `founder` es el único que puede ver el registro de
-- actividad (`admin_audit_log`).
--
-- Solo AÑADE una columna a `admin_users` (tabla propia del panel; el bot no la usa).
-- Las filas existentes quedan como 'admin'. No borra ni modifica datos.
--
-- NO usar `prisma db pull`: el campo ya está escrito a mano en schema.prisma.

ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS role VARCHAR(16) NOT NULL DEFAULT 'admin';

-- Asignar fundadores (ejemplo):
--   UPDATE admin_users SET role = 'founder' WHERE username IN ('usuario1', 'usuario2');
