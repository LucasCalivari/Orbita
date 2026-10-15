import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Catalogo from './pages/Catalogo.jsx';
import Ingresar from './pages/Ingresar.jsx';
import PanelAdmin from './pages/PanelAdmin.jsx';
import ConsolaSoporte from './pages/ConsolaSoporte.jsx';
import NoEncontrado from './pages/NoEncontrado.jsx';

// Rutas de la Fase 1. CU-02 redirige según rol:
// usuario → /   ·   administrador_ventas → /admin   ·   soporte → /soporte
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Catalogo />} />
        <Route path="/ingresar" element={<Ingresar />} />
        <Route path="/admin" element={<PanelAdmin />} />
        <Route path="/soporte" element={<ConsolaSoporte />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}
