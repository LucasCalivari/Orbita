// Ejecuta en orden los archivos .sql de db/migrations que todavía no se aplicaron.
// Cada migración corre dentro de una transacción y queda registrada en schema_migrations.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, transaccion } from './pool.js';

const carpeta = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations');

async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      nombre      VARCHAR(255) PRIMARY KEY,
      aplicada_en TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const { rows } = await pool.query('SELECT nombre FROM schema_migrations');
  const aplicadas = new Set(rows.map((r) => r.nombre));
  const archivos = (await readdir(carpeta)).filter((f) => f.endsWith('.sql')).sort();

  let nuevas = 0;
  for (const archivo of archivos) {
    if (aplicadas.has(archivo)) continue;
    const sql = await readFile(path.join(carpeta, archivo), 'utf8');
    await transaccion(async (cliente) => {
      await cliente.query(sql);
      await cliente.query('INSERT INTO schema_migrations (nombre) VALUES ($1)', [archivo]);
    });
    console.log(`✔ Migración aplicada: ${archivo}`);
    nuevas++;
  }
  console.log(nuevas ? `${nuevas} migración(es) aplicada(s).` : 'La base ya está al día.');
}

main()
  .catch((error) => {
    console.error('✖ Error al migrar:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
