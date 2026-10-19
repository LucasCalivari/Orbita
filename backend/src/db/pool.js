import pg from 'pg';
import { env } from '../config/env.js';

export const pool = new pg.Pool({ connectionString: env.databaseUrl });

/** Consulta simple. Los repositorios usan esta función, nunca el pool directo. */
export function query(texto, parametros) {
  return pool.query(texto, parametros);
}

/**
 * Ejecuta varias operaciones dentro de una transacción (ACID).
 * Se usa en operaciones críticas como registrar usuario + dirección,
 * o confirmar una compra y descontar stock.
 *
 *   await transaccion(async (cliente) => {
 *     await cliente.query('INSERT ...');
 *     await cliente.query('UPDATE ...');
 *   });
 */
export async function transaccion(trabajo) {
  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');
    const resultado = await trabajo(cliente);
    await cliente.query('COMMIT');
    return resultado;
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
}
