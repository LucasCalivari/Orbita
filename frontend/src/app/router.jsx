import { Routes, Route } from 'react-router-dom';
import Layout from '../shared/layout/Layout.jsx';
import RutaProtegida from '../features/auth/components/RutaProtegida.jsx';
import { ROLES } from '../features/auth/roles.js';
import CatalogoPage from '../features/catalogo/pages/CatalogoPage.jsx';
import IngresarPage from '../features/auth/pages/IngresarPage.jsx';
import PanelAdminPage from '../features/admin/pages/PanelAdminPage.jsx';
import ConsolaSoportePage from '../features/soporte/pages/ConsolaSoportePage.jsx';
import NoEncontradoPage from './NoEncontradoPage.jsx';

// Rutas públicas: catálogo e ingreso (RF-05: navegación libre).
// Rutas protegidas por rol (CU-02, RNF-06): /admin y /soporte.
export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CatalogoPage />} />
        <Route path="/ingresar" element={<IngresarPage />} />

        <Route element={<RutaProtegida roles={[ROLES.ADMIN_VENTAS]} />}>
          <Route path="/admin" element={<PanelAdminPage />} />
        </Route>

        <Route element={<RutaProtegida roles={[ROLES.SOPORTE]} />}>
          <Route path="/soporte" element={<ConsolaSoportePage />} />
        </Route>

        <Route path="*" element={<NoEncontradoPage />} />
      </Route>
    </Routes>
  );
}
