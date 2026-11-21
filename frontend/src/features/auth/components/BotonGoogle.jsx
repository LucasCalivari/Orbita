import { authApi } from '../api.js';

// RF-01: el acceso es únicamente con cuenta de Google.
// Es un link (no fetch) porque el navegador tiene que ir a Google y volver.
export default function BotonGoogle({ modo = 'registro' }) {
  return (
    <div className="botones-sociales">
      <a className="boton boton--secundario" href={authApi.urlGoogle(modo)}>
        Continuar con Google
      </a>
    </div>
  );
}
