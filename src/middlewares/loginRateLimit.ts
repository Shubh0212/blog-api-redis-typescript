import { Request, Response, NextFunction } from "express";
import { redis } from "../providers/redis";
import { RedisKeys, RedisTTL, LOGIN_MAX_FAILS } from "../constants/redis";
import { AppError } from "../utils/AppError";

export const loginRateLimit = async (
  req: Request,
  _res: Request | Response,
  next: NextFunction,
) => {
  try {
    const key = RedisKeys.loginFail(req.body.email);
    const count = Number(await redis.get(key)) || 0;
    if (count >= LOGIN_MAX_FAILS) {
      const ttl = await redis.ttl(key);
      const minutes = Math.max(1, Math.ceil(ttl / 60));
      return next(
        new AppError(
          429,
          `Too many login attempts. Try again in ${minutes} minutes`,
        ),
      );
    }
  } catch (err) {
    console.error("Rate limit check skipped:", (err as Error).message); // allowed to skip
  }
  next();
};

export const recordLoginFailure = async (email: string) => {
  try {
    const key = RedisKeys.loginFail(email);
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, RedisTTL.loginFail);
  } catch (err) {
    console.error("recordLoginFailure failed:", (err as Error).message);
  }
};

export const clearLoginFailures = async (email: string) => {
  try {
    await redis.del(RedisKeys.loginFail(email));
  } catch (err) {
    console.error("clearLoginFailures failed:", (err as Error).message);
  }
};
