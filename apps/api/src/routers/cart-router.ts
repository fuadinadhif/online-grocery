import express from "express";

import { addCartItem, removeCartItem } from "../controllers/cart-controller.js";

const router = express.Router();

router.route("/items").put(addCartItem);
router.route("/items/:id").put(removeCartItem);

export default router;
