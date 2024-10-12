import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { db } from './configs';
import routes from './routes';
import { errorHandler } from '~/middlewares';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(errorHandler);

db.connect();

app.use('/api/v1', routes);

app.listen(port, () => {
  console.log('Server is running on port', port);
});
