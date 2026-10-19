import { http } from '../../shared/services/http.js';

// Endpoints de /api/auth. Se implementan en el backend en CU-01 y CU-02.
export const authApi = {
  /** Devuelve el usuario de la sesión actual: { id, nombre, apellido, email, rol } */
  obtenerSesion: () => http.get('/auth/me'),
  cerrarSesion: () => http.post('/auth/logout'),
};
