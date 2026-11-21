import { randomBytes } from 'node:crypto';
import { env } from '../../config/env.js';
import { ErrorApp } from '../../shared/errors/ErrorApp.js';
import { COOKIES, leerCookies, opcionesCookie } from '../../shared/auth/cookies.js';
import { cerrarSesion, iniciarSesion } from '../../shared/auth/sesion.js';
import { aSegundos, firmarToken, verificarToken } from '../../shared/auth/tokens.js';
import * as google from './auth.google.js';
import { authService } from './auth.service.js';

// Lee la request, llama al service y arma la respuesta. No habla con la base.

const DURACION_ESTADO_OAUTH = '10m';
const DURACION_REGISTRO_PENDIENTE = '15m';
const MODOS = ['registro', 'ingreso'];

/** Redirige al frontend con un aviso para mostrar (?aviso=...). */
function volverAlFront(res, ruta, aviso) {
  const url = new URL(ruta, env.frontendUrl);
  if (aviso) url.searchParams.set('aviso', aviso);
  res.redirect(url.toString());
}

function leerRegistroPendiente(req) {
  return verificarToken(leerCookies(req)[COOKIES.REGISTRO_PENDIENTE]);
}

/** GET /api/auth/google?modo=registro|ingreso → redirige a Google (paso 3 del CU-01). */
export function iniciarGoogle(req, res, next) {
  try {
    const modo = MODOS.includes(req.query.modo) ? req.query.modo : 'registro';
    const estado = randomBytes(16).toString('hex');
    res.cookie(
      COOKIES.ESTADO_OAUTH,
      firmarToken({ estado, modo }, DURACION_ESTADO_OAUTH),
      opcionesCookie(aSegundos(DURACION_ESTADO_OAUTH)),
    );
    res.redirect(google.urlAutorizacion(estado));
  } catch (error) {
    next(error);
  }
}

/** GET /api/auth/google/callback → Google vuelve acá con ?code o ?error (pasos 4-5). */
export async function callbackGoogle(req, res) {
  const guardado = verificarToken(leerCookies(req)[COOKIES.ESTADO_OAUTH]);
  res.clearCookie(COOKIES.ESTADO_OAUTH, opcionesCookie());
  const paginaOrigen = guardado?.modo === 'ingreso' ? '/ingresar' : '/registro';

  // Flujo alternativo: el usuario canceló la vinculación con Google. No se guarda nada.
  if (req.query.error) return volverAlFront(res, paginaOrigen, 'cancelado');

  if (!guardado || !req.query.code || guardado.estado !== req.query.state) {
    return volverAlFront(res, paginaOrigen, 'error');
  }

  try {
    const perfil = await google.obtenerPerfil(req.query.code);
    const resultado = await authService.procesarPerfilGoogle(perfil);

    if (resultado.tipo === 'cuenta-existente') {
      // Flujo alternativo "correo ya registrado": se deriva al inicio de sesión (CU-02).
      // TODO CU-02 (Lucas): si guardado.modo === 'ingreso', acá se inicia la sesión del usuario
      // existente (validando que esté activo) y se redirige según su rol.
      return volverAlFront(res, '/ingresar', 'cuenta-existente');
    }

    // Se guardan los datos de Google en una cookie firmada y temporal, no en la base:
    // si el formulario tiene errores no hace falta volver a autenticarse.
    res.cookie(
      COOKIES.REGISTRO_PENDIENTE,
      firmarToken(resultado.pendiente, DURACION_REGISTRO_PENDIENTE),
      opcionesCookie(aSegundos(DURACION_REGISTRO_PENDIENTE)),
    );
    return volverAlFront(res, '/registro/completar');
  } catch (error) {
    if (!(error instanceof ErrorApp) || error.status >= 500) console.error(error);
    return volverAlFront(res, paginaOrigen, error.status === 403 ? 'sin-verificar' : 'error');
  }
}

/** GET /api/auth/registro/pendiente → datos de Google para precargar el formulario. */
export function obtenerRegistroPendiente(req, res, next) {
  const pendiente = leerRegistroPendiente(req);
  if (!pendiente) return next(new ErrorApp(401, 'La vinculación con Google venció. Volvé a intentarlo.'));
  const { nombre, apellido, email } = pendiente;
  res.json({ nombre, apellido, email });
}

/** POST /api/auth/registro → crea la cuenta e inicia la sesión (pasos 6-7). */
export async function registrar(req, res, next) {
  try {
    const pendiente = leerRegistroPendiente(req);
    if (!pendiente) throw new ErrorApp(401, 'La vinculación con Google venció. Volvé a intentarlo.');

    const usuario = await authService.registrar(pendiente, req.body);

    res.clearCookie(COOKIES.REGISTRO_PENDIENTE, opcionesCookie());
    iniciarSesion(res, usuario);
    res.status(201).json(usuario);
  } catch (error) {
    next(error);
  }
}

/** GET /api/auth/me → usuario de la sesión actual. */
export async function obtenerSesion(req, res, next) {
  try {
    res.json(await authService.obtenerUsuarioDeSesion(req.usuario.id));
  } catch (error) {
    next(error);
  }
}

/** POST /api/auth/logout */
export function salir(req, res) {
  cerrarSesion(res);
  res.status(204).end();
}
