// RF-01: autenticación únicamente con proveedores sociales.
// Se habilitan y conectan con el backend en CU-01 / CU-02.
const PROVEEDORES = [
  { id: 'google', etiqueta: 'Continuar con Google' },
  { id: 'facebook', etiqueta: 'Continuar con Facebook' },
];

export default function BotonesSociales({ onSeleccionar, deshabilitado = true }) {
  return (
    <div className="botones-sociales">
      {PROVEEDORES.map((p) => (
        <button
          key={p.id}
          type="button"
          className="boton boton--secundario"
          disabled={deshabilitado}
          onClick={() => onSeleccionar?.(p.id)}
        >
          {p.etiqueta}
        </button>
      ))}
    </div>
  );
}
