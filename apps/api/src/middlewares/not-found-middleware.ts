import { Request, Response } from "express";
export function notFoundMiddleware(_req: Request, res: Response) {
  res
    .status(404)
    .json({ message: "The route you are looking for does not exist" });
}
