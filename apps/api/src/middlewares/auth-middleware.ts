import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { AppError } from "../errors/app-error.js";
import { CustomJwtPayload } from "../types/express.js";

export function verifyToken(req: Request, _res: Response, next: NextFunction) {
  try {
    console.log("Here");
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new AppError("Unauthorized: Token is required", 401);
    }

    const verifiedUser = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    ) as CustomJwtPayload;

    // const verifiedUser = jwt.decode(accessToken);

    if (!verifiedUser) {
      throw new AppError("Unauthorized: Token verification failed", 401);
    }

    req.user = verifiedUser;

    next();
  } catch (error) {
    next(error);
  }
}

export function roleGuard(role: string) {
  return async function (req: Request, _res: Response, next: NextFunction) {
    try {
      if (role === "SUPER_ADMIN") {
        next();
        return;
      }

      if (role !== req.user?.role) {
        throw new AppError("Forbidden: Unauthorized access", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
