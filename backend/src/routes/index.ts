import { NextFunction, Request, Response, Router } from "express"
import { authService, registerService }  from "../services";
import path from "path";
import { loginSchema, Result } from "../models/data.schema";
import jwt from "jsonwebtoken";
import { authenticateHandler } from "../middleware/authenticate";
import Busboy from "busboy";
import Papa from "papaparse";

export const router = Router();

router.get("/", (_req:Request, res:Response) => {    
  res.sendFile(path.join(__dirname, 'index.html'));
});

router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await registerService({data: req.body, row: 1});
    res.status(200).json(result);
    
  } catch (error) {
    next(error);
  }
})

router.post("/login", 
  async (req:Request, res:Response, next:NextFunction) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await authService(email, password);

      const payload = {
        id: user.id,
        email: user.email,
      };

      const token = jwt.sign(payload, process.env.JWTSECRETKEY as string, {
        expiresIn: "40000m",
      });

      res.status(200).json({
        ok: true,
        token,
      })
    } catch (error) {
      next(error);
    }
})

router.post("/upload", async (req: Request, res: Response, next: NextFunction) => {
  const busboy = Busboy({ headers: req.headers });
  const processingPromises: Promise<{ success: boolean; result: Result }>[] = [];
  let index = 0;

  busboy.on('file', (fieldname, file, info) => {
    console.log(fieldname,info)

    const papaStream = Papa.parse(Papa.NODE_STREAM_INPUT, {
      skipEmptyLines: true,
      dynamicTyping: true,
      header: true,
    });

    file.pipe(papaStream)

    papaStream.on('data',(chunk) => {
      processingPromises.push(registerService({data: chunk, row: index++})); 
    });
    
    papaStream.on('end',async () => {
      try {
        // Esperamos que todas las promesas se resuelvan
        const result = await Promise.all(processingPromises);
        
        const success = result.filter((item) => item.success).length;
        const failed = result.filter((item) => !item.success);
        res.status(201).json({ ok: true, success, failed });

      } catch (error) {
        next(error);  // Manejamos cualquier error que ocurra durante el procesamiento
      }
    });

    papaStream.on('error', (error) => {
       next(error);
    })

  });

  req.pipe(busboy);
});
  
router.post("/register",authenticateHandler, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await registerService(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
})
