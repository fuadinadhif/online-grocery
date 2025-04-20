import { NextFunction, Request, Response } from "express";

import { prisma } from "../configs/prisma.js";
import { AppError } from "../errors/app-error.js";
import { Provider } from "@prisma/client";

export async function lookupUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const email = req.query.email as string;
    const provider = req.query.provider as Provider;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    if (provider) {
      if (!Object.values(Provider).includes(provider)) {
        throw new AppError("Invalid provider", 400);
      }
    }

    const user = await prisma.user.findUnique({
      where: { email, ...(provider && { provider }) },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}
