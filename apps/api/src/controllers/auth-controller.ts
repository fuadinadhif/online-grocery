import { Request, Response, NextFunction } from "express";
import { genSalt, hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import { prisma } from "../configs/prisma.js";
import { AppError } from "../errors/app-error.js";
import { generateReferralCode } from "../utils/generate-referral-code.js";
import { sendRegistrationEmail } from "../services/auth-service/email-service.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, name, profileImage, provider, isVerified } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("User already exist", 400);
    }

    let referralCode: string;

    do {
      referralCode = generateReferralCode();
    } while (await prisma.user.findUnique({ where: { referralCode } }));

    const user = await prisma.user.create({
      data: {
        name,
        email,
        profileImage,
        referralCode,
        provider,
        isVerified,
      },
    });

    const verificationToken = crypto.randomBytes(20).toString("hex");
    const verificationLink = `${process.env.WEB_DOMAIN}/auth/customer/complete-registration?token=${verificationToken}`;

    await prisma.token.create({
      data: {
        token: verificationToken,
        userId: user.id,
        type: "EMAIL_VERIFICATION",
        expiredAt: new Date(Date.now() + 1000 * 60 * 5),
      },
    });

    await sendRegistrationEmail(email, verificationLink);

    res
      .status(201)
      .json({ message: "Registration success. Please confirm your email" });
  } catch (error) {
    next(error);
  }
}

export async function validateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.body.token;

    if (!token) {
      throw new AppError("Token is missing", 404);
    }

    const existingToken = await prisma.token.findFirst({
      where: { token },
    });

    if (
      !existingToken ||
      existingToken.isUsed ||
      existingToken.expiredAt < new Date()
    ) {
      throw new AppError("Invalid token", 400);
    }

    const tokenData = await prisma.token.update({
      where: { id: existingToken.id },
      data: { isUsed: true },
    });

    const userData = await prisma.user.findUnique({
      where: { id: tokenData.userId },
    });

    res
      .status(200)
      .json({
        message: "Successfully validate token",
        data: { email: userData?.email },
      });
  } catch (error) {
    next(error);
  }
}

export async function completeRegistration(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, name, password } = req.body;

    const salt = await genSalt(10);
    const hashedPassword = password ? await hash(password, salt) : null;

    await prisma.user.update({
      where: { email },
      data: {
        name,
        password: hashedPassword,
        isVerified: true,
        Cart: {
          create: { totalPrice: 0 },
        },
      },
    });

    res
      .status(200)
      .json({ message: "Registration complete. Please proceed to login" });
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

    const validPassword = await compare(password, user.password as string);

    if (!validPassword) {
      throw new AppError("Invalid credentials", 400);
    }

    const jwtPayload = {
      name: user.name,
      email: user.email,
      picture: user.profileImage,
      role: user.role,
    };

    const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain:
          process.env.NODE_ENV === "production"
            ? "online-grocery.com"
            : "localhost",
      })
      .status(200)
      .json({
        message: "Log in successfully",
      });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    req.user = null;
    res
      .clearCookie("accessToken")
      .status(200)
      .json({ message: "Log out successfully" });
  } catch (error) {
    next(error);
  }
}

export async function sendEmailVerification() {}

export async function resetPassword() {}
