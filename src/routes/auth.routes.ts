import { Router } from "express";
import { authController } from "../modules/auth/auth.controller";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { loginSchema, signupSchema } from "../modules/auth/auth.schema";
import { loginRateLimit } from "../middlewares/loginRateLimit";
import { auth } from "../middlewares/auth";

const router = Router();
router.post(
  "/signup",
  validate(signupSchema),
  asyncHandler(authController.signup),
);
router.post(
  "/login",
  validate(loginSchema),
  loginRateLimit,
  asyncHandler(authController.login),
);
router.post("/logout", auth, asyncHandler(authController.logout));
export default router;
