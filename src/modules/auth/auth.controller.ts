import { Request, Response } from "express";
import { authService } from "./auth.service";

export const authController = {
  async signup(req: Request, res: Response) {
    const user = await authService.signup(req.body);
    res.status(201).json({ success: true, data: user });
  },

  async login(req: Request, res: Response) {
    const data = await authService.login(
      req.body.email,
      req.body.password,
      req.get("user-agent") ?? "",
    );
    res.status(200).json({ success: true, data });
  },

  async logout(req: Request, res: Response) {
    await authService.logout(req.token!, req.userId!);
    res.status(200).json({ success: true, message: "Logged out" });
  },
};
