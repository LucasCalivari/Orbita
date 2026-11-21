import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ErrorApp } from '../../src/shared/errors/ErrorApp.js';

// El service importa el repositorio real (que lee la config), pero estos tests no tocan la base.
process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';
const { crearAuthService } = await import('../../src/modules/auth/auth.service.js');

// Repositorio falso en memoria: el service no sabe que no hay base de datos.
function repositorioFalso({ usuarios = [], dnis = [], errorAlCrear } = {}) {
  return {
    creados: [],
    async buscarPorEmail(email) {
      return usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
    },
    async buscarPorId(id) {
      return usuarios.find((u) => u.id === id) ?? null;
    },
    async existeDni(dni) {
      return dnis.includes(dni);
    },
    async crearUsuarioConDireccion(datos) {
      if (errorAlCrear) throw errorAlCrear;
      this.creados.push(datos);
      return { id: 1, nombre: datos.nombre, apellido: datos.apellido, email: datos.email, rol: 'usuario' };
    },
  };
}

const perfilGoogle = {
  socialId: 'google-123',
  email: 'Melina@Gmail.com',
  emailVerificado: true,
  nombre: 'Melina',
  apellido: 'Mas Duarte',
};

const formulario = {
  nombre: 'Melina',
  apellido: 'Mas Duarte',
  dni: '40123456',
  direccion: {
    calle: 'San Martín', numero: 123, localidad: 'Paraná', provincia: 'Entre Ríos',
    codPostal: 3100, referencia: 'Portón negro',
  },
};

const pendiente = { socialId: 'google-123', email: 'melina@gmail.com', nombre: 'Melina', apellido: 'Mas Duarte' };

test('perfil nuevo de Google → queda como registro pendiente con el correo en minúsculas', async () => {
  const service = crearAuthService(repositorioFalso());
  const resultado = await service.procesarPerfilGoogle(perfilGoogle);
  assert.equal(resultado.tipo, 'registro-pendiente');
  assert.deepEqual(resultado.pendiente, pendiente);
});

test('flujo alternativo: correo ya registrado → cuenta existente (se deriva a CU-02)', async () => {
  const service = crearAuthService(repositorioFalso({ usuarios: [{ id: 7, email: 'melina@gmail.com' }] }));
  const resultado = await service.procesarPerfilGoogle(perfilGoogle);
  assert.equal(resultado.tipo, 'cuenta-existente');
});

test('cuenta de Google sin correo verificado → 403', async () => {
  const service = crearAuthService(repositorioFalso());
  await assert.rejects(
    service.procesarPerfilGoogle({ ...perfilGoogle, emailVerificado: false }),
    (error) => error instanceof ErrorApp && error.status === 403,
  );
});

test('registro válido → crea el usuario con proveedor google y los datos complementarios', async () => {
  const repositorio = repositorioFalso();
  const service = crearAuthService(repositorio);
  const usuario = await service.registrar(pendiente, formulario);

  assert.equal(usuario.rol, 'usuario');
  assert.equal(repositorio.creados.length, 1);
  assert.equal(repositorio.creados[0].proveedor, 'google');
  assert.equal(repositorio.creados[0].socialId, 'google-123');
  assert.equal(repositorio.creados[0].dni, '40123456');
  assert.equal(repositorio.creados[0].direccion.localidad, 'Paraná');
});

test('DNI ya registrado → 409 con el error en el campo dni', async () => {
  const service = crearAuthService(repositorioFalso({ dnis: ['40123456'] }));
  await assert.rejects(service.registrar(pendiente, formulario), (error) => {
    assert.equal(error.status, 409);
    assert.equal(error.detalles[0].campo, 'dni');
    return true;
  });
});

test('correo registrado entre el callback y el envío del formulario → 409 cuenta existente', async () => {
  const service = crearAuthService(repositorioFalso({ usuarios: [{ id: 7, email: 'melina@gmail.com' }] }));
  await assert.rejects(service.registrar(pendiente, formulario), (error) => {
    assert.equal(error.status, 409);
    assert.equal(error.detalles[0].campo, 'email');
    return true;
  });
});

test('violación de unicidad en la base (registro simultáneo) → 409 y no un 500', async () => {
  const errorPg = Object.assign(new Error('duplicate key'), { code: '23505', constraint: 'usuario_dni_key' });
  const service = crearAuthService(repositorioFalso({ errorAlCrear: errorPg }));
  await assert.rejects(service.registrar(pendiente, formulario), (error) => {
    assert.equal(error.status, 409);
    assert.equal(error.detalles[0].campo, 'dni');
    return true;
  });
});

test('/me de un usuario inactivo → 401', async () => {
  const service = crearAuthService(repositorioFalso({ usuarios: [{ id: 3, email: 'x@gmail.com', activo: false }] }));
  await assert.rejects(service.obtenerUsuarioDeSesion(3), (error) => error.status === 401);
});
