import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
}

export function errorMiddleware(
  error: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const message = error.message || "General error. Good luck!";

  res.status(statusCode).json({ message });
}
