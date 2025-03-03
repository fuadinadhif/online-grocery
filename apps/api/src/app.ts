import "./configs/env.js";

import express, { Application, Request, Response } from "express";

import authRouter from "./routers/auth.router.js";
import orderRouter from "./routers/order-router.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get("/api/v1/status", (_req: Request, res: Response) => {
  res.status(200).json({ message: "API is running" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/order", orderRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.info(`Server is listening on port: ${PORT}`);
});
