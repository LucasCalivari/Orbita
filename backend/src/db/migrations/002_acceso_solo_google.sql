-- CU-01 / RF-01: decisión del equipo (21/11/2026): el acceso es únicamente con cuenta de Google.
-- Se quitan Facebook e Instagram de los proveedores permitidos.

ALTER TABLE usuario DROP CONSTRAINT IF EXISTS usuario_proveedor_social_check;
ALTER TABLE usuario
  ADD CONSTRAINT usuario_proveedor_social_check CHECK (proveedor_social IN ('google'));
