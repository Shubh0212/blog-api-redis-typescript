import { Router } from "express";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";

const router = Router();
router.get("/health", (_req, res) => res.json({ status: "ok" }));
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
export default router;
