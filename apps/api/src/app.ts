import "./configs/env.js";

import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routers/auth-router.js";
import orderRouter from "./routers/order-router.js";
import shippingRouter from "./routers/shipping-router.js";
import userRouter from "./routers/user-router.js";
import playgroundRouter from "./routers/playground-router.js";
import cartRouter from "./routers/cart-router.js";

import { notFoundMiddleware } from "./middlewares/not-found-middleware.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.production
      ? "https://onlinegrocery.com"
      : "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/api/v1/status", (_req: Request, res: Response) => {
  res.status(200).json({ message: "API is running" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/shippings", shippingRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/playgrounds", playgroundRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.info(`Server is listening on port: ${PORT}`);
});
