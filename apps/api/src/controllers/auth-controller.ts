import { Request, Response, NextFunction } from "express";
import { genSalt, hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import { prisma } from "../configs/prisma.js";
import { AppError } from "../errors/app-error.js";
import { generateReferralCode } from "../utils/generate-referral-code.js";
import { sendEmail, updateTokenUsage } from "../services/auth-service.js";

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
      if (existingUser.isVerified) {
        throw new AppError("User already exist", 400);
      }

      res.status(201).json({ message: "Email confirmation has been sent" });
      return;
    }

    let referralCode: string;

    do {
      referralCode = generateReferralCode();
    } while (await prisma.user.findUnique({ where: { referralCode } }));

    await prisma.user.create({
      data: {
        name,
        email,
        profileImage,
        referralCode,
        provider,
        isVerified,
      },
    });

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
    const token = req.query.token;

    if (!token) {
      throw new AppError("Token is missing", 404);
    }

    const existingToken = await prisma.token.findFirst({
      where: { token: token as string },
      include: { User: true },
    });

    if (
      !existingToken ||
      existingToken.isUsed ||
      existingToken.expiredAt < new Date()
    ) {
      throw new AppError("Invalid token", 400);
    }

    res.status(200).json({
      message: "Successfully validate token",
      data: { user: { email: existingToken.User.email } },
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
    const token = req.query.token;
    const { name, password } = req.body;

    if (!token) {
      throw new AppError("Token is missing", 404);
    }

    const existingToken = await prisma.token.findFirst({
      where: {
        token: token as string,
        isUsed: false,
        expiredAt: { gte: new Date() },
      },
      include: { User: true },
    });

    if (!existingToken) {
      throw new AppError("Invalid token", 400);
    }

    const salt = await genSalt(10);
    const hashedPassword = password ? await hash(password, salt) : null;

    const user = await prisma.user.update({
      where: { email: existingToken.User.email },
      data: {
        name,
        password: hashedPassword,
        isVerified: true,
        Cart: {
          create: { totalPrice: 0 },
        },
      },
    });

    await updateTokenUsage({ userId: user.id, type: "COMPLETE_REGISTRATION" });

    res
      .status(200)
      .json({ message: "Registration complete. Please proceed to login" });
  } catch (error) {
    next(error);
  }
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("User does not exist", 400);
    }

    if (user.provider === "GOOGLE") {
      throw new AppError(
        "Your email registered using Google. Please continue using Google instead",
        400
      );
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

export async function signOut(req: Request, res: Response, next: NextFunction) {
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

export async function sendVerificationEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { type, email, clientURL, expiredInMS = 1000 * 60 * 60 } = req.body;

    if (!type || !email || !clientURL || !expiredInMS) {
      throw new AppError("Missing required fields", 400);
    }

    const verificationToken = crypto.randomBytes(20).toString("hex");
    const verificationLink = `${process.env.WEB_DOMAIN}${clientURL}?token=${verificationToken}`;

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const emailDetails = {
      COMPLETE_REGISTRATION: {
        subject: "Complete Registration",
        templatePath: "src/templates/complete-registration-template.hbs",
      },
      EMAIL_VERIFICATION: {
        subject: "Email Verification",
        templatePath: "src/templates/email-verification-template.hbs",
      },
      RESET_PASSWORD: {
        subject: "Reset Password",
        templatePath: "src/templates/reset-password-template.hbs",
      },
    };

    type EmailType = keyof typeof emailDetails;

    const emailInfo = emailDetails[type as EmailType];
    const subject = emailInfo.subject;
    const templatePath = emailInfo.templatePath;

    await updateTokenUsage({ userId: user.id, type });

    await prisma.token.create({
      data: {
        token: verificationToken,
        userId: user.id,
        type,
        expiredAt: new Date(Date.now() + expiredInMS),
      },
    });

    await sendEmail({
      email,
      emailLink: verificationLink,
      templatePath,
      from: "Online Grocery <no-replyg@killthemagic.dev>",
      subject,
    });

    res
      .status(200)
      .json({ message: "Successfully send the verification email" });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.query.token;

    if (!token) {
      throw new AppError("Token is missing", 404);
    }
    const existingToken = await prisma.token.findFirst({
      where: {
        token: token as string,
        isUsed: false,
        expiredAt: { gte: new Date() },
      },
      include: { User: true },
    });

    if (!existingToken) {
      throw new AppError("Invalid token", 400);
    }

    const { newPassword } = req.body;

    if (!newPassword) {
      throw new AppError("Missing required fields", 400);
    }

    const salt = await genSalt(10);
    const hashedPassword = newPassword ? await hash(newPassword, salt) : null;

    await prisma.user.update({
      where: { email: existingToken.User.email },
      data: {
        password: hashedPassword,
      },
    });

    await updateTokenUsage({
      userId: existingToken.User.id,
      type: "RESET_PASSWORD",
    });

    res
      .status(200)
      .json({ message: "Password reset successfully. Please login again" });
  } catch (error) {
    next(error);
  }
}
