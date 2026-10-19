// Cliente HTTP único hacia la API. Las features lo usan desde su propio api.js;
// las páginas nunca llaman a fetch directamente.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function solicitar(metodo, ruta, cuerpo) {
  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    const error = new Error(datos.error || `Error ${respuesta.status}`);
    error.status = respuesta.status;
    error.detalles = datos.detalles; // errores por campo que devuelve validar() del backend
    throw error;
  }
  return datos;
}

export const http = {
  get: (ruta) => solicitar('GET', ruta),
  post: (ruta, cuerpo) => solicitar('POST', ruta, cuerpo),
  put: (ruta, cuerpo) => solicitar('PUT', ruta, cuerpo),
  delete: (ruta) => solicitar('DELETE', ruta),
};
