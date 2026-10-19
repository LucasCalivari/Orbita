import BotonesSociales from '../components/BotonesSociales.jsx';

// Pantalla compartida por CU-01 (registro) y CU-02 (inicio de sesión).
export default function IngresarPage() {
  return (
    <section className="tarjeta tarjeta--centrada">
      <h1 className="texto-degrade">Ingresá a Órbita</h1>
      <p className="nota">Usá tu cuenta de Google o Facebook.</p>
      <BotonesSociales />
    </section>
  );
}
