import express, { Request, Response } from 'express';
import path from 'path';


export const app = express();
const _dirName = path.join(path.resolve(), '..', 'frontend', 'dist');

app.use(express.json());
app.use(express.static(_dirName));

app.get('/', (_req:Request, res:Response) => {    
    res.sendFile(path.join(_dirName, 'index.html'));
});