import { env } from '../../config/env.js';
import { ErrorApp } from '../../shared/errors/ErrorApp.js';

// Integración con Google OAuth 2.0 / OpenID Connect (RF-01: acceso solo con cuenta de Google).
// Se usa fetch nativo de Node 20+, sin librerías externas.

const URL_AUTORIZACION = 'https://accounts.google.com/o/oauth2/v2/auth';
const URL_TOKEN = 'https://oauth2.googleapis.com/token';
const URL_PERFIL = 'https://openidconnect.googleapis.com/v1/userinfo';

function credenciales() {
  const { clientId, clientSecret, redirectUri } = env.google;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new ErrorApp(500, 'Faltan GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET o GOOGLE_REDIRECT_URI en backend/.env');
  }
  return { clientId, clientSecret, redirectUri };
}

/** URL a la que se redirige al usuario para elegir su cuenta de Google. */
export function urlAutorizacion(estado) {
  const { clientId, redirectUri } = credenciales();
  const parametros = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state: estado,
    prompt: 'select_account',
  });
  return `${URL_AUTORIZACION}?${parametros}`;
}

/**
 * Canjea el código que devuelve Google por el perfil del usuario.
 * Devuelve { socialId, email, emailVerificado, nombre, apellido }.
 */
export async function obtenerPerfil(codigo) {
  const { clientId, clientSecret, redirectUri } = credenciales();

  const respuestaToken = await fetch(URL_TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: codigo,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  if (!respuestaToken.ok) throw new ErrorApp(502, 'Google rechazó la autenticación');
  const { access_token: accessToken } = await respuestaToken.json();

  const respuestaPerfil = await fetch(URL_PERFIL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!respuestaPerfil.ok) throw new ErrorApp(502, 'No se pudo obtener el perfil de Google');
  const perfil = await respuestaPerfil.json();

  return {
    socialId: perfil.sub,
    email: perfil.email,
    emailVerificado: perfil.email_verified === true,
    nombre: perfil.given_name ?? perfil.name ?? '',
    apellido: perfil.family_name ?? '',
  };
}
