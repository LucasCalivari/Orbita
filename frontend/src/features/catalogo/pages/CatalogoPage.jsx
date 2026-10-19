import { useEffect, useState } from 'react';
import { http } from '../../../shared/services/http.js';

// Pantalla de inicio. El catálogo real (búsqueda, filtros, alertas de stock) es CU-03.
export default function CatalogoPage() {
  const [estadoApi, setEstadoApi] = useState('verificando…');

  useEffect(() => {
    http.get('/health')
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
