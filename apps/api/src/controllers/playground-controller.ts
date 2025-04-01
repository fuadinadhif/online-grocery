import { Request, Response, NextFunction } from "express";

export async function playground(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.status(200).json({ message: "Only shows for logged in user" });
  } catch (error) {
    next(error);
  }
}
