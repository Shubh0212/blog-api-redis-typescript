import { Router } from "express";
import { authController } from "../modules/auth/auth.controller";
import { validate } from "../middlewares/validate";
import { signupSchema } from "../modules/auth/auth.schema";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
router.post(
  "/signup",
  validate(signupSchema),
  asyncHandler(authController.signup),
);
export default router;
