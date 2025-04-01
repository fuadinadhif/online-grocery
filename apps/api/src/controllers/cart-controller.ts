import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error.js";
import { prisma } from "../configs/prisma.js";

export async function addCartItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      throw new AppError("Bad Request: Required fields are missing", 400);
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: req?.user?.id },
      include: { CartItem: true },
    });

    if (!cart) {
      throw new AppError("Not Found: Cart not found", 404);
    }

    const existingCartItem = cart.CartItem.find(
      (item) => item.productId === productId
    );

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    res.status(200).json({ message: "Product added to the cart" });
  } catch (error) {
    next(error);
  }
}

export async function removeCartItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.body;

    if (!productId) {
      throw new AppError("Bad Request: Required fields are missing", 400);
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: req?.user?.id },
      include: { CartItem: true },
    });

    if (!cart) {
      throw new AppError("Not Found: Cart not found", 404);
    }

    const cartItem = cart.CartItem.find((item) => item.productId === productId);

    if (!cartItem) {
      throw new AppError("Not Found: Product not in cart", 404);
    }

    if (cartItem.quantity > 1) {
      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity - 1 },
      });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {},
      });
    }

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    next(error);
  }
}
