import { NextFunction, Request, Response, Router } from "express"
import path from "path";
import  usersService  from "../services";
import jwt from "jsonwebtoken";
import { validationHandler } from "../middleware/validation-data";
import { dataSchema, loginSchema } from "../models/login.schema";
import multer from "multer";
import { readFile } from "fs/promises";
const { parse } = require("csv-parse/sync");
/* import Papa from "papaparse"; */
/* import fs from "fs"; */



export const router = Router();
const upload = multer({dest: 'uploads/'});

router.get('/', (_req:Request, res:Response) => {    
    res.sendFile(path.join(__dirname, 'index.html'));
});

router.post('/login', 
    validationHandler(loginSchema), 
    async (req, res, next) => {
        try {
        const { email, password } = req.body;
        const user = await usersService.login(email, password);

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

router.post(
  "/upload",
  validationHandler(dataSchema), 
  upload.single("file"), 
  (req: Request, res: Response,next : NextFunction) => {
  try {
    const file = req.file?.path as string;

    const data = readFile(file, "utf-8");
    const parsedData = parse(data)

    res.status(200).json({
      ok: true,
      data: parsedData,
    });
  } catch (error) {
    next(error);
  }
}); 