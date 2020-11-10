import 'dotenv/config';
import express from 'express';
import logger from 'morgan';
import routes from './routes';

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

app.use(express.json());

app.use('/api/v1', routes);

export default app;
