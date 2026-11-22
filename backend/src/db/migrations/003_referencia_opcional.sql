-- CU-01: decisión del equipo (21/11/2026): la referencia del domicilio pasa a ser opcional.
-- Si el usuario no la completa se guarda NULL.

ALTER TABLE direccion ALTER COLUMN referencia DROP NOT NULL;
