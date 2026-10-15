// CU-01 (registro) y CU-02 (inicio de sesión): autenticación solo con redes sociales (RF-01).
// Los botones se conectan a los proveedores en las ramas de cada CU.
export default function Ingresar() {
  return (
    <section className="tarjeta">
      <h1>Ingresá a Orbita</h1>
      <p>Usá tu cuenta de Google o de una red social.</p>
      <div className="botones-sociales">
        <button type="button" disabled>Continuar con Google</button>
        <button type="button" disabled>Continuar con Facebook</button>
        <button type="button" disabled>Continuar con Instagram</button>
      </div>
    </section>
  );
}
