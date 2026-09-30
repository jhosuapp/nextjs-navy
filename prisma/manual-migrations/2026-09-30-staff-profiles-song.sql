-- Navy — migración manual sobre la base de datos `Bot`
-- Fecha: 2026-09-30
--
-- Canción de Spotify del perfil público del staff.
--
-- Solo AÑADE columnas a `staff_profiles` (tabla propia del panel).
-- Se guarda el id del track y una copia de título/artista/portada: la web
-- pública no llama a Spotify para pintar la card, solo carga el reproductor
-- embebido cuando alguien pulsa ▶. Los metadatos los resuelve el servidor
-- con la API de Spotify al guardar (nunca se aceptan del cliente).
--
-- NO usar `prisma db pull`: los campos ya están escritos a mano en schema.prisma.

ALTER TABLE staff_profiles
  ADD COLUMN IF NOT EXISTS spotify_track_id VARCHAR(22)  NULL,
  ADD COLUMN IF NOT EXISTS spotify_title    VARCHAR(200) NULL,
  ADD COLUMN IF NOT EXISTS spotify_artist   VARCHAR(200) NULL,
  ADD COLUMN IF NOT EXISTS spotify_cover    VARCHAR(255) NULL;
