/**
 * Error de negocio con código HTTP.
 * Los services lanzan este error y el middleware manejadorErrores
 * lo convierte en una respuesta JSON uniforme.
 *
 *   throw new ErrorApp(409, 'El correo ya está registrado');
 */
export class ErrorApp extends Error {
  constructor(status, mensaje, detalles) {
    super(mensaje);
    this.name = 'ErrorApp';
    this.status = status;
    this.detalles = detalles;
  }
}
