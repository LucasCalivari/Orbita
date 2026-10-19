import { env } from '../../config/env.js';

// Último middleware de la app: recibe cualquier error lanzado en rutas, controllers o services.
// eslint-disable-next-line no-unused-vars
export function manejadorErrores(error, req, res, next) {
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({
    error: status >= 500 && env.nodeEnv === 'production' ? 'Error interno del servidor' : error.message,
    ...(error.detalles && { detalles: error.detalles }),
  });
}
