import { ZodSchema, ZodError, ZodIssue } from "zod";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "./error-handler";

export function validationHandler<T>(schema: ZodSchema<T>) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const body = schema.parse(req.body);
      req.body = body;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new ApiError("Error de validación", 400, formatIssues(error.issues))
        );
      } else {
        next(error);
      }
    }
  };
}

export function formatIssues(errors: ZodIssue[]) {
  const errorList = errors.map((error) => [error.path, error.message]);
  return Object.fromEntries(errorList);
}