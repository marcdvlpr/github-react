import 'dotenv/config';
import express, { Application } from 'express';
import logger from 'morgan';
import routes from './routes';

const app: Application = express();

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1', routes);

export default app;
