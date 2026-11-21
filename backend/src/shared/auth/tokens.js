import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '../../config/env.js';

// Tokens firmados (JWT HS256) hechos con node:crypto, sin dependencias externas.
// Se usan para la cookie de sesión y para la cookie temporal de "registro pendiente" (CU-01).

const base64url = (valor) => Buffer.from(valor).toString('base64url');

function secreto() {
  if (!env.jwtSecret) {
    throw new Error('Falta la variable de entorno JWT_SECRET. Revisá backend/.env (ver .env.example).');
  }
  return env.jwtSecret;
}

function firma(contenido) {
  return createHmac('sha256', secreto()).update(contenido).digest('base64url');
}

/** Convierte '8h', '15m', '30s', '2d' o un número de segundos a segundos. */
export function aSegundos(duracion) {
  if (typeof duracion === 'number') return duracion;
  const coincidencia = /^(\d+)\s*([smhd])$/.exec(String(duracion).trim());
  if (!coincidencia) throw new Error(`Duración inválida: ${duracion}`);
  const factor = { s: 1, m: 60, h: 3600, d: 86400 }[coincidencia[2]];
  return Number(coincidencia[1]) * factor;
}

/** Firma un payload y le agrega iat/exp. */
export function firmarToken(payload, duracion) {
  const ahora = Math.floor(Date.now() / 1000);
  const cabecera = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const cuerpo = base64url(JSON.stringify({ ...payload, iat: ahora, exp: ahora + aSegundos(duracion) }));
  return `${cabecera}.${cuerpo}.${firma(`${cabecera}.${cuerpo}`)}`;
}

/** Devuelve el payload si la firma es válida y no venció; si no, null. */
export function verificarToken(token) {
  if (typeof token !== 'string') return null;
  const partes = token.split('.');
  if (partes.length !== 3) return null;
  const [cabecera, cuerpo, firmaRecibida] = partes;

  const esperada = Buffer.from(firma(`${cabecera}.${cuerpo}`));
  const recibida = Buffer.from(firmaRecibida);
  if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida)) return null;

  try {
    const payload = JSON.parse(Buffer.from(cuerpo, 'base64url').toString('utf8'));
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
