import express from "express";

import { playground } from "../controllers/playground-controller.js";
import { verifyToken } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.route("/").get(verifyToken, playground);

export default router;
