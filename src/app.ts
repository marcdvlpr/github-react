import 'dotenv/config';
import express, { Application } from 'express';
import logger from 'morgan';
import path from 'path';
import routes from './routes';
import { createImagesDirectory } from './helpers/directory';

const app: Application = express();

if (process.env.NODE_ENV === 'development') app.use(logger('dev'));

createImagesDirectory();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/v1', routes);

export default app;
