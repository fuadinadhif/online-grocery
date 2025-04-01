import express from "express";

import { addCartItem, removeCartItem } from "../controllers/cart-controller.js";

const router = express.Router();

router.route("/add").put(addCartItem);
router.route("/remove").put(removeCartItem);

export default router;
