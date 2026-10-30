import { Request, Response } from "express";
import { usersService } from "./users.service";
import { setCacheHeader } from "../../utils/cacheHeader";

export const usersController = {
  async getMe(req: Request, res: Response) {
    const { profile, cacheHit } = await usersService.getMe(req.userId!);
    setCacheHeader(res, cacheHit);
    res.status(200).json({ success: true, data: profile });
  },

  async updateMe(req: Request, res: Response) {
    const profile = await usersService.updateMe(req.userId!, req.body.name);
    res.status(200).json({ success: true, data: profile });
  },
};
