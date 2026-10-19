import { Router } from 'express';
import { query } from '../../db/pool.js';

export const saludRouter = Router();

// Verifica que la API esté levantada y que haya conexión con PostgreSQL.
saludRouter.get('/', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ estado: 'ok', baseDeDatos: 'conectada' });
  } catch {
    res.status(503).json({ estado: 'degradado', baseDeDatos: 'sin conexión' });
  }
});
