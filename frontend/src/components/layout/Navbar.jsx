import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar__marca">ORBITA</Link>
      <nav className="navbar__links">
        <NavLink to="/" end>Catálogo</NavLink>
        {/* CU-01 / CU-02: cuando haya sesión, acá se muestra el nombre del usuario y "Salir" */}
        <NavLink to="/ingresar" className="boton">Ingresar</NavLink>
      </nav>
    </header>
  );
}
