import { NextFunction, Request, Response } from "express";

import { prisma } from "../configs/prisma.js";
import { AppError } from "../errors/app-error.js";

export async function checkoutOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req?.user?.id },
      include: { CartItem: true },
    });

    if (!cart) {
      throw new AppError("Not Found: Cart not found", 404);
    }

    await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      await tx.cart.update({
        where: { id: cart.id },
        data: { totalPrice: 0 },
      });
    });

    res.status(200).json({ message: "Checkout successfully" });
  } catch (error) {
    next(error);
  }
}
