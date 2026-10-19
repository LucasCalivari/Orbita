import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ErrorApp } from '../../src/shared/errors/ErrorApp.js';
import { noEncontrado } from '../../src/shared/middlewares/noEncontrado.js';

test('ErrorApp guarda status, mensaje y detalles', () => {
  const error = new ErrorApp(409, 'El correo ya está registrado', { campo: 'email' });
  assert.equal(error.status, 409);
  assert.equal(error.message, 'El correo ya está registrado');
  assert.deepEqual(error.detalles, { campo: 'email' });
  assert.ok(error instanceof Error);
});

test('noEncontrado responde 404 con la ruta pedida', () => {
  const req = { method: 'GET', originalUrl: '/api/inexistente' };
  const res = {
    status(codigo) { this.codigo = codigo; return this; },
    json(cuerpo) { this.cuerpo = cuerpo; },
  };
  noEncontrado(req, res);
  assert.equal(res.codigo, 404);
  assert.match(res.cuerpo.error, /\/api\/inexistente/);
});
