import { Request, Response } from "express";
export function notFoundMiddleware(req: Request, res: Response) {
  res
    .status(404)
    .json({ message: "The route you are looking for does not exist" });
}
