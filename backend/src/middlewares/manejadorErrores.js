import { env } from '../config/env.js';

/**
 * Error de negocio con código HTTP. Los servicios lanzan este error
 * (ej: new ErrorApp(409, 'El correo ya está registrado')) y este middleware
 * lo convierte en una respuesta JSON uniforme.
 */
export class ErrorApp extends Error {
  constructor(status, mensaje, detalles) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles;
  }
}

// eslint-disable-next-line no-unused-vars
export function manejadorErrores(error, req, res, next) {
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({
    error: status >= 500 && env.nodeEnv === 'production' ? 'Error interno del servidor' : error.message,
    ...(error.detalles && { detalles: error.detalles }),
  });
}
