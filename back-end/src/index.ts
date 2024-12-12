import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

import { db } from './configs';
import routes from './routes';
import { errorHandler } from './middlewares';

const app = express();
const port = process.env.PORT || 3000;
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// app.use(express.json({ limit: '5mb' })); // Giới hạn kích thước payload
// app.use(express.urlencoded({ extended: true, limit: '5mb' }));

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
