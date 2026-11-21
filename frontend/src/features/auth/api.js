import { BASE_URL, http } from '../../shared/services/http.js';

// Endpoints de /api/auth (CU-01 registro, CU-02 inicio de sesión). RF-01: solo Google.
export const authApi = {
  /** URL a la que se navega (no fetch) para empezar el flujo OAuth con Google. */
  urlGoogle: (modo = 'registro') => `${BASE_URL}/auth/google?modo=${encodeURIComponent(modo)}`,

  /** CU-01: datos que trajo Google (nombre, apellido, email) para precargar el formulario. */
  obtenerRegistroPendiente: () => http.get('/auth/registro/pendiente'),

  /** CU-01: envía DNI y dirección; el backend crea la cuenta e inicia la sesión. */
  registrar: (datos) => http.post('/auth/registro', datos),

  /** Devuelve el usuario de la sesión actual: { id, nombre, apellido, email, rol } */
  obtenerSesion: () => http.get('/auth/me'),
  cerrarSesion: () => http.post('/auth/logout'),
};
