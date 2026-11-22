import { env } from '../../config/env.js';

// Nombres de las cookies que usa la autenticación.
export const COOKIES = {
  SESION: 'orbita_sesion',
  REGISTRO_PENDIENTE: 'orbita_registro_pendiente', // CU-01: datos de Google mientras completa el formulario
  ESTADO_OAUTH: 'orbita_oauth_estado',             // protección CSRF del flujo OAuth
};

/** Lee las cookies del header sin depender de cookie-parser. */
export function leerCookies(req) {
  const header = req.headers?.cookie;
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map((par) => {
      const indice = par.indexOf('=');
      const nombre = par.slice(0, indice).trim();
      const valor = par.slice(indice + 1).trim();
      try {
        return [nombre, decodeURIComponent(valor)];
      } catch {
        return [nombre, valor];
      }
    }),
  );
}

/**
 * Opciones comunes: httpOnly (el JS del navegador no las lee), SameSite=Lax
 * (front en :5173 y API en :4000 son el mismo "site" en localhost) y Secure en producción.
 */
export function opcionesCookie(maxAgeSegundos) {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
    path: '/',
    ...(maxAgeSegundos !== undefined && { maxAge: maxAgeSegundos * 1000 }),
  };
}
