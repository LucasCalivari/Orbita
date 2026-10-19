// Nombres de rol tal como están en la tabla `rol` de la base (seed 001_roles.sql).
export const ROLES = {
  USUARIO: 'usuario',
  ADMIN_VENTAS: 'administrador_ventas',
  SOPORTE: 'soporte',
};

// CU-02 paso 5: a dónde se redirige a cada rol después de iniciar sesión.
export const RUTA_INICIAL_POR_ROL = {
  [ROLES.USUARIO]: '/',
  [ROLES.ADMIN_VENTAS]: '/admin',
  [ROLES.SOPORTE]: '/soporte',
};
