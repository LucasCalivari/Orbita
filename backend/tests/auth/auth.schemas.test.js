import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registroSchema } from '../../src/modules/auth/auth.schemas.js';

const valido = {
  nombre: 'Melina',
  apellido: 'Mas Duarte',
  dni: '40123456',
  direccion: {
    calle: 'San Martín', numero: '123', localidad: 'Paraná', provincia: 'Entre Ríos',
    codPostal: '3100', referencia: 'Portón negro',
  },
};

const camposConError = (datos) =>
  registroSchema.safeParse(datos).error?.issues.map((i) => i.path.join('.')) ?? [];

test('formulario completo es válido y convierte altura y código postal a número', () => {
  const resultado = registroSchema.parse(valido);
  assert.equal(resultado.direccion.numero, 123);
  assert.equal(resultado.direccion.codPostal, 3100);
});

test('DNI con puntos, letras o de largo incorrecto es inválido', () => {
  for (const dni of ['40.123.456', '4012345A', '123456', '123456789']) {
    assert.deepEqual(camposConError({ ...valido, dni }), ['dni'], `dni ${dni}`);
  }
});

test('campos complementarios vacíos se informan uno por uno', () => {
  const errores = camposConError({
    ...valido,
    dni: '',
    direccion: { ...valido.direccion, calle: '  ', referencia: '' },
  });
  assert.deepEqual(errores.sort(), ['direccion.calle', 'direccion.referencia', 'dni']);
});

test('provincia fuera de la lista y código postal inválido son rechazados', () => {
  const errores = camposConError({
    ...valido,
    direccion: { ...valido.direccion, provincia: 'Montevideo', codPostal: '12' },
  });
  assert.deepEqual(errores.sort(), ['direccion.codPostal', 'direccion.provincia']);
});

test('apellido vacío es inválido (Google a veces no lo envía)', () => {
  assert.deepEqual(camposConError({ ...valido, apellido: '' }), ['apellido']);
});
