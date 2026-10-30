import { Router } from "express";
import { usersController } from "../modules/users/users.controller";
import { updateProfileSchema } from "../modules/users/users.schema";
import { validate } from "../middlewares/validate";
import { auth } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
router.get("/me", auth, asyncHandler(usersController.getMe));
router.patch(
  "/me",
  auth,
  validate(updateProfileSchema),
  asyncHandler(usersController.updateMe),
);
export default router;
