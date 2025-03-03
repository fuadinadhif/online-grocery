import express from "express";
import { getShippingCost } from "../controllers/order-controller.js";

const router = express.Router();

router.route("/shipping-cost").post(getShippingCost);

export default router;
