import { env } from '../../config/env.js';
import { ErrorApp } from '../errors/ErrorApp.js';
import { COOKIES, leerCookies, opcionesCookie } from './cookies.js';
import { aSegundos, firmarToken, verificarToken } from './tokens.js';

// Sesión compartida por CU-01 (registro) y CU-02 (inicio de sesión).
// CU-01 la inicia al terminar el registro; CU-02 la reutiliza al loguear y agrega el control por rol.

/** Crea la cookie de sesión con el id y el rol del usuario. */
export function iniciarSesion(res, usuario) {
  const token = firmarToken({ sub: usuario.id, rol: usuario.rol }, env.jwtExpiresIn);
  res.cookie(COOKIES.SESION, token, opcionesCookie(aSegundos(env.jwtExpiresIn)));
}

export function cerrarSesion(res) {
  res.clearCookie(COOKIES.SESION, opcionesCookie());
}

/** Middleware: exige sesión válida y deja { id, rol } en req.usuario. */
export function autenticar(req, res, next) {
  const payload = verificarToken(leerCookies(req)[COOKIES.SESION]);
  if (!payload) return next(new ErrorApp(401, 'Necesitás iniciar sesión'));
  req.usuario = { id: payload.sub, rol: payload.rol };
  next();
}
