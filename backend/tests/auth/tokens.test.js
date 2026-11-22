import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.JWT_SECRET ??= 'secreto-de-prueba';
const { aSegundos, firmarToken, verificarToken } = await import('../../src/shared/auth/tokens.js');

test('un token firmado se verifica y conserva el payload', () => {
  const payload = verificarToken(firmarToken({ sub: 5, rol: 'usuario' }, '1h'));
  assert.equal(payload.sub, 5);
  assert.equal(payload.rol, 'usuario');
});

test('un token adulterado se rechaza', () => {
  const [cabecera, , firma] = firmarToken({ sub: 5, rol: 'usuario' }, '1h').split('.');
  const cuerpoFalso = Buffer.from(JSON.stringify({ sub: 5, rol: 'soporte', exp: 9999999999 })).toString('base64url');
  assert.equal(verificarToken(`${cabecera}.${cuerpoFalso}.${firma}`), null);
});

test('un token vencido se rechaza', () => {
  assert.equal(verificarToken(firmarToken({ sub: 5 }, -10)), null);
});

test('valores que no son tokens devuelven null', () => {
  assert.equal(verificarToken(undefined), null);
  assert.equal(verificarToken('abc'), null);
});

test('aSegundos entiende s, m, h y d', () => {
  assert.equal(aSegundos('30s'), 30);
  assert.equal(aSegundos('15m'), 900);
  assert.equal(aSegundos('8h'), 28800);
  assert.equal(aSegundos('2d'), 172800);
});
