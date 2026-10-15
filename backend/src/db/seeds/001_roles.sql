-- RNF-06: perfiles separados de usuario, Administrador de Ventas y Soporte.
INSERT INTO rol (nombre_rol, descripcion) VALUES
  ('usuario',              'Cliente de la tienda: compra, wishlist, reseñas'),
  ('administrador_ventas', 'Operación comercial: productos, stock, pedidos, promociones'),
  ('soporte',              'Mantenimiento del sistema, permisos y auditoría')
ON CONFLICT (nombre_rol) DO NOTHING;
