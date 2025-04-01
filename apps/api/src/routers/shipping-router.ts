import express from "express";

import { getShippingOptions } from "../controllers/shipping-controller.js";

const router = express.Router();

router.route("/options").post(getShippingOptions);

export default router;
