import { Router } from 'express';
import { saludRouter } from './modules/salud/salud.routes.js';

// Junta las rutas de todos los módulos bajo /api.
export const router = Router();

router.use('/health', saludRouter);

// A medida que se implementa cada CU, su módulo registra acá sus rutas. Ej:
// router.use('/auth', authRouter);           // CU-01, CU-02
// router.use('/productos', productosRouter); // CU-03, CU-06
