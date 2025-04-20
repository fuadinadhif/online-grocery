import express from "express";
import {
  completeRegistration,
  signIn,
  register,
  sendVerificationEmail,
  validateToken,
  resetPassword,
} from "../controllers/auth-controller.js";

const router = express.Router();

router.route("/sign-in").post(signIn);
router.route("/register").post(register);
router.route("/register/complete").put(completeRegistration);
router.route("/email/verification").post(sendVerificationEmail);
router.route("/token/validate").get(validateToken);
router.route("/password/reset").post(resetPassword);

export default router;
