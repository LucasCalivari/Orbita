// Cliente HTTP único hacia la API. Todas las páginas usan este archivo.
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
    error.detalles = datos.detalles;
    throw error;
  }
  return datos;
}

export const api = {
  get: (ruta) => solicitar('GET', ruta),
  post: (ruta, cuerpo) => solicitar('POST', ruta, cuerpo),
  put: (ruta, cuerpo) => solicitar('PUT', ruta, cuerpo),
  delete: (ruta) => solicitar('DELETE', ruta),
};
