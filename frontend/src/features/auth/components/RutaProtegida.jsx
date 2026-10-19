import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../useAuth.js';
import { RUTA_INICIAL_POR_ROL } from '../roles.js';

/**
 * Protege rutas por sesión y por rol (CU-02, RNF-06).
 *   - Sin sesión → /ingresar (y vuelve a la ruta pedida al loguearse)
 *   - Con sesión pero otro rol → a la pantalla inicial de su rol
 *
 *   <Route element={<RutaProtegida roles={[ROLES.SOPORTE]} />}> ... </Route>
 *
 * Importante: esto solo oculta pantallas. La seguridad real está en el backend,
 * que valida el rol en cada endpoint.
 */
export default function RutaProtegida({ roles }) {
  const { usuario, cargando } = useAuth();
  const ubicacion = useLocation();

  if (cargando) return <p className="nota">Verificando sesión…</p>;

  if (!usuario) {
    return <Navigate to="/ingresar" replace state={{ desde: ubicacion.pathname }} />;
  }

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to={RUTA_INICIAL_POR_ROL[usuario.rol] ?? '/'} replace />;
  }

  return <Outlet />;
}
