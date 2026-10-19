import { ErrorApp } from '../errors/ErrorApp.js';

/**
 * Valida el body de la request con un schema de Zod definido en el módulo.
 * Si hay errores responde 400 con el detalle por campo, para que el frontend
 * pueda resaltarlos en rojo (flujos alternativos de los CU).
 *
 *   router.post('/registro', validar(registroSchema), controller.registrar);
 */
export function validar(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);
    if (!resultado.success) {
      const detalles = resultado.error.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensaje: issue.message,
      }));
      return next(new ErrorApp(400, 'Datos inválidos', detalles));
    }
    req.body = resultado.data;
    next();
  };
}
