import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const __dirname = path.join(path.resolve(), '..', 'frontend', 'dist');
app.use(express.static(__dirname));

app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});
