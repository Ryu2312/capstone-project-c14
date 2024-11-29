import { NextFunction, Request, Response, Router } from "express"
import { AuthService, CsvService }  from "../services";
import path from "path";
import { loginSchema } from "../models/data.schema";
import jwt from "jsonwebtoken";
import multer from "multer";

export const router = Router();
const upload = multer({dest: 'uploads/'});

router.get('/', (_req:Request, res:Response) => {    
    res.sendFile(path.join(__dirname, 'index.html'));
});

router.post('/login', 
    async (req:Request, res:Response, next:NextFunction) => {
        try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await AuthService(email, password);

        const payload = {
            id: user.id,
            email: user.email,
        };

        const token = jwt.sign(payload, process.env.JWTSECRETKEY as string, {
            expiresIn: "40000m",
        });

        res.status(200).json({
            ok: true,
            data: token,
        })
        } catch (error) {
          next(error);
        }
})

router.post("/upload",
   upload.single("file"), 
   async (req: Request, res: Response, next : NextFunction) => {
  try {
    const result = await CsvService(req.file);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
  
    
