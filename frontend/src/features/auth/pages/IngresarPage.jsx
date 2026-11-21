import { Link, useSearchParams } from 'react-router-dom';
import BotonGoogle from '../components/BotonGoogle.jsx';

// Avisos que llegan desde el backend en ?aviso=... (flujos alternativos de CU-01 / CU-02).
const AVISOS = {
  cancelado: { tipo: 'info', texto: 'Cancelaste la vinculación con Google. No se guardó ningún dato.' },
  'cuenta-existente': { tipo: 'info', texto: 'Ya tenés una cuenta en Órbita. Iniciá sesión con tu cuenta de Google.' },
  vencido: { tipo: 'error', texto: 'Pasó demasiado tiempo desde que elegiste tu cuenta. Volvé a intentarlo.' },
  'sin-verificar': { tipo: 'error', texto: 'Tu cuenta de Google no tiene el correo verificado.' },
  error: { tipo: 'error', texto: 'No pudimos conectar con Google. Volvé a intentarlo.' },
};

const TEXTOS = {
  registro: {
    titulo: 'Creá tu cuenta en Órbita',
    bajada: 'El registro se hace con tu cuenta de Google. Después te pedimos tu DNI y la dirección de entrega.',
    alternativa: { pregunta: '¿Ya tenés cuenta?', link: '/ingresar', texto: 'Iniciá sesión' },
  },
  ingreso: {
    titulo: 'Ingresá a Órbita',
    bajada: 'Usá tu cuenta de Google.',
    alternativa: { pregunta: '¿Todavía no tenés cuenta?', link: '/registro', texto: 'Registrate' },
  },
};

// Pantalla compartida por CU-01 (/registro) y CU-02 (/ingresar).
export default function IngresarPage({ modo = 'ingreso' }) {
  const [parametros] = useSearchParams();
  const aviso = AVISOS[parametros.get('aviso')];
  const textos = TEXTOS[modo];

  return (
    <section className="tarjeta tarjeta--centrada">
      <h1 className="texto-degrade">{textos.titulo}</h1>
      <p className="nota">{textos.bajada}</p>
      {aviso && (
        <p className={`aviso aviso--${aviso.tipo}`} role={aviso.tipo === 'error' ? 'alert' : 'status'}>
          {aviso.texto}
        </p>
      )}
      <BotonGoogle modo={modo} />
      <p className="nota">
        {textos.alternativa.pregunta} <Link to={textos.alternativa.link}>{textos.alternativa.texto}</Link>
      </p>
    </section>
  );
}
