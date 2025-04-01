import express from "express";
import {
  completeRegistration,
  login,
  register,
  validateToken,
} from "../controllers/auth-controller.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/validate-token").put(validateToken);
router.route("/complete-registration").put(completeRegistration);

export default router;
