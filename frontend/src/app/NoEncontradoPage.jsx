import { Link } from 'react-router-dom';

export default function NoEncontradoPage() {
  return (
    <section>
      <h1>Página no encontrada</h1>
      <Link to="/">Volver al catálogo</Link>
    </section>
  );
}
