// Carga los datos iniciales de db/seeds. Los scripts son idempotentes (se pueden correr varias veces).
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const carpeta = path.join(path.dirname(fileURLToPath(import.meta.url)), 'seeds');

async function main() {
  const archivos = (await readdir(carpeta)).filter((f) => f.endsWith('.sql')).sort();
  for (const archivo of archivos) {
    await pool.query(await readFile(path.join(carpeta, archivo), 'utf8'));
    console.log(`✔ Seed cargado: ${archivo}`);
  }
}

main()
  .catch((error) => {
    console.error('✖ Error al cargar seeds:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
