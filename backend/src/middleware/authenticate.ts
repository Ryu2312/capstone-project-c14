import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "./error-handler";


export function authenticateHandler(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new ApiError("No autorizado", 401));
    }

    const payload = jwt.verify(token, process.env.JWTSECRETKEY as string) as {
      id: number;
      username: string;
      iat: number;
      exp: number;
    };

    req.id = payload.id;
    req.username = payload.username;

    next();
  } catch (error) {
    return next(new ApiError("No autorizado", 401));
  }
}

declare global {
  namespace Express {
    interface Request {
      id: number;
      username: string;
    }
  }
}