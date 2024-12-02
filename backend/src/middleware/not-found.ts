import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    res.status(404).json({
      message: "Not Found",
      path: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
};