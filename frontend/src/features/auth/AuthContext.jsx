import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from './api.js';

export const AuthContext = createContext(null);

/**
 * Guarda el usuario logueado y su rol para toda la app.
 * Al cargar la página consulta al backend si hay una sesión activa.
 * Mientras /api/auth/me no exista (antes de CU-02), simplemente queda sin sesión.
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const refrescarSesion = useCallback(async () => {
    try {
      setUsuario(await authApi.obtenerSesion());
    } catch {
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    refrescarSesion();
  }, [refrescarSesion]);

  const cerrarSesion = useCallback(async () => {
    try {
      await authApi.cerrarSesion();
    } finally {
      setUsuario(null);
    }
  }, []);

  const valor = useMemo(
    () => ({ usuario, cargando, refrescarSesion, cerrarSesion }),
    [usuario, cargando, refrescarSesion, cerrarSesion],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
