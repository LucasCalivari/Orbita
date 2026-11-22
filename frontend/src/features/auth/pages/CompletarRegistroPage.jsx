import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api.js';
import { useAuth } from '../useAuth.js';
import { PROVINCIAS } from '../provincias.js';

// CU-01 pasos 5 a 7: formulario de datos complementarios que Google no provee (RF-02).

const VACIO = {
  nombre: '', apellido: '', dni: '',
  calle: '', numero: '', localidad: '', provincia: 'Entre Ríos', codPostal: '', referencia: '',
};

// El backend devuelve los errores con la ruta del campo (ej. "direccion.calle").
const nombreCampo = (ruta) => ruta.replace(/^direccion\./, '');

// Los campos son obligatorios salvo que se indique obligatorio={false}; se marcan con *.
// El asterisco es visual (aria-hidden): los lectores de pantalla ya anuncian el atributo required.
function Campo({ id, etiqueta, error, obligatorio = true, children }) {
  return (
    <div className={`campo${error ? ' campo--error' : ''}`}>
      <label htmlFor={id}>
        {etiqueta}
        {obligatorio && <span className="marca-obligatorio" aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && <span className="campo__error" id={`${id}-error`}>{error}</span>}
    </div>
  );
}

export default function CompletarRegistroPage() {
  const navigate = useNavigate();
  const { refrescarSesion } = useAuth();
  const [email, setEmail] = useState('');
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [estado, setEstado] = useState('cargando'); // cargando | listo | enviando

  // Precarga lo que trajo Google. Si la vinculación venció, vuelve a /registro.
  useEffect(() => {
    authApi
      .obtenerRegistroPendiente()
      .then((datos) => {
        setEmail(datos.email);
        setValores((v) => ({ ...v, nombre: datos.nombre ?? '', apellido: datos.apellido ?? '' }));
        setEstado('listo');
      })
      .catch(() => navigate('/registro?aviso=vencido', { replace: true }));
  }, [navigate]);

  const cambiar = (evento) => {
    const { name, value } = evento.target;
    setValores((v) => ({ ...v, [name]: value }));
    setErrores((e) => ({ ...e, [name]: undefined }));
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setEstado('enviando');
    setErrorGeneral('');
    try {
      const { nombre, apellido, dni, ...direccion } = valores;
      await authApi.registrar({ nombre, apellido, dni, direccion });
      // Paso 7: cuenta creada y sesión iniciada → se actualiza la página.
      await refrescarSesion();
      navigate('/', { replace: true });
    } catch (error) {
      if (error.status === 401) return navigate('/registro?aviso=vencido', { replace: true });
      if (error.detalles?.some((d) => d.campo === 'email')) {
        return navigate('/ingresar?aviso=cuenta-existente', { replace: true });
      }
      // Flujo alternativo: campos vacíos o inválidos → se resaltan en rojo y se conservan los datos.
      if (Array.isArray(error.detalles)) {
        setErrores(Object.fromEntries(error.detalles.map((d) => [nombreCampo(d.campo), d.mensaje])));
        setErrorGeneral('Revisá los campos marcados en rojo.');
      } else {
        setErrorGeneral(error.message || 'No pudimos crear tu cuenta. Volvé a intentarlo.');
      }
      setEstado('listo');
    }
  };

  if (estado === 'cargando') return <p className="nota">Cargando tus datos de Google…</p>;

  const entrada = (nombre, props = {}) => (
    <input
      id={nombre}
      name={nombre}
      value={valores[nombre]}
      onChange={cambiar}
      aria-invalid={Boolean(errores[nombre])}
      aria-describedby={errores[nombre] ? `${nombre}-error` : undefined}
      required
      {...props}
    />
  );

  return (
    <section className="tarjeta tarjeta--formulario">
      <h1 className="texto-degrade">Completá tus datos</h1>
      <p className="nota">
        Los necesitamos para emitir tus comprobantes y hacerte llegar los pedidos. Cuenta de Google: <strong>{email}</strong>
      </p>

      <p className="nota leyenda-obligatorios">
        Los campos marcados con <span className="marca-obligatorio" aria-hidden="true">*</span> son obligatorios.
      </p>

      {errorGeneral && <p className="aviso aviso--error" role="alert">{errorGeneral}</p>}

      <form className="formulario" onSubmit={enviar} noValidate>
        <fieldset>
          <legend>Datos personales</legend>
          <div className="formulario__fila">
            <Campo id="nombre" etiqueta="Nombre" error={errores.nombre}>{entrada('nombre', { autoComplete: 'given-name' })}</Campo>
            <Campo id="apellido" etiqueta="Apellido" error={errores.apellido}>{entrada('apellido', { autoComplete: 'family-name' })}</Campo>
          </div>
          <Campo id="dni" etiqueta="DNI (sin puntos)" error={errores.dni}>
            {entrada('dni', { inputMode: 'numeric', maxLength: 8, placeholder: '40123456' })}
          </Campo>
        </fieldset>

        <fieldset>
          <legend>Dirección de entrega</legend>
          <div className="formulario__fila">
            <Campo id="calle" etiqueta="Calle" error={errores.calle}>{entrada('calle', { autoComplete: 'address-line1' })}</Campo>
            <Campo id="numero" etiqueta="Altura" error={errores.numero}>{entrada('numero', { inputMode: 'numeric' })}</Campo>
          </div>
          <div className="formulario__fila">
            <Campo id="localidad" etiqueta="Localidad" error={errores.localidad}>{entrada('localidad', { autoComplete: 'address-level2' })}</Campo>
            <Campo id="codPostal" etiqueta="Código postal" error={errores.codPostal}>
              {entrada('codPostal', { inputMode: 'numeric', maxLength: 4, autoComplete: 'postal-code' })}
            </Campo>
          </div>
          <Campo id="provincia" etiqueta="Provincia" error={errores.provincia}>
            <select id="provincia" name="provincia" value={valores.provincia} onChange={cambiar} aria-invalid={Boolean(errores.provincia)} required>
              {PROVINCIAS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Campo>
          <Campo id="referencia" etiqueta="Referencia del domicilio (opcional)" error={errores.referencia} obligatorio={false}>
            {entrada('referencia', { required: false, maxLength: 255, placeholder: 'Ej.: casa con portón negro, timbre 2' })}
          </Campo>
        </fieldset>

        <button type="submit" disabled={estado === 'enviando'}>
          {estado === 'enviando' ? 'Creando tu cuenta…' : 'Crear cuenta'}
        </button>
      </form>
    </section>
  );
}
