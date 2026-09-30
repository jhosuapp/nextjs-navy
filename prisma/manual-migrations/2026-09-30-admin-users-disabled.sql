-- Navy — migración manual sobre la base de datos `Bot`
-- Fecha: 2026-09-30
--
-- Desactivar cuentas del panel admin sin borrarlas.
--
-- Solo AÑADE una columna a `admin_users` (tabla propia del panel; el bot no la usa).
-- NULL = cuenta activa. Con fecha = desactivada: no puede iniciar sesión y su
-- sesión abierta se corta en la siguiente petición (lo comprueba `requireAdmin`).
-- Reactivar = volver a NULL; conserva su contraseña.
--
-- NO usar `prisma db pull`: el campo ya está escrito a mano en schema.prisma.

ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS disabled_at DATETIME NULL;

-- Desactivar / reactivar (ejemplo):
--   UPDATE admin_users SET disabled_at = NOW() WHERE username IN ('usuario1', 'usuario2');
--   UPDATE admin_users SET disabled_at = NULL  WHERE username = 'usuario1';
