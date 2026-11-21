import { z } from 'zod';

// CU-01 / RF-02: datos complementarios que Google no provee.
// "Domicilio exacto de entrega (Paraná o provincias)": se pide la provincia de una lista cerrada.
export const PROVINCIAS = [
  'Buenos Aires', 'Ciudad Autónoma de Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones',
  'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
  'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
];

const textoObligatorio = (campo, max) =>
  z
    .string({ required_error: `${campo} es obligatorio`, invalid_type_error: `${campo} es obligatorio` })
    .trim()
    .min(1, `${campo} es obligatorio`)
    .max(max, `${campo} admite hasta ${max} caracteres`);

const enteroPositivo = (campo, { min = 1, max } = {}) =>
  z.coerce
    .number({ invalid_type_error: `${campo} debe ser un número` })
    .int(`${campo} debe ser un número entero`)
    .min(min, `${campo} no es válido`)
    .max(max ?? Number.MAX_SAFE_INTEGER, `${campo} no es válido`);

export const registroSchema = z.object({
  // Vienen precargados desde Google; se pueden corregir (Google a veces no envía el apellido).
  nombre: textoObligatorio('El nombre', 100),
  apellido: textoObligatorio('El apellido', 100),
  dni: z
    .string({ required_error: 'El DNI es obligatorio' })
    .trim()
    .regex(/^[0-9]{7,8}$/, 'El DNI debe tener 7 u 8 números, sin puntos'),
  direccion: z.object(
    {
      calle: textoObligatorio('La calle', 150),
      numero: enteroPositivo('La altura', { max: 99999 }),
      localidad: textoObligatorio('La localidad', 100),
      provincia: z.enum(PROVINCIAS, {
        errorMap: () => ({ message: 'Elegí una provincia de la lista' }),
      }),
      codPostal: enteroPositivo('El código postal', { min: 1000, max: 9999 }),
      referencia: textoObligatorio('La referencia del domicilio', 255),
    },
    { required_error: 'La dirección es obligatoria' },
  ),
});
