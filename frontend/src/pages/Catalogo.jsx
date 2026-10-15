import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

// Pantalla de inicio. El catálogo real se implementa en CU-03.
export default function Catalogo() {
  const [estadoApi, setEstadoApi] = useState('verificando…');

  useEffect(() => {
    api.get('/health')
      .then((r) => setEstadoApi(`${r.estado} · base de datos ${r.baseDeDatos}`))
      .catch(() => setEstadoApi('sin conexión con la API'));
  }, []);

  return (
    <section>
      <h1>Catálogo</h1>
      <p>Próximamente: búsqueda y filtros de auriculares (CU-03).</p>
      <p className="nota">Estado de la API: {estadoApi}</p>
    </section>
  );
}
