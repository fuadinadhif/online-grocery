import express from "express";

import { lookup } from "../controllers/user-controller.js";

const router = express.Router();

router.route("/lookup").post(lookup);

export default router;
