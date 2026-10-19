import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth.js';
import { ROLES } from '../../features/auth/roles.js';

export default function Navbar() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="navbar__marca">ÓRBITA</Link>
      <nav className="navbar__links">
        <NavLink to="/" end>Catálogo</NavLink>
        {usuario?.rol === ROLES.ADMIN_VENTAS && <NavLink to="/admin">Panel</NavLink>}
        {usuario?.rol === ROLES.SOPORTE && <NavLink to="/soporte">Consola</NavLink>}
        {usuario ? (
          <>
            <span className="navbar__usuario">{usuario.nombre}</span>
            <button type="button" className="boton boton--secundario" onClick={cerrarSesion}>
              Salir
            </button>
          </>
        ) : (
          <NavLink to="/ingresar" className="boton">Ingresar</NavLink>
        )}
      </nav>
    </header>
  );
}
