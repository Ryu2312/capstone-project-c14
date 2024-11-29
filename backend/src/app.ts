import express from 'express';
import path from 'path';
import { router } from './routes';
import errorHandler from './middleware/error-handler';


export const app = express();
const _dirName = path.join(path.resolve(), '..', 'frontend', 'dist');

app.use(express.json());
app.use(express.static(_dirName));
app.use(router)

app.use(errorHandler);