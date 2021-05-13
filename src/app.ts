import 'dotenv/config';
import express, { Application } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import logger from 'morgan';
import path from 'path';
import routes from './routes';

const app: Application = express();

app.use(helmet());
app.use(compression());

if (process.env.NODE_ENV === 'development') app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/v1', routes);

export default app;
