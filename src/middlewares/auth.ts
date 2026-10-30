import { Request, Response, NextFunction } from "express";
import { RedisKeys } from "../constants/redis";
import { getString } from "../utils/cache";
import { sessionRepository } from "../repository/session.repository";
import { cacheSession } from "../modules/auth/session.cache";
import { AppError } from "../utils/AppError";

export const auth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw new AppError(401, "Authentication required");

    let userId = await getString(RedisKeys.session(token)); // Redis first
    if (!userId) {
      const session = await sessionRepository.findByToken(token); // fall back to MongoDB
      if (!session || session.expiresAt.getTime() <= Date.now()) {
        throw new AppError(401, "Invalid or expired session");
      }
      userId = session.userId.toString();
      await cacheSession(token, userId, session.expiresAt); // re-cache with remaining TTL
    }

    req.userId = userId;
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
};
