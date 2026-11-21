import { Router } from 'express';
import { validar } from '../../shared/middlewares/validar.js';
import { autenticar } from '../../shared/auth/sesion.js';
import { registroSchema } from './auth.schemas.js';
import * as controller from './auth.controller.js';

// CU-01 (registro) y base de sesión que reutiliza CU-02. RF-01: acceso solo con Google.
export const authRouter = Router();

authRouter.get('/google', controller.iniciarGoogle);
authRouter.get('/google/callback', controller.callbackGoogle);

authRouter.get('/registro/pendiente', controller.obtenerRegistroPendiente);
authRouter.post('/registro', validar(registroSchema), controller.registrar);

authRouter.get('/me', autenticar, controller.obtenerSesion);
authRouter.post('/logout', controller.salir);
