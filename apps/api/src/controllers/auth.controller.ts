import { Request, Response, NextFunction } from "express";
import { genSalt, hash, compare } from "bcryptjs";

import { prisma } from "../configs/prisma.js";
import { AppError } from "../errors/app.error.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password, name, profileImage } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("User already exist", 400);
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profileImage,
      },
    });

    res
      .status(201)
      .json({ message: "New user added, please confirm your email." });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("User does not exist", 400);
    }

    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      throw new AppError("Invalid credentials", 400);
    }

    res.status(200).json({
      message: "Login success",
      data: {
        name: user.name,
        email: user.email,
        image: user.profileImage,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}
