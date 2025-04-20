import express from "express";

import { lookupUser } from "../controllers/user-controller.js";

const router = express.Router();

router.route("/lookup").get(lookupUser);

export default router;
