import { Request, Response } from "express";
import { authService } from "./auth.service";

export const authController = {
  async signup(req: Request, res: Response) {
    const user = await authService.signup(req.body);
    res.status(201).json({ success: true, data: user });
  },
};
