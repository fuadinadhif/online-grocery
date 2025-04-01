import { NextFunction, Request, Response } from "express";

import { prisma } from "../configs/prisma.js";
import { AppError } from "../errors/app-error.js";

export async function lookup(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Not Found: User not found", 404);
    }

    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}
