import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { router } from './routes/index.js';
import { noEncontrado } from './middlewares/noEncontrado.js';
import { manejadorErrores } from './middlewares/manejadorErrores.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
if (env.nodeEnv !== 'test') app.use(morgan('dev'));

app.use('/api', router);

app.use(noEncontrado);
app.use(manejadorErrores);
