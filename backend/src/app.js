import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { router } from './routes.js';
import { noEncontrado } from './shared/middlewares/noEncontrado.js';
import { manejadorErrores } from './shared/middlewares/manejadorErrores.js';

// Arma la aplicación Express. No levanta el puerto (eso lo hace server.js),
// así los tests pueden usar la app sin abrir un servidor.
export const app = express();

app.use(helmet());
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
if (env.nodeEnv !== 'test') app.use(morgan('dev'));

app.use('/api', router);

app.use(noEncontrado);
app.use(manejadorErrores);
